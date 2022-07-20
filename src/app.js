import i18n from 'i18next';
import resources from './locales/index.js';
import * as yup  from 'yup';
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

const  createPosts = (feedID, data) => (data
  .items.reverse().map((post) => {
    const { title, description, link } = post;
    return { id: _.uniqueId(), feedID, title, description, link,}
  })
);

const createFeed = (url, data) => ({id: _.uniqueId(), url, title: data.title, description: data.description,});

const createViewPost = (data) => (data.map((post) => ({postID: post.id, view: false})))

const updatePosts = (id, data, state) => {
  const posts = createPosts(id, data);
  const viewPost =  createViewPost(posts);
  state.listOfPosts.push(...posts);
  state.viewPosts.push(...viewPost);
}

const updateFeeds = (state) => {
  const promise = state.listOfFeeds.map((feed) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`)
    .then((response) => {
      const { id } = feed;
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
  const { id } = dataFeed;
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

  const {loadResult, message, urls, listOfFeeds, listOfPosts, viewPosts, modal } = state;
  const watchedState = onChange(state, handler);
  const {form, input, btn, feedback, posts, ul, card, feeds } = elems;


  form.addEventListener('submit', ((event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    validate(url, state.urls)
      .then((value) => {
        input.classList.remove('is-invalid');
        watchedState.listOfFeeds = [...listOfFeeds, value];
        console.log('state', state)
      })
      .catch((err) => {
        console.log(err); // здесь обвести красной линией инпут если адрес невалидный, затем куда-то вывести сообщение
        input.classList.add('is-invalid');
      });
    if (listOfFeeds.length !== 0) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
      li.innerHTML = '<a href = "https://ru.hexlet.io/courses/http-api/lessons/openapi/theory_unit" class = "fw-bold" data-id = "2" target = "_blank" rel = "noopener noreferrer" > OpenAPI(ранее Swagger Specification) / HTTP API </a><button type="button" className="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>';
      ul.append(li);
    }
    form.reset();
  }));

  const fetchRss = (url) => {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
      .then(response => parser(response.data.contents))
      .then(contents => renderPosts(contents))
      .catch(err => card.append(err))
  }

  fetchRss('https://ru.hexlet.io/lessons.rss')
    })
}
