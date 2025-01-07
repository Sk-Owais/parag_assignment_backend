const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customers', {
    customer_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    customer_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    customer_email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    customer_password: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "customer_id" },
        ]
      },
    ]
  });
};
