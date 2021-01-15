module.exports = {
  //for dev
  API: process.env.API_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'nevergiveup',
  PORT: process.env.PORT || 3000,
};
