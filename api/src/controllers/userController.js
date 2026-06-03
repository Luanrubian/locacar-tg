const bcrypt = require('bcrypt')
const pool = require('../db/connection')

async function getMe(req, res) {
  const [rows] = await pool.query(
    'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
    [req.user.id]
  )
  if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' })
  res.json(rows[0])
}

async function updateMe(req, res) {
  const { name, phone, currentPassword, newPassword } = req.body
  const fields = []
  const values = []

  if (name) { fields.push('name = ?'); values.push(name) }
  if (phone) { fields.push('phone = ?'); values.push(phone) }

  if (newPassword) {
    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id])
    const match = await bcrypt.compare(currentPassword || '', rows[0].password_hash)
    if (!match) return res.status(403).json({ error: 'Senha atual incorreta' })
    fields.push('password_hash = ?')
    values.push(await bcrypt.hash(newPassword, 10))
  }

  if (fields.length === 0) return res.status(400).json({ error: 'Nenhum campo para atualizar' })

  values.push(req.user.id)
  await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)

  const [updated] = await pool.query(
    'SELECT id, name, email, role, phone FROM users WHERE id = ?',
    [req.user.id]
  )
  res.json(updated[0])
}

module.exports = { getMe, updateMe }
