export default (contents, type = 'application/xml') => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, type);
  const err = doc.querySelector('parserError');
  if (err) {
    throw new Error(err.textContent);
  }
  const title = doc.querySelector('title').textContent;
  const description = doc.querySelector('description').textContent;
  const postElems = [...doc.querySelectorAll('item')];
  const items = postElems.map((item) => {
    const titlePost = item.querySelector('title').textContent;
    const descriptionPost = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    return { title: titlePost, description: descriptionPost, link };
  });
  return { title, description, items };
};
