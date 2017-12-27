module.exports = (headers) => {
  if (!headers || !headers.authorization) { return null; }
  const parted = headers.authorization.split(' ');
  if (parted.length !== 2) { return null; }
  return parted[1];
}
