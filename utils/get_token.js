module.exports = (req, res) => {
  let token;
  const headers = req.headers;
  if (!headers || !headers.authorization) { return null; }
  const parted = headers.authorization.split(' ');
  return (parted.length === 2)
    ? parted[1]
    : res.status(403).json({success: false, msg: 'Unauthorized.'});
}
