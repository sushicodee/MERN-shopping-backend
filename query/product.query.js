const CategoryModel = require('../models/category.model');
const ProductModel = require('./../models/product.model');
const mongoose = require('mongoose');
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

const insert = async (req) => {
  // if (req.fileError) return next({ msg: 'Only images can be uploaded' });
  const category = await CategoryModel.findById(req.body.category);
  if (!category) {
    return next({ msg: 'Category is invalid' });
  }
  const file = req.file;
  if (!file) {
    return next({ msg: 'Please upload an image' });
  }
  const data = req.body;
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  const newProduct = new ProductModel({});
  newProduct.image = `${basePath}${fileName}`;
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

const uploadGallery = async (req) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next({ msg: 'invalid Product id' });
  }
  const files = req.files;
  if (!files) {
    return next({ msg: 'Please upload at least one image' });
  }
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  let imagesPaths = [];
  files.map((file) => {
    imagesPaths.push(`${basePath}${file.filename}`);
  });
  const updatedData = {
    images: imagesPaths,
  };
  console.log({ updatedData });
  return ProductModel.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });
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
  uploadGallery,
};
