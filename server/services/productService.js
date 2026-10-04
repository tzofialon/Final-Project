const Product = require('../models/Product');

// פונקציית עזר פרטית לזיהוי סינון לפי ID או productId
const getFilterById = (idParam) => {
  const isNumber = !isNaN(Number(idParam));
  return isNumber ? { productId: Number(idParam) } : { _id: idParam };
};

const getAllProducts = async () => {
  return await Product.find();
};

const getProductById = async (idParam) => {
  const filter = getFilterById(idParam);
  return await Product.findOne(filter);
};

const createProduct = async (productData) => {
  const { productId, name, price, image, inventory } = productData;
  return await Product.create({ productId, name, price, image, inventory });
};

const updateInventory = async (idParam, inventory) => {
  const filter = getFilterById(idParam);
  return await Product.findOneAndUpdate(
    filter,
    { inventory },
    { new: true }
  );
};

const deleteProduct = async (idParam) => {
  const filter = getFilterById(idParam);
  return await Product.findOneAndDelete(filter);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateInventory,
  deleteProduct
};