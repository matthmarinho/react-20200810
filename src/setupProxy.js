const { createProxyMiddleware } = require("http-proxy-middleware");
const { REACT_APP_API_URL } = process.env;

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/v1", { target: REACT_APP_API_URL })
  );
};