const Router = require('@koa/router');
const productService = require('../service/product');
const Joi = require('joi');
const validate = require('../core/validation'); 
const {requireAuthentication, makeRequireRole} = require("../core/auth");


const getAllProducts = async (ctx) => {
  ctx.body = await productService.getAll();
};

getAllProducts.validationScheme = null;

const createProduct = async (ctx) => {
  
  const newProduct = await productService.create({
    ...ctx.request.body,
    categoryId: Number(ctx.request.body.categoryId),
    userId: ctx.state.session.userId
  });
  ctx.body = newProduct;
  ctx.status = 201;
}

createProduct.validationScheme = {
  body: {
    title: Joi.string().min(1),
    picture: Joi.string().uri(),
    description: Joi.string().min(2),
    price: Joi.number().positive(),
    //userId: Joi.number().integer().positive(),
    categoryId: Joi.number().integer().positive(),
  },
}

const getProductById = async (ctx) => {
  ctx.body = await productService.getById(Number(ctx.params.id));
}

getProductById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}

const updateProduct = async (ctx) => {
  ctx.body = await productService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    categoryId: Number(ctx.request.body.categoryId),
    userId: ctx.state.session.userId
    
  });
};

updateProduct.validationScheme = {
  params: {
    id: Joi.number().integer().positive()
  },
  body: {
    title: Joi.string().min(1).optional(),
    picture: Joi.string().uri().optional(),
    description: Joi.string().min(2).optional(),
    price: Joi.number().positive().optional(),
    categoryId: Joi.number().positive().optional(),
    //userId: Joi.number().positive().optional()
  }
}

const deleteProduct = async (ctx) => {
  await productService.deleteById(Number(ctx.params.id), ctx.state.session.userId);
  ctx.status = 204
}

deleteProduct.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}

const buyProduct = async (ctx) => {
  ctx.body = await productService.buyProductById(Number(ctx.params.id), ctx.state.session.userId);
}

buyProduct.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}

module.exports = (app) => {
  const router = new Router({
    prefix: "/products",
  });

  router.get("/", requireAuthentication, validate(getAllProducts.validationScheme), getAllProducts);
  router.post("/", requireAuthentication,validate(createProduct.validationScheme), createProduct);
  router.get("/:id", requireAuthentication, validate(getProductById.validationScheme), getProductById);
  router.put("/:id", requireAuthentication, validate(updateProduct.validationScheme), updateProduct);
  router.delete("/:id", requireAuthentication, validate(deleteProduct.validationScheme), deleteProduct);
  router.put("/buy/:id", requireAuthentication, validate(buyProduct.validationScheme), buyProduct);
  
  
  

  app.use(router.routes()).use(router.allowedMethods());

}