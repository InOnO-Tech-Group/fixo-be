import Category, { ICategory } from "../../../database/models/category";
const findCategoryByName = async (name: string) => {
  return Category.findOne({ name });
};
const createCategory = async (categoryData: ICategory) => {
  return await Category.create(categoryData);
};

const findAllCategories = async () => {
  return await Category.find();
};
const findCategoryByNameAndId = async (id: string, name: string) => {
  return await Category.findOne({
    _id: { $ne: id },
    name: name,
  });
};
const findCategoryById = async (id: string) => {
  return await Category.findById(id);
};

const updateCategory = async (id: string, categoryData: ICategory) => {
  return await Category.findByIdAndUpdate(id, categoryData, { new: true });
};
const deleteCategory = async (id: string) => {
    return await Category.findByIdAndDelete(id);
  };
export default {
  createCategory,
  findCategoryByName,
  findAllCategories,
  findCategoryById,
  updateCategory,
  findCategoryByNameAndId,
  deleteCategory
};
