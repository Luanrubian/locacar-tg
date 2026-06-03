const pool = require('../db/connection')

async function create(req, res) {
  const { vehicle_id, start_date, end_date } = req.body
  if (!vehicle_id || !start_date || !end_date) {
    return res.status(400).json({ error: 'vehicle_id, start_date e end_date são obrigatórios' })
  }
  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({ error: 'start_date deve ser anterior a end_date' })
  }

  const [conflict] = await pool.query(
    `SELECT id FROM reservations
     WHERE vehicle_id = ? AND status = 'approved'
       AND start_date < ? AND end_date > ?`,
    [vehicle_id, end_date, start_date]
  )
  if (conflict.length > 0) return res.status(409).json({ error: 'Veículo indisponível no período selecionado' })

  const [vRows] = await pool.query('SELECT daily_rate FROM vehicles WHERE id = ?', [vehicle_id])
  if (vRows.length === 0) return res.status(404).json({ error: 'Veículo não encontrado' })

  const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24))
  const total_price = days * Number(vRows[0].daily_rate)

  const [result] = await pool.query(
    'INSERT INTO reservations (vehicle_id, renter_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)',
    [vehicle_id, req.user.id, start_date, end_date, total_price]
  )
  res.status(201).json({ id: result.insertId, vehicle_id, renter_id: req.user.id, start_date, end_date, total_price, status: 'pending' })
}

async function list(req, res) {
  const { status } = req.query
  let rows

  if (req.user.role === 'locatario') {
    const cond = status ? 'AND r.status = ?' : ''
    const vals = status ? [req.user.id, status] : [req.user.id]
    ;[rows] = await pool.query(
      `SELECT r.*, v.brand, v.model, v.city FROM reservations r
       JOIN vehicles v ON r.vehicle_id = v.id
       WHERE r.renter_id = ? ${cond} ORDER BY r.created_at DESC`,
      vals
    )
  } else {
    const cond = status ? 'AND r.status = ?' : ''
    const vals = status ? [req.user.id, status] : [req.user.id]
    ;[rows] = await pool.query(
      `SELECT r.*, v.brand, v.model, v.city, u.name AS renter_name FROM reservations r
       JOIN vehicles v ON r.vehicle_id = v.id
       JOIN users u ON r.renter_id = u.id
       WHERE v.owner_id = ? ${cond} ORDER BY r.created_at DESC`,
      vals
    )
  }
  res.json(rows)
}

async function updateStatus(req, res) {
  const { id } = req.params
  const { status } = req.body
  const allowed = ['approved', 'rejected', 'cancelled']
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Status inválido' })

  const [rows] = await pool.query(
    `SELECT r.*, v.owner_id FROM reservations r JOIN vehicles v ON r.vehicle_id = v.id WHERE r.id = ?`,
    [id]
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Reserva não encontrada' })
  const reservation = rows[0]

  const isOwner = reservation.owner_id === req.user.id
  const isRenter = reservation.renter_id === req.user.id

  if (!isOwner && !isRenter && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }
  if ((status === 'approved' || status === 'rejected') && !isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Apenas o proprietário pode aprovar ou recusar' })
  }
  if (['rejected', 'cancelled'].includes(reservation.status)) {
    return res.status(400).json({ error: 'Esta reserva não pode ser alterada' })
  }

  await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id])
  res.json({ id: Number(id), status })
}

module.exports = { create, list, updateStatus }
