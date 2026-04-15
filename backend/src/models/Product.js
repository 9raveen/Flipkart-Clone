const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  originalPrice: { type: DataTypes.DECIMAL(10, 2) },
  discount: { type: DataTypes.INTEGER, defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  brand: { type: DataTypes.STRING },
  rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  // Store as JSON string in MySQL
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('images');
      try { return JSON.parse(val || '[]'); } catch { return []; }
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val || []));
    }
  },
  specifications: {
    type: DataTypes.TEXT,
    defaultValue: '{}',
    get() {
      const val = this.getDataValue('specifications');
      try { return JSON.parse(val || '{}'); } catch { return {}; }
    },
    set(val) {
      this.setDataValue('specifications', JSON.stringify(val || {}));
    }
  },
  categoryId: { type: DataTypes.UUID, allowNull: false },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'products', timestamps: true });
