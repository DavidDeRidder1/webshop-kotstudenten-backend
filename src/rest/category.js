const Router = require('@koa/router');
const categoryService = require('../service/category');
const Joi = require('joi');
const validate = require('../core/validation'); 
const {requireAuthentication, makeRequireRole} = require("../core/auth");
const Role = require("../core/roles");

const getAllCategories = async(ctx) => {
  ctx.body = await categoryService.getAll();
}

getAllCategories.validationScheme = null


const getCategoryById = async(ctx) => {
  ctx.body = await categoryService.getById(Number(ctx.params.id))
}

getCategoryById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}

const createCategory = async(ctx) => {
  const {name} = ctx.request.body
  const newCategory = await categoryService.create(name);
  ctx.body = newCategory;
}

createCategory.validationScheme = {
  body: {
    name: Joi.string().min(1).max(255)
  }
}

const getProductsPerCategory = async(ctx) => {
  ctx.body = await categoryService.getProductsPerCategory(Number(ctx.params.id))
}

getProductsPerCategory.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}


module.exports = (app) => {
  const router = new Router({
    prefix: "/categories"
  });

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get("/", requireAuthentication, validate(getAllCategories.validationScheme), getAllCategories);
  router.get("/:id", requireAuthentication, validate(getCategoryById.validationScheme), getCategoryById);
  router.post("/", requireAuthentication, requireAdmin, validate(createCategory.validationScheme), createCategory);
  router.get("/:id/products", requireAuthentication, validate(getProductsPerCategory.validationScheme), getProductsPerCategory);

  app.use(router.routes()).use(router.allowedMethods());
}