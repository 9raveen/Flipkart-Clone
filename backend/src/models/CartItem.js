const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('CartItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
}, { tableName: 'cart_items', timestamps: true });
