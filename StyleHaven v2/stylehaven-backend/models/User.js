const mongoose = require('mongoose');

// Address Schema
const addressSchema = new mongoose.Schema({
  addressLine: { type: String, required: true },
  city:        { type: String, required: true },
  zip:         { type: String, required: true }
}, { _id: true });

// Card Schema
const cardSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true },
  expiry:     { type: String, required: true },
  cvv:        { type: String, required: true }
}, { _id: true });

// 📦 Order Schema
const orderSchema = new mongoose.Schema({
  items: [
    {
      name:     { type: String, required: true },
      price:    { type: Number, required: true },
      quantity: { type: Number, required: true },
      image:    { type: String, required: true }
    }
  ],
  totalPrice: {
    type: Number,
    required: true
  },
  shippingAddress: {
    fullName:   { type: String, required: true },
    email:      { type: String, required: true },
    addressLine:{ type: String, required: true },
    city:       { type: String, required: true },
    zip:        { type: String, required: true }
  },
  paymentCard: {
    cardNumber: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// User Schema
const userSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  isAdmin:        { type: Boolean, default: false },
  savedAddresses: [addressSchema],
  savedCards:     [cardSchema],
  orders:         [orderSchema]     // 🛒 ADD THIS LINE
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
