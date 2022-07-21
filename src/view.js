import _ from 'lodash';
import {elems} from './app.js';
import i18n from 'i18next';

export const renderText = (i18n) => {
  const title = elems.header.querySelector('.display-3');
  title.innerHTML = `<i class="bi bi-rss"></i>${i18n.t('titleHeader')}`;
  const lead = elems.header.querySelector('.lead');
  lead.textContent = i18n.t('description');
  const urlInput = elems.header.querySelector('#url-input');
  urlInput.setAttribute('placeholder', `${i18n.t('placeholder')}`);
  const btn = elems.header.querySelector('.btn');
  btn.innerHTML = `<i class="bi bi-rss"></i>${i18n.t('posts.button')}`;
  const example = elems.header.querySelector('.example');
  example.textContent = i18n.t('example');
  const feedback = elems.header.querySelector('.feedback');
  feedback.textContent = i18n.t('messages.success');
  const form = elems.header.querySelector('form');
  const placeholder = form.querySelector('[for="url-input"]');
  placeholder.textContent = i18n.t('placeholder');
  const newLessons = elems.main.querySelector('.new-lessons');
  newLessons.textContent = i18n.t('posts.newLessons');
  const practicalLessons = elems.main.querySelector('.practical-lessons');
  practicalLessons.textContent = i18n.t('posts.practicalLessons');
  elems.modalTitle.textContent = i18n.t('modal.modalTitle');
  elems.read.textContent = i18n.t('modal.read');
  const close = elems.modal.querySelector('.close-btn');
  close.textContent = i18n.t('modal.close');
};// прошерстить, многое уйдет в рендеры, не забыть

// const renderHTML = () => {
//   return в рендерах много общего надо переписать
// }
const renderFeeds = (elems, feeds) => {
  elems.feeds.innerHTML = null;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('feeds.title');
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((feed) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.textContent = feed.description;
    p.classList.add('m-0', 'small', 'text-black-50');

    h3.append(p);
    listGroupItem.append(h3);
    listGroup.prepend(listGroupItem);
  });
  cardBody.append(cardTitle);
  card.append(cardBody);
  card.append(listGroup);
  elems.feeds.append(card);
};
const renderPosts = (elems, posts) => {
  elems.posts.innerHTML = null;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('posts.posting');
  const listGroup = document.createElement('ul');
  listGroup.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((post) => {
    const { id, title } = post;
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.dataset.id = id;
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18n.t('review');
    btn.setAttribute('type', 'button');
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.textContent = title;
    a.classList.add('fw-bold');
    a.dataset.id = id;
    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');

    listGroupItem.append(a);
    listGroupItem.append(btn);
    listGroup.prepend(listGroupItem);
  });
  cardBody.append(cardTitle);
  card.append(cardBody);
  card.append(listGroup);
  elems.feeds.append(card);
};
const renderMessage = () => {

}
const renderView = () => {

}
const renderModal = (elems, value) => {
  const {title, description, link} = value;
  elems.modalTitle.textContent = title;
  elems.modalBody.textContent = description;
  elems.read.setAttribute('href', link);
}
const handleLoader = () => {
 // свитч на загрузку
  //            loadResult = 'success';
  //            message = 'success';
  //            loadResult = 'error';
  //             if (error.message === 'Network Error'
  //               watchedState.message = 'networkError';
  //               error.name === 'ValidationError'
  //               watchedState.message = error.message;
  //               watchedState.message = 'notContainValid';

}
export const handler = () => {

}
