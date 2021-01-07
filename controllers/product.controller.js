const productQuery = require('../query/product.query');

const insert = (req, res, next) => {
  const data = req.body;
  productQuery
    .insert(data)
    .then((data) => {
      res.status(200).json({ data, success: true });
    })
    .catch((err) => {
      next(err);
    });
};

const findAll = async (req, res, next) => {
  try {
    const productsList = await productQuery.findAll(req);
    return res.status(200).json({ productsList, status: true });
  } catch (err) {
    return next({ ...err, status: false });
  }
};

const update = async (req, res, next) => {
  try {
    const updatedProduct = await productQuery.update(
      req.params.id,
      req.body,
      next
    );
    if (!updatedProduct) {
      return next({ msg: 'Product not updated', success: false, status: 500 });
    }
    res.status(200).json({ updatedProduct, success: true });
  } catch (err) {
    return next({ err, success: false, status: 500 });
  }
};

const findById = async (req, res, next) => {
  try {
    const product = await productQuery.findById(req.params.id);
    if (!product) {
      return next({ msg: 'Product not found', success: false, status: 500 });
    }
    res.status(200).json({ product, success: true });
  } catch (err) {
    return next(err);
  }
};

const remove = (req, res, next) => {
  productQuery.remove(req.params.id, res, next);
};

//GET
const getCount = (req, res, next) => {
  console.log('count controller');
  productQuery.getCount(req, res, next);
};

//params:count
const getFeatured = (req, res, next) => {
  productQuery.getFeatured(req, res, next);
};

module.exports = {
  insert,
  findAll,
  remove,
  update,
  findById,
  remove,
  getCount,
  getFeatured,
};
