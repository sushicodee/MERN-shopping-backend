const categoryQuery = require('./../query/category.query');

const insert = (req, res, next) => {
  const data = req.body;
  console.log({ data });
  categoryQuery
    .insert(data)
    .then((data) => {
      res.status(200).json({ data, success: true });
    })
    .catch((err) => {
      next({ err, success: false, status: 500 });
    });
};

const findAll = async (req, res, next) => {
  try {
    const categoryList = await categoryQuery.findAll();
    return res.status(200).json({ categoryList, success: true });
  } catch (err) {
    return next({ err, success: false, status: 500 });
  }
};

const remove = (req, res, next) => {
  categoryQuery.remove(req.params.id, res, next);
};

const findById = async (req, res, next) => {
  try {
    const category = await categoryQuery.findById(req.params.id);
    if (!category) {
      return next({ msg: 'Category not found' });
    }
    res.status(200).json({ category, success: true });
  } catch (err) {
    return next({ err, success: false, status: 500 });
  }
};

const update = async (req, res, next) => {
  try {
    const updatedCategory = await categoryQuery.update(req.params.id, req.body);
    if (!updatedCategory) {
      return next({ msg: 'Category not updated', success: false, status: 500 });
    }
    res.status(200).json({ updatedCategory, success: true });
  } catch (err) {
    return next({ err, success: false, status: 500 });
  }
};
module.exports = { insert, findAll, remove, findById, update };
