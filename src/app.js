import axios from 'axios';
import i18n from 'i18next';
import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import resources from './locales/index.js';
import getHandler, { renderText } from './view.js';
import parser from './parser.js';

const elements = {
  header: document.querySelector('.header'),
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  btn: document.querySelector('[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
  main: document.querySelector('.main'),
  posts: document.querySelector('.posts'),
  ul: document.querySelector('.group-feeds'),
  feeds: document.querySelector('.feeds'),
  modal: document.querySelector('.modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  read: document.querySelector('.read'),
  btnLng: document.querySelector('.btn-group-sm'),
};

const validate = (url, urls) => yup.string().trim().required().url('mustBeValid')
  .notOneOf(urls, 'rssExists')
  .validate(url);

const createPosts = (feedID, data) => (data.items.reverse().map((post) => {
  const { title, description, link } = post;
  return {
    id: _.uniqueId(), feedID, title, description, link,
  };
}));
const createViewPost = (data) => (data.map((post) => ({ postID: post.id, view: false })));
const updatePosts = (id, data, state) => {
  const posts = createPosts(id, data);
  const viewPost = createViewPost(posts);
  state.listOfPosts.push(...posts);
  state.viewPosts.push(...viewPost);
};

const createFeed = (url, data) => ({
  id: _.uniqueId(), url, title: data.title, description: data.description,
});
const updateFeeds = (state) => {
  const promise = state.listOfFeeds.map((feed) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`)
    .then((response) => {
      const { id } = feed;
      const newPosts = parser(response.data.contents).items;
      const oldPosts = state.listOfPosts.filter((post) => post.feedID === id);
      const diff = _.differenceWith(newPosts, oldPosts, (a, b) => a.link === b.link);

      if (diff.length > 0) {
        const data = {
          items: diff,
        };
        updatePosts(id, data, state);
      }
    })
    .catch((err) => {
      state.message = err;
    }));
  Promise.all(promise).finally(() => setTimeout(() => updateFeeds(state), 5000));
};
const addFeed = (url, data, state) => {
  const dataFeed = createFeed(url, data);
  const { id } = dataFeed;
  const dataPosts = createPosts(id, data);
  const dataView = createViewPost(dataPosts);
  state.urls.push(url);
  state.listOfFeeds.push(dataFeed);
  state.listOfPosts.push(...dataPosts);
  state.viewPosts.push(...dataView);
};

const defaultLng = 'ru';

export default () => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: defaultLng,
    debug: false,
    resources,
  })
    .then(() => renderText(i18nextInstance, elements))
    .then(() => {
      const state = {
        loadResult: '',
        message: null,
        urls: [],
        listOfFeeds: [],
        listOfPosts: [],
        viewPosts: [],
        modal: null,
        lng: defaultLng,
      };
      const watchedState = onChange(state, getHandler(state, i18nextInstance));
      elements.form.addEventListener('submit', ((event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        validate(url, state.urls)
          .then((link) => {
            watchedState.loadResult = 'preloader';
            return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`);
          })
          .then((response) => {
            const data = parser(response.data.contents);
            addFeed(url, data, watchedState);
            watchedState.loadResult = 'success';
            watchedState.message = 'success';
          })
          .catch((error) => {
            watchedState.loadResult = 'error';
            switch (error.message) {
              case ('Network Error'):
                watchedState.message = 'networkError';
                break;
              case ('mustBeValid'):
                watchedState.message = 'mustBeValid';
                break;
              case ('rssExists'):
                watchedState.message = 'rssExists';
                break;
              case ('Cannot read properties of null (reading \'textContent\')'):
                watchedState.message = 'notContainValid';
                break;
              case ('this is a required field'):
                watchedState.message = 'required';
                break;
              default:
                watchedState.message = 'default';
            }
          });
      }));
      elements.posts.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (id) {
          const [review] = watchedState.listOfPosts.filter((post) => post.id === id);
          watchedState.modal = review;
          watchedState.viewPosts.push({ postId: id, view: true });
        }
      });
      elements.btnLng.addEventListener('click', (event) => {
        event.preventDefault();
        const { lng } = event.target.dataset;
        if (lng) watchedState.lng = lng;
      });
      updateFeeds(watchedState);
    });
};
