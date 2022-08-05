import axios from 'axios';
import i18n from 'i18next';
import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import resources from './locales/index.js';
import getHandler, { renderText, getElements } from './view.js';
import parser from './parser.js';

const validate = (url, urls) => yup.string().trim().required().url('mustBeValid')
  .notOneOf(urls, 'rssExists')
  .validate(url);

const createPosts = (feedID, data) => (data.items.reverse().map((post) => {
  const { title, description, link } = post;
  return {
    id: _.uniqueId(), feedID, title, description, link,
  };
}));

const updatePosts = (id, data, state) => {
  const posts = createPosts(id, data);
  state.posts.push(...posts);
};

const createFeed = (url, feed) => ({ ...feed, id: _.uniqueId() });

const updateFeeds = (state) => {
  const promise = state.feeds.map((feed) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`)
    .then((response) => {
      const { id } = feed;
      const newPosts = parser(response.data.contents).items;
      const oldPosts = state.posts.filter((post) => post.feedID === id);
      const diff = _.differenceWith(newPosts, oldPosts, (a, b) => a.link === b.link);
      if (diff.length > 0) {
        const data = {
          items: diff,
        };
        updatePosts(id, data, state);
      }
    })
    .catch(() => {}));
  Promise.all(promise).finally(() => setTimeout(() => updateFeeds(state), 5000));
};

const addFeed = (url, data, state) => {
  const dataFeed = createFeed(url, data);
  const { id } = dataFeed;
  const dataPosts = createPosts(id, data);
  state.urls.push(url);
  state.feeds.push(dataFeed);
  state.posts.push(...dataPosts);
};

const defaultLng = 'ru';

export default () => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: defaultLng,
    debug: false,
    resources,
  })
    .then(() => {
      const elements = getElements();
      renderText(i18nextInstance, elements);
      const state = {
        processing: 'ready for addition',
        message: null,
        urls: [],
        feeds: [],
        posts: [],
        ui: {
          viewPostsIds: [],
          modal: null,
          lng: defaultLng,
        },
      };

      const watchedState = onChange(state, getHandler(state, i18nextInstance));
      elements.form.addEventListener('submit', ((event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const url = formData.get('url');
        validate(url, state.urls)
          .then((link) => {
            watchedState.processing = 'addition';
            return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`);
          })
          .then((response) => {
            const data = parser(response.data.contents);
            addFeed(url, data, watchedState);
            watchedState.processing = 'success';
            watchedState.message = 'success';
          })
          .catch((error) => {
            watchedState.processing = 'error';
            watchedState.message = error.message;
          });
      }));

      elements.posts.addEventListener('click', (event) => {
        const { id } = event.target.dataset;
        if (id) {
          watchedState.ui.modal = watchedState.posts.find((post) => post.id === id);
          watchedState.ui.viewPostsIds.push(id);
        }
      });

      elements.btnLng.addEventListener('click', (event) => {
        event.preventDefault();
        const { lng } = event.target.dataset;
        if (lng) watchedState.ui.lng = lng;
      });
      updateFeeds(watchedState);
    });
};
