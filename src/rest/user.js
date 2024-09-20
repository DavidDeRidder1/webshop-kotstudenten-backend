const Router = require('@koa/router');
const userService = require('../service/user');
const Joi = require('joi');
const validate = require('../core/validation'); 
const {requireAuthentication, makeRequireRole} = require("../core/auth");
const Role = require("../core/roles");

const checkUserId = (ctx, next) => {
  console.log(ctx.state.session)
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: 'FORBIDDEN',
      }
    );
  }
  return next();
};


const getAllUsers = async(ctx) => {
  ctx.body = await userService.getAll();
}

getAllUsers.validationScheme = null;


const getUserById = async(ctx) => {
  ctx.body = await userService.getById(Number(ctx.params.id))
}

getUserById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}


const register = async (ctx) => {
  const token = await userService.register({
    ...ctx.request.body
  })
  ctx.body = token;
  ctx.status = 201;
}

register.validationScheme = {
  body: {
    firstName: Joi.string().max(255),
    lastName: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30)
  }
}

const deleteUser = async (ctx) => {
  ctx.body = await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
}
deleteUser.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive()
  })
}


const getSavedProducts = async(ctx) => {
  const {userId} = ctx.state.session;
  ctx.body = await userService.getSavedProducts(userId);
}

getSavedProducts.validationScheme = null



const addProductToWishlist = async(ctx) => {
  
  const {userId} = ctx.state.session;
  const productId = Number(ctx.params.productId);
  ctx.body = await userService.addProductToWishlist(userId, productId);
}

addProductToWishlist.validationScheme = {
  params: Joi.object({
    productId: Joi.number().integer().positive()
  })
}

const removeProductFromWishlist = async(ctx) => {
  
  const {userId} = ctx.state.session;
  const productId = Number(ctx.params.productId);
  await userService.removeProductFromWishlist(userId, productId);
  ctx.status = 204;
}

removeProductFromWishlist.validationScheme = {
  params: Joi.object({
    productId: Joi.number().integer().positive()
  })
}

const login = async (ctx) => {
  const {email, password} = ctx.request.body;
  const token = await userService.login(email, password);
  ctx.body = token;
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30)
  }
}

module.exports = (app) => {
  const router = new Router({
    prefix: "/users",
  });

  router.post("/login", validate(login.validationScheme), login);
  router.post("/register", validate(register.validationScheme), register);


  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get("/", requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), getAllUsers);
  router.get("/:id", requireAuthentication, validate(getUserById.validationScheme), checkUserId, getUserById);
  router.delete("/:id", requireAuthentication, validate(deleteUser.validationScheme), checkUserId, deleteUser);
  router.get("/me/products", requireAuthentication, validate(getSavedProducts.validationScheme), getSavedProducts);
  router.post("/me/products/:productId", requireAuthentication, validate(addProductToWishlist.validationScheme), addProductToWishlist);
  router.delete("/me/products/:productId", requireAuthentication, validate(removeProductFromWishlist.validationScheme), removeProductFromWishlist);

  app.use(router.routes()).use(router.allowedMethods());
}