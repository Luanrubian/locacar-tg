const path = require('path')
const fs = require('fs')
const pool = require('../db/connection')

function imageUrl(req, filename) {
  return filename ? `${req.protocol}://${req.get('host')}/uploads/${filename}` : null
}

async function create(req, res) {
  const { brand, model, year, plate, daily_rate, description, city, state } = req.body
  if (!brand || !model || !year || !plate || !daily_rate || !city || !state) {
    if (req.file) fs.unlinkSync(req.file.path)
    return res.status(400).json({ error: 'Campos obrigatórios: brand, model, year, plate, daily_rate, city, state' })
  }
  const img = req.file ? imageUrl(req, req.file.filename) : null
  const [result] = await pool.query(
    'INSERT INTO vehicles (owner_id, brand, model, year, plate, daily_rate, description, image_url, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, brand, model, year, plate, daily_rate, description || null, img, city, state]
  )
  res.status(201).json({ id: result.insertId, ...req.body, image_url: img, owner_id: req.user.id, status: 'available' })
}

async function update(req, res) {
  const { id } = req.params
  const [rows] = await pool.query('SELECT owner_id, image_url FROM vehicles WHERE id = ?', [id])
  if (rows.length === 0) {
    if (req.file) fs.unlinkSync(req.file.path)
    return res.status(404).json({ error: 'Veículo não encontrado' })
  }
  if (rows[0].owner_id !== req.user.id && req.user.role !== 'admin') {
    if (req.file) fs.unlinkSync(req.file.path)
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const allowed = ['brand', 'model', 'year', 'plate', 'daily_rate', 'description', 'city', 'state', 'status']
  const fields = []
  const values = []
  for (const key of allowed) {
    if (req.body[key] !== undefined) { fields.push(`${key} = ?`); values.push(req.body[key]) }
  }

  if (req.file) {
    // Delete old image file if exists
    if (rows[0].image_url) {
      const oldFile = path.join(__dirname, '../../uploads', path.basename(rows[0].image_url))
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile)
    }
    fields.push('image_url = ?')
    values.push(imageUrl(req, req.file.filename))
  }

  if (fields.length === 0) return res.status(400).json({ error: 'Nenhum campo para atualizar' })

  values.push(id)
  await pool.query(`UPDATE vehicles SET ${fields.join(', ')} WHERE id = ?`, values)
  const [updated] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id])
  res.json(updated[0])
}

async function remove(req, res) {
  const { id } = req.params
  const [rows] = await pool.query('SELECT owner_id, image_url FROM vehicles WHERE id = ?', [id])
  if (rows.length === 0) return res.status(404).json({ error: 'Veículo não encontrado' })
  if (rows[0].owner_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }
  if (rows[0].image_url) {
    const file = path.join(__dirname, '../../uploads', path.basename(rows[0].image_url))
    if (fs.existsSync(file)) fs.unlinkSync(file)
  }
  await pool.query('DELETE FROM vehicles WHERE id = ?', [id])
  res.status(204).send()
}

async function list(req, res) {
  const { brand, city, max_price, page = 1, limit = 12 } = req.query
  const conditions = ["v.status = 'available'"]
  const values = []

  if (brand) { conditions.push('v.brand LIKE ?'); values.push(`%${brand}%`) }
  if (city) { conditions.push('v.city LIKE ?'); values.push(`%${city}%`) }
  if (max_price) { conditions.push('v.daily_rate <= ?'); values.push(Number(max_price)) }

  const offset = (Number(page) - 1) * Number(limit)
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const [rows] = await pool.query(
    `SELECT v.*, u.name AS owner_name FROM vehicles v JOIN users u ON v.owner_id = u.id ${where} LIMIT ? OFFSET ?`,
    [...values, Number(limit), offset]
  )
  res.json(rows)
}

async function getById(req, res) {
  const [rows] = await pool.query(
    `SELECT v.*, u.name AS owner_name, u.phone AS owner_phone
     FROM vehicles v JOIN users u ON v.owner_id = u.id
     WHERE v.id = ?`,
    [req.params.id]
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Veículo não encontrado' })
  res.json(rows[0])
}

async function mine(req, res) {
  const [rows] = await pool.query('SELECT * FROM vehicles WHERE owner_id = ?', [req.user.id])
  res.json(rows)
}

module.exports = { create, update, remove, list, getById, mine }
