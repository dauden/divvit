var mongoose = require('mongoose');

//create orderschema
var OrderSchema = new mongoose.Schema({
  customerId: Number,
  orderId: Number,
  orderDate: { type: Date, default: Date.now },
  orderValue: Number,
  orderMonth: Number,
  orderYear: Number,
  orderGroup: Number
});

module.exports = mongoose.model('Order', OrderSchema);
