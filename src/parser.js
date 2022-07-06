export default (contents, type = "application/xml") => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, type);
  const error = doc.querySelector('parserError');
  if (error) {
    throw new Error(error.innerHTML);
  }
  return parser.parseFromString(contents, type);
}

