import { elems } from './app.js';

export const renderText = (i18n) => {
  const title = elems.header.querySelector('.display-3');
  title.innerHTML = `<i class="bi bi-rss"></i>${i18n.t('titleHeader')}`;
  const lead = elems.header.querySelector('.lead');
  lead.textContent = i18n.t('description');
  const btn = elems.header.querySelector('.add');
  btn.innerHTML = `<i class="bi bi-rss"></i>${i18n.t('button')}`;
  const example = elems.header.querySelector('.example');
  example.textContent = i18n.t('example');
  const placeholder = elems.form.querySelector('[for="url-input"]');
  placeholder.textContent = i18n.t('placeholder');
  elems.read.textContent = i18n.t('modal.read');
  const close = elems.modal.querySelector('.close-btn');
  close.textContent = i18n.t('modal.close');
};

const renderPosts = (elems, posts, i18n) => {
  elems.posts.innerHTML = null;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('posting');
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
  elems.posts.append(card);
};

const renderFeeds = (elems, feeds, i18n) => {
  elems.feeds.innerHTML = null;
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('feeds');
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

const renderMessage = (elems, message, i18n) => {
  elems.feedback.textContent = i18n.t(`messages.${message}`);
};

const renderView = (data) => {
  const viewPosts = data.filter((post) => post.view === true);
  viewPosts.forEach((item) => {
    const id = item.postId;
    const link = document.querySelector(`[data-id="${id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'fw-normal-grey');
  });
};

const renderModal = (elems, value) => {
  const { title, description, link } = value;
  elems.modalTitle.innerHTML = title;
  elems.modalBody.innerHTML = description;
  elems.read.setAttribute('href', link);
};

const changeLng = (elems, value, state, i18n) => {
  const {
    message, listOfFeeds, listOfPosts, viewPosts,
  } = state;
  const view = viewPosts;
  const lngBtn = document.querySelectorAll('.btn-outline-secondary');
  lngBtn.forEach((btn) => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`[data-lng="${value}"]`);
  activeBtn.classList.add('active');
  i18n.changeLanguage(value);
  renderText(i18n);
  if (message) renderMessage(elems, message, i18n);
  if (listOfFeeds.length > 0) {
    renderFeeds(elems, listOfFeeds, i18n);
    renderPosts(elems, listOfPosts, i18n);
    renderView(view);
  }
};

const handleLoader = (elems, loadResult) => {
  switch (loadResult) {
    case 'success':
      elems.input.classList.remove('is-invalid');
      elems.input.value = null;
      elems.input.focus();
      elems.input.removeAttribute('readonly');
      elems.feedback.classList.remove('text-danger');
      elems.feedback.classList.add('text-success');
      elems.btn.disabled = false;
      break;
    case 'preloader':
      elems.input.setAttribute('readonly', 'readonly');
      elems.btn.disabled = true;
      break;
    case 'error':
      elems.input.classList.add('is-invalid');
      elems.input.focus();
      elems.input.removeAttribute('readonly');
      elems.feedback.classList.remove('text-success');
      elems.feedback.classList.add('text-danger');
      elems.btn.disabled = false;
      break;
    default:
      break;
  }
};

export default (state, i18n) => (path, value) => {
  switch (path) {
    case 'loadResult':
      handleLoader(elems, value);
      break;

    case 'listOfPosts':
      renderPosts(elems, value, i18n);
      break;

    case 'viewPosts':
      renderView(value);
      break;

    case 'listOfFeeds':
      renderFeeds(elems, value, i18n);
      break;

    case 'message':
      renderMessage(elems, value, i18n);
      break;

    case 'modal':
      renderModal(elems, value);
      break;

    case 'lng':
      changeLng(elems, value, state, i18n);
      break;

    default:
      break;
  }
};
