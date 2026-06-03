const express = require('express')
const router = express.Router()
const { auth, authorize } = require('../middlewares/auth')
const { listUsers, listVehicles, listReservations } = require('../controllers/adminController')

router.use(auth, authorize('admin'))

router.get('/users', listUsers)
router.get('/vehicles', listVehicles)
router.get('/reservations', listReservations)

module.exports = router
