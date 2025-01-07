var DataTypes = require("sequelize").DataTypes;
var _customer_auth_token = require("./customer_auth_token");
var _customers = require("./customers");
var _product = require("./product");
var _subscription = require("./subscription");

function initModels(sequelize) {
  var customer_auth_token = _customer_auth_token(sequelize, DataTypes);
  var customers = _customers(sequelize, DataTypes);
  var product = _product(sequelize, DataTypes);
  var subscription = _subscription(sequelize, DataTypes);

  customer_auth_token.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(customer_auth_token, { as: "customer_auth_tokens", foreignKey: "customer_id"});
  subscription.belongsTo(customers, { as: "customer", foreignKey: "customer_id"});
  customers.hasMany(subscription, { as: "subscriptions", foreignKey: "customer_id"});
  subscription.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(subscription, { as: "subscriptions", foreignKey: "product_id"});

  return {
    customer_auth_token,
    customers,
    product,
    subscription,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
