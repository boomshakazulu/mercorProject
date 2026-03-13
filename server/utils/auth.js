const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_JWT;
const expiration = "24h";
const { unauthorized } = require("./httpError");

function requireAuth(req, res, next) {
  const body = req.body || {};
  const query = req.query || {};
  const headers = req.headers || {};
  let token = body.token || query.token || headers.authorization;
  if (req.headers.authorization) token = token.split(" ").pop().trim();
  if (!token) return next(unauthorized("No token provided"));

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
    next();
  } catch (e) {
    return next(unauthorized("Invalid or expired token"));
  }
}

function signToken({ email, id, username }) {
  return jwt.sign({ data: { email, id, username } }, secret, {
    expiresIn: expiration,
  });
}

module.exports = { requireAuth, requireRole, signToken };
