import Product, { IProduct } from "../../../database/models/products";

const findProductyByNameAndCategory = async (
  name: string,
  category: string
) => {
  return Product.findOne({ name: name, category: category });
};
const createProduct = async (data: IProduct) => {
  return await Product.create(data);
};

const findAllProducts = async () => {
  return await Product.find();
};
const findAllProductById = async (id: string) => {
  return await Product.findById(id);
};

const findProductByNameAndId = async (
  id: string,
  name: string,
  categ: string
) => {
  return await Product.findOne({
    _id: { $ne: id },
    name: name,
    category: categ,
  });
};

const updateProduct = async (id: string, data: IProduct) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};
const deleteProduct = async (id: string) => {
    return await Product.findByIdAndDelete(id);
  };
  
export default {
  findProductyByNameAndCategory,
  createProduct,
  findAllProducts,
  findAllProductById,
  findProductByNameAndId,
  updateProduct,
  deleteProduct
};
