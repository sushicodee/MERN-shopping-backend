const categoryModel = require('../models/category.model');
const ProductModel = require('./../models/product.model');

const productMapper = (product, data) => {
  for (key in data) {
    switch (key) {
      default:
        if (
          [
            'name',
            'price',
            'category',
            'countInStock',
            'brand',
            'description',
            'richDescription',
            'image',
            'images',
            'isFeatured',
            'dateCreated',
            '_id',
          ].includes(key)
        ) {
          if (data[key]) {
            product[key] = data[key];
          }
        }
        break;
    }
  }
};

const insert = (data) => {
  const newProduct = new ProductModel({});
  productMapper(newProduct, data);
  return newProduct.save();
};

const findAll = (req) => {
  let filter = {};
  // let condition = '';
  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }
  return (
    ProductModel.find(filter)
      // .select(condition)
      .populate('category')
      .sort({ _id: -1 })
      .exec()
  );
};

const update = async (id, data, next) => {
  const category = await categoryModel.findById(data.category);
  if (!category) {
    return next({ msg: 'Category is invalid' });
  }
  const updatedData = {};
  productMapper(updatedData, data);
  return ProductModel.findByIdAndUpdate(id, updatedData, { new: true });
};

const findById = (id) => {
  return ProductModel.findById(id).populate('category');
};

const remove = (id, res, next) => {
  ProductModel.findById(id, (err, product) => {
    if (err) {
      return next(err);
    }
    if (!product) {
      return next({ message: 'product not found' });
    }
    product.remove((err, data) => {
      if (err) {
        return next(err);
      }
      res
        .status(200)
        .json({ data, message: 'the product is removed', success: true });
    });
  });
};

const getCount = async (_, res, next) => {
  try {
    const productCount = await ProductModel.countDocuments((count) => count);
    res.status(200).json({ productCount });
  } catch (err) {
    next({ err, status: 500 });
  }
};

const getFeatured = async (req, res, next) => {
  const count = req.params.count ? req.params.count : 0;
  try {
    console.log(req.params);
    const products = await ProductModel.find({ isFeatured: true }).limit(
      +count
    );
    if (!products) {
      return next({ err: 'Products not avaliable' });
    }
    res.status(200).json({ products });
  } catch (err) {
    next({ err, status: 500 });
  }
};

module.exports = {
  insert,
  findById,
  update,
  remove,
  productMapper,
  findAll,
  getCount,
  getFeatured,
};
