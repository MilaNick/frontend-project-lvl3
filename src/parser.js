export default (contents, type = "application/xml") => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, type);
  console.log(doc)
  const error = doc.querySelector('parserError');
  if (error) {
    throw new Error(error.innerHTML);
  }
  return parser.parseFromString(contents, type);
}
// const renderFeeds = (elements, feeds) => {
//   elements.containerFeeds.innerHTML = null;
//   const divOuter = document.createElement('div');
//   const divInner = document.createElement('div');
//   const ul = document.createElement('ul');
//   const h2 = document.createElement('h2');
//
//   h2.textContent = i18next.t('feeds');
//
//   h2.classList.add('card-title', 'h4');
//   divInner.classList.add('card-body');
//   divOuter.classList.add('card', 'border-0');
//   ul.classList.add('list-group', 'border-0', 'rounded-0');
//
//   feeds.forEach((feed) => {
//     const li = document.createElement('li');
//     const h3 = document.createElement('h3');
//     const p = document.createElement('p');
//
//     h3.textContent = feed.title;
//     p.textContent = feed.description;
//
//     li.classList.add('list-group-item', 'border-0', 'border-end-0');
//     h3.classList.add('h6', 'm-0');
//     p.classList.add('m-0', 'small', 'text-black-50');
//
//     h3.append(p);
//     li.append(h3);
//     ul.prepend(li);
//   });
//
//   divInner.append(h2);
//   divOuter.append(divInner);
//   divOuter.append(ul);
//   elements.containerFeeds.append(divOuter);
// };
