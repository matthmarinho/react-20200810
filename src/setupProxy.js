const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/v1", { target: "https://ruby-on-rails-20200810.herokuapp.com/" })
  );
};