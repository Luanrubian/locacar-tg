require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const vehicleRoutes = require('./routes/vehicles')
const reservationRoutes = require('./routes/reservations')
const adminRoutes = require('./routes/admin')

const path = require('path')

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/vehicles', vehicleRoutes)
app.use('/reservations', reservationRoutes)
app.use('/admin', adminRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`))
