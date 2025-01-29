import Category, { ICategory } from "../../../database/models/category";
const findCategoryByName = async (name:string)=>{
    return Category.findOne({name})
}
const createCategory = async (categoryData:ICategory)=>{
return await Category.create(categoryData)
}

export default {createCategory,findCategoryByName}