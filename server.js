const express = require('express');
require('dotenv/config');
const app = express();
const { PORT, API, BASE_URL } = require('./configs/index');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api.routes');
const cors = require('cors');
//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());

//parse x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require('./configs/dbconfigs');

//api Routes
app.use(API, apiRoutes);

//error handling middleware
app.use((req, res, next) => {
  next({ msg: 'not found', status: 404 });
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 400).json({
      message: err.msg || 'Not found',
      status: err.status || 400,
      success: false,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
