import i18n from 'i18next';
import resources from './locales/index.js';
import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import {handler, renderText} from './view.js'
import axios from 'axios'
import parser from './parser.js'

export const elems = {
  header: document.querySelector('.header'),
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  btn: document.querySelector('[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
  main: document.querySelector('.main'),
  posts: document.querySelector('.posts'),
  ul: document.querySelector('.group-feeds'),
  card: document.querySelector('.card'),
  feeds: document.querySelector('.feeds'),
  modal: document.querySelector('.modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  read: document.querySelector('.read'),
}

const validate = (url, urls) => {
  return yup.string().url('mustBeValid').notOneOf(urls, 'rssExists').validate(url);
};

const createPosts = (feedID, data) => (
  data.items.reverse().map((post) => {
    const {title, description, link} = post;
    return {id: _.uniqueId(), feedID, title, description, link,}
  })
);

const createFeed = (url, data) => ({id: _.uniqueId(), url, title: data.title, description: data.description,});

const createViewPost = (data) => (data.map((post) => ({postID: post.id, view: false})))

const updatePosts = (id, data, state) => {
  const posts = createPosts(id, data);
  const viewPost = createViewPost(posts);
  state.listOfPosts.push(...posts);
  state.viewPosts.push(...viewPost);
}

const updateFeeds = (state) => {
  const promise = state.listOfFeeds.map((feed) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`)
    .then((response) => {
      const {id} = feed;
      const newPosts = parser(response.data.contents).items;
      const oldPosts = state.listOfPosts.filter((p) => p.feedID === id);
      const difference = _.differenceWith(
        newPosts, oldPosts, (a, b) => a.title === b.title,
      );

      if (difference.length > 0) {
        const diffData = {
          items: difference,
        };
        updatePosts(id, diffData, state);
      }
    })
    .catch((err) => {
      state.message = err;
    }));
  Promise.all(promise).finally(() => setTimeout(() => updateFeeds(state), 5000));
};

const addFeed = (url, data, state) => {
  const dataFeed = createFeed(url, data);
  const {id} = dataFeed;
  const dataPosts = createPosts(id, data);
  const dataView = createViewPost(dataPosts);
  state.urls.push(url);
  state.listOfFeeds.push(dataFeed);
  state.listOfPosts.push(...dataPosts);
  state.viewPosts.push(...dataView);
}

export default () => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => renderText(i18nextInstance))
    .then(() => {
      const state = {
        loadResult: '',
        message: null,
        urls: [],
        listOfFeeds: [],
        listOfPosts: [],
        viewPosts: [],
        modal: null,
      };
      const {loadResult, message, urls, listOfFeeds, listOfPosts, viewPosts, modal} = state;
      const watchedState = onChange(state, handler);
      const {form, input, btn, feedback, posts, ul, card, feeds} = elems;
      form.addEventListener('submit', ((event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        validate(url, state.urls)
          .then((link) => {
            watchedState.loadResult = 'preloader';
            return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
          })
          .then((response) => {
            const data = parser(response.data.contents);
            addFeed(url, data, watchedState);
            watchedState.loadResult = 'success';
            watchedState.message = 'success';
          })
          .catch((error) => {
            watchedState.loadResult = 'error';
            if (error.message === 'Network Error') {
              watchedState.message = 'networkError';
            } else if (error.name === 'ValidationError') {
              watchedState.message = error.message;
            } else {
              watchedState.message = 'notContainValid';
            }
          });
      }))
      elems.posts.addEventListener('click', (event) => {
        if (!event.target.classList.contains('btn')) return;
        const {id} = event.target.dataset;
        if (id) {
          const [reviewPost] = watchedState.posts.filter((post) => post.id === id);
          watchedState.modal = reviewPost;
          watchedState.viewPosts.push({postId: id, view: true});
        }
      })
    })
}
