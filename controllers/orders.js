import orders from '../models/orders.js'
import users from '../models/users.js'

export const checkout = async (req, res) => {
  try {
    if (req.user.cart.length === 0) {
      res.status(400).send({ success: false, message: '購物車是空的' })
      return
    }
    const hasNotSell = await users.aggregate([
      {
        $match: {
          _id: req.user._id
        }
      },
      {
        $project: {
          'cart.product': 1
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'cart.product',
          foreignField: '_id',
          as: 'cart.product'
        }
      },
      {
        $match: {
          'cart.product.sell': false
        }
      }
    ])
    if (hasNotSell.length > 0) {
      res.status(400).send({ success: false, message: '包含下架商品' })
      return
    }
    const result = await orders.create({ user: req.user._id, products: req.user.cart, userInfo: req.body })
    req.user.cart = []
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: result._id })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
      console.log(req.body)
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id }).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const result = await orders.find().populate('user', 'account').populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getOrdersById = async (req, res) => {
  try {
    const result = await orders.findById(req.params.id).populate('user', 'account').populate('products.product')
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '找不到' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateOrdersById = async (req, res) => {
  try {
    const result = await orders.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).send({ success: true, message: '', result })
    console.log(result)
  } catch (error) {
    console.log(error)
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}