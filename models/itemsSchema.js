const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({

    id:{
     type:Number,
     required: true
    },
     name:{
        type:String,
        required: true
       },
      price:{
        type:Number,
        required: true
       },
       
   amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;