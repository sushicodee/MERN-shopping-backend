const expressJwt = require('express-jwt');
const { JWT_SECRET, API } = require('../configs');

function authJwt() {
  const secret = JWT_SECRET;
  const api = API;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/user(.*)/, methods: ['GET', 'OPTIONS'] },
      `${api}/user/login`,
      `${api}/user/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}
module.exports = authJwt;
