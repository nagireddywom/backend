// // backend/src/models/Order.js
// const mongoose = require ('mongoose');

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   orderDetails: {
//     product: String,
//     isCustomized: Boolean,
//     customization: {
//       quantity: Number,
//       pages: {
//         selected: Number
//       },
//       paperType: String,
//       bindingType: String
//     },
//     pricing: {
//       basePrice: Number,
//       totalPrice: Number,
//       discount: Number
//     }
//   },
//   shippingInfo: {
//     firstName: {
//       type: String,
//       required: true
//     },
//     lastName: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true
//     },
//     phone: {
//       type: String,
//       required: true
//     },
//     address1: {
//       type: String,
//       required: true
//     },
//     address2: String,
//     city: {
//       type: String,
//       required: true
//     },
//     state: {
//       type: String,
//       required: true
//     },
//     zipCode: {
//       type: String,
//       required: true
//     },
//     country: {
//       type: String,
//       default: 'US'
//     }
//   },
//   giftDetails: {
//     isGift: {
//       type: Boolean,
//       default: false
//     },
//     giftMessage: String,
//     giftWrapPrice: Number
//   },
//   finalPrice: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
//     default: 'pending'
//   },
//   orderNumber: {
//     type: String,
//     unique: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Generate unique order number before saving
// orderSchema.pre('save', async function(next) {
//   if (!this.orderNumber) {
//     // Generate a unique order number (e.g., ORD-YYYYMMDD-XXXX)
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//     this.orderNumber = `ORD-${year}${month}${day}-${random}`;
//   }
//   next();
// });

// module.exports = mongoose.model('Order', orderSchema);


// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderDetails: {
    product: {
      type: String,
      required: true
    },
    isCustomized: {
      type: Boolean,
      default: false
    },
    customization: {
      quantity: {
        type: Number,
        required: true
      },
      pages: {
        selected: {
          type: Number,
          required: true
        }
      },
      paperType: String,
      bindingType: String
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true
      },
      totalPrice: {
        type: Number,
        required: true
      },
      discount: {
        type: Number,
        default: 0
      }
    }
  },
  shippingInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address1: {
      type: String,
      required: true
    },
    address2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'US'
    }
  },
  shippingDetails: {
    shiprocketOrderId: String,
    shipmentId: String,
    awbCode: String,
    courierName: String,
    manifestUrl: String,
    labelUrl: String,
    invoiceUrl: String,
    trackingStatus: String,
    lastUpdateTime: Date
  },
  giftDetails: {
    isGift: {
      type: Boolean,
      default: false
    },
    giftMessage: String,
    giftWrapPrice: {
      type: Number,
      default: 0
    }
  },
  finalPrice: {
    type: Number,
    required: true
  },
  paymentDetails: {
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentDate: Date,
    paymentAmount: Number,
    paymentCurrency: {
      type: String,
      default: 'INR'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true // This replaces createdAt and updatedAt
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'paymentDetails.razorpayPaymentId': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ user: 1 });

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}-${randomNum}`;
  }
  next();
});

// Method to update payment status
orderSchema.methods.updatePaymentStatus = async function(paymentDetails) {
  this.paymentDetails = {
    ...this.paymentDetails,
    ...paymentDetails,
    paymentDate: new Date()
  };
  
  if (paymentDetails.paymentStatus === 'completed') {
    this.status = 'processing';
  }
  
  return this.save();
};

// Method to find order by payment ID
orderSchema.statics.findByPaymentId = function(paymentId) {
  return this.findOne({ 'paymentDetails.razorpayPaymentId': paymentId });
};

// Method to get order with payment status
orderSchema.methods.getPaymentStatus = function() {
  return {
    orderNumber: this.orderNumber,
    paymentStatus: this.paymentDetails?.paymentStatus || 'pending',
    amount: this.finalPrice,
    status: this.status
  };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;