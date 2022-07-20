import _ from 'lodash';
import { elems } from './app.js'

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
  const postsTitle = elems.main.querySelector('.posts-title');
  postsTitle.textContent = i18n.t('posts.posting');
  const feedsTitle = elems.main.querySelector('.feeds-title');
  feedsTitle.textContent = i18n.t('feeds.title');
  const newLessons = elems.main.querySelector('.new-lessons');
  newLessons.textContent = i18n.t('posts.newLessons');
  const practicalLessons = elems.main.querySelector('.practical-lessons');
  practicalLessons.textContent = i18n.t('posts.practicalLessons');
  elems.modalTitle.textContent = i18n.t('modal.modalTitle');
  elems.read.textContent = i18n.t('modal.read');
  const close = elems.modal.querySelector('.close-btn');
  close.textContent = i18n.t('modal.close');
};

const renderFeeds = () => {

}
// const renderPosts = (contents) => {
//
// }
const renderMessage = () => {

}
const renderRead = () => {

}
const renderModale = () => {

}
const handleProcess = () => {

}
export const renderPosts = (contents) => {
  console.log(contents)
  const items = [...contents.querySelectorAll('item')];
  items.map(item => {
    const post = document.createElement('li');
    post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
    const key = _.uniqueId();
    const title = item.querySelector('title').innerHTML;
    const link = item.querySelector('link').innerHTML;
    const description = item.querySelector('description').innerHTML;
    post.innerHTML = `<a href=${link} class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">${title}</a>
    <button type="button" class="btn btn-outline-primary btn-sm view-post" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`
    post.setAttribute('id', key)
    elems.ul.append(post);
    const button = post.querySelector('.view-post');
    button.addEventListener('click', () => {
      elems.modalTitle.textContent = title;
      elems.modalBody.textContent = description;
      elems.read.setAttribute('href', link);
    })
  })
}

export const handler = () => {

}
