const express = require('express')
const router = express.Router()
const { auth, authorize } = require('../middlewares/auth')
const { create, list, updateStatus } = require('../controllers/reservationController')

router.post('/', auth, authorize('locatario'), create)
router.get('/', auth, list)
router.patch('/:id/status', auth, updateStatus)

module.exports = router
