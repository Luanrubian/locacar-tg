const pool = require('../db/connection')

async function listUsers(req, res) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, phone, active, created_at FROM users ORDER BY created_at DESC'
  )
  res.json(rows)
}

async function listVehicles(req, res) {
  const [rows] = await pool.query(
    `SELECT v.*, u.name AS owner_name FROM vehicles v JOIN users u ON v.owner_id = u.id ORDER BY v.created_at DESC`
  )
  res.json(rows)
}

async function listReservations(req, res) {
  const { status } = req.query
  const cond = status ? 'WHERE r.status = ?' : ''
  const vals = status ? [status] : []
  const [rows] = await pool.query(
    `SELECT r.*, v.brand, v.model, u.name AS renter_name FROM reservations r
     JOIN vehicles v ON r.vehicle_id = v.id
     JOIN users u ON r.renter_id = u.id
     ${cond} ORDER BY r.created_at DESC`,
    vals
  )
  res.json(rows)
}

module.exports = { listUsers, listVehicles, listReservations }
