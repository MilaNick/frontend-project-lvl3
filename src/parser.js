export default (contents, type = "application/xml") => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, type);
  const err = doc.querySelector('parserError');
  if (err) {
    throw new Error(err.innerHTML);
  }
  const title = doc.querySelector('title').innerHTML;
  const description = doc.querySelector('description').innerHTML;
  const postElems = Array.from(doc.querySelectorAll('item'));
  const items = postElems.map((item) => {
    const title = item.querySelector('title').innerHTML;
    const description = item.querySelector('description').innerHTML;
    const link = item.querySelector('link').innerHTML;
    return {title, description, link,};
  });
  return {title, description, items};
}
