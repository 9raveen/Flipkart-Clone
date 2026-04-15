const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  productName: { type: DataTypes.STRING },
  productImage: { type: DataTypes.STRING },
}, { tableName: 'order_items', timestamps: true });
