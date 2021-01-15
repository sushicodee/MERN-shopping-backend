const express = require('express');
require('dotenv/config');
const app = express();
const { PORT, API, BASE_URL } = require('./configs/index');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const authJwt = require('./middlewares/jwt');
const apiRoutes = require('./routes/api.routes');
const cors = require('cors');
const errorHandlers = require('./helpers/errorHandlers');
//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());

//parse x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require('./configs/dbconfigs');

app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
//api Routes
app.use(API, apiRoutes);
app.use(errorHandlers);

//error handling middleware
app.use((req, res, next) => {
  next('not found');
});
//error handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      message: err.msg ? err.msg : 'Not found',
      status: err.status || 500,
      success: false,
    });
  }
});
//development
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
