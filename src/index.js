import { object, string } from 'yup';
// import onChange from 'on-change';// за чем следит on-change?
import runApp from './init.js';
import { renderText } from './view.js';
import resources from './locales/index.js';

import '@styles/index.scss';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.scss';

runApp();
// renderText(resources);

const form = document.querySelector('.rss-link');
// const button = form.querySelector('[aria-label="add"]');
const input = form.querySelector('#url-input');
const ul = document.querySelector('.group-feeds');

const state = {
  listOfFeeds: [
    { rss: 'https://ru.hexlet.io/courses/js-polymorphism3' },
  ],
};
const { listOfFeeds } = state;
const validate = (obj) => {
  object()
    .shape({
      rss: string().url().trim().required(),
      // В yup для этого есть метод notOneOf проверка на дубли/  каких дублей?
    })
    .validate(obj)
    .then((value) => {
      input.classList.remove('is-invalid');
      state.listOfFeeds = [...listOfFeeds, value];
    })
    .catch((err) => {
      console.log(err); // здесь обвести красной линией инпут если адрес невалидный, затем куда-то вывести сообщение
      input.classList.add('is-invalid');
    });
};

form.addEventListener('submit', ((e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = { rss: formData.get('url') };
  validate(url);
  if (listOfFeeds.length !== 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    li.innerHTML = '<a href = "https://ru.hexlet.io/courses/http-api/lessons/openapi/theory_unit" class = "fw-bold" data-id = "2" target = "_blank" rel = "noopener noreferrer" > OpenAPI(ранее Swagger Specification) / HTTP API </a><button type="button" className="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>';
    ul.append(li);
  }
  form.reset();
}));

