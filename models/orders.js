import mongoose from 'mongoose'
import validator from 'validator'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'products',
          required: [true, '缺少商品 ID']
        },
        quantity: {
          type: Number,
          required: [true, '缺少商品數量']
        }
      }
    ]
  },
  userInfo: {
    name: {
      type: String,
      required: [true, '名字不能為空']
    },
    phone: {
      type: String,
      required: [true, '電話不能為空']
      // validate: {
      //   validator (phone) {
      //     return validator.isMobilePhone(phone['zh-TW'])
      //   },
      //   message: '電話格式不正確'
      // }
    },
    county: {
      type: String,
      required: [true, '地址不能為空']
    },
    zipcode: {
      type: String,
      required: [true, '地址不能為空']
    },
    address: {
      type: String,
      required: [true, '地址不能為空']
    }
  },
  pay: {
    type: Boolean,
    default: false
  },
  ship: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

export default mongoose.model('orders', orderSchema)
