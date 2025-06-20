const mongoose = require('mongoose');
const {Schema} = mongoose

const warrantySchema = new Schema({
  productName: String,
  brand: {
    type: String,
    required: false
  },
  purchaseDate: Date,
  warrantyEnd: Date,
  status: {
    type: String,
    enum: ['active', 'expired', 'expiring soon'],
    required: true
  },
  category: {
    type: String,
    enum: ['electronics', 'appliances', 'other', 'automotive', 'furniture'],
    required: true
  },
  image: String,
  invoice: String,
  userId: String,
});

const warrantyModel = mongoose.model('Warranty', warrantySchema);

module.exports = warrantyModel;