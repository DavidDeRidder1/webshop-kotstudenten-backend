const Router = require("@koa/router");
const installProductRouter = require("./product");
const installHealthRouter = require('./health');
const installCategoryRouter = require("./category");
const installUserRouter = require("./user");

module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installProductRouter(router);
  installHealthRouter(router);
  installCategoryRouter(router);
  installUserRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};