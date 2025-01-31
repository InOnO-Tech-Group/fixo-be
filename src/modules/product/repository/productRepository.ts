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
  return await Product.find().populate("category");
};
const findProductsByCategory = async (category:string) => {
  return await Product.find({category}).populate("category");
};
const findAllProductById = async (id: string) => {
  return await Product.findById(id).populate("category");
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
  findProductsByCategory,
  findAllProductById,
  findProductByNameAndId,
  updateProduct,
  deleteProduct
};
