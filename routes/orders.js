import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'

import {
  checkout,
  getMyOrders,
  getAllOrders,
  getOrdersById,
  updateOrdersById
} from '../controllers/orders.js'

const router = express.Router()

router.post('/', auth, content('application/json'), checkout)
router.get('/me', auth, getMyOrders)
router.get('/all', auth, admin, getAllOrders)
router.get('/:id', getOrdersById)
router.patch('/:id', auth, admin, content('application/json'), updateOrdersById)

export default router
