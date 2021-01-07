const CategoryModel = require('../models/category.model');

const categoryMapper = (category, data) => {
  for (key in data) {
    switch (key) {
      default:
        if (['name', 'icon', 'color'].includes(key)) {
          category[key] = data[key];
        }
        break;
    }
  }
};

const insert = (data) => {
  const newCategory = new CategoryModel({});
  categoryMapper(newCategory, data);
  return newCategory.save();
};

const findAll = () => {
  return CategoryModel.find();
};

const findById = (id) => {
  return CategoryModel.findById(id);
};

const remove = (id, res, next) => {
  CategoryModel.findById(id, (err, category) => {
    if (err) {
      return next(err);
    }
    if (!category) {
      return next({ message: 'category not found' });
    }
    category.remove((err, data) => {
      if (err) {
        return next(err);
      }
      res
        .status(200)
        .json({ data, message: 'the category is removed', success: true });
    });
  });
};

const update = (id, data) => {
  const updatedData = {};
  categoryMapper(updatedData, data);
  return CategoryModel.findOneAndUpdate(id, updatedData, { new: true });
};

module.exports = { categoryMapper, insert, findAll, remove, findById, update };
