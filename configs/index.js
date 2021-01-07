module.exports = {
  //for dev
  API: process.env.API_URL,
  JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS || 'nevergiveup',
  PORT: process.env.PORT || 5000,
};
