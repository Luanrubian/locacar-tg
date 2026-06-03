const express = require('express')
const router = express.Router()
const { auth, authorize } = require('../middlewares/auth')
const upload = require('../middlewares/upload')
const { create, update, remove, list, getById, mine } = require('../controllers/vehicleController')

router.get('/', list)
router.get('/mine', auth, authorize('locador', 'admin'), mine)
router.get('/:id', getById)
router.post('/', auth, authorize('locador', 'admin'), upload.single('image'), create)
router.patch('/:id', auth, upload.single('image'), update)
router.delete('/:id', auth, remove)

module.exports = router
