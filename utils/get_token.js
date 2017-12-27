module.exports = (req, res) => {
  let token;
  const headers = req.headers;
  if (!headers || !headers.authorization) { token = null; }
  const parted = headers.authorization.split(' ');
  if (parted.length !== 2) { token = null; }
  token = parted[1];
  if (!token) {
    return res.status(403).json({success: false, msg: 'Unauthorized.'});
  }
  return token;
}
