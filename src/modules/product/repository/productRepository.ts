import Product, { IProduct } from "../../../database/models/products";

const findProductyByNameAndCategory = async (name: string, category: string) => {
  return Product.findOne({ name: name, category: category });
};
const createProduct = async (data: IProduct) => {
  return await Product.create(data);
};

const findAllProducts = async () => {
    return await Product.find();
  };
  
export default { findProductyByNameAndCategory, createProduct,findAllProducts };
