const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'confirmed',
  },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const val = this.getDataValue('shippingAddress');
      try { return JSON.parse(val || '{}'); } catch { return {}; }
    },
    set(val) {
      this.setDataValue('shippingAddress', JSON.stringify(val || {}));
    }
  },
  paymentMethod: { type: DataTypes.STRING, defaultValue: 'COD' },
  orderNumber: { type: DataTypes.STRING, unique: true },
}, { tableName: 'orders', timestamps: true });
