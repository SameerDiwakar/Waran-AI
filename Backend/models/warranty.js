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
    default: 'active'
  },
  category: {
    type: String,
    enum: ['electronics', 'appliances', 'furniture', 'automotive', 'other'],
    required: false
  },
  image: {
    type: String,
    required: false
  },
  invoice: {
    type: String,
    required: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

const warrantyModel = mongoose.model('Warranty', warrantySchema);

module.exports = warrantyModel;