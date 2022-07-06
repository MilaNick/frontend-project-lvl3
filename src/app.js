import init from './init.js';
import { renderText, renderPosts } from './view.js';
import * as yup from 'yup';
import onChange from 'on-change';
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

export default () => {
  init();
  const {form, input, btn, feedback, posts, ul, card, feeds } = elems;
  const state = {
    listOfFeeds: [
      { rss: 'https://ru.hexlet.io/courses/js-polymorphism3' },
    ],
  };
  const { listOfFeeds } = state;
  const validate = (url, feeds) => {
    return yup.string().url('mustBeValid').notOneOf(feeds, 'rssExists').validate(url);
  };

// const watchedState = onChange(state, handler);
  form.addEventListener('submit', ((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = { rss: formData.get('url') };
    validate(url, feeds)
      .then((value) => {
        input.classList.remove('is-invalid');
        state.listOfFeeds = [...listOfFeeds, value];
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
}
