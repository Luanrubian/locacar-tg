const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db/connection')

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

async function register(req, res) {
  const { name, email, password, role = 'locatario', phone } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password são obrigatórios' })
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email])
  if (existing.length > 0) return res.status(409).json({ error: 'E-mail já cadastrado' })

  const password_hash = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)',
    [name, email, password_hash, role, phone || null]
  )

  const user = { id: result.insertId, name, email, role }
  res.status(201).json({ token: signToken(user) })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'email e password são obrigatórios' })

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND active = 1', [email])
  if (rows.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' })

  const user = rows[0]
  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) return res.status(401).json({ error: 'Credenciais inválidas' })

  res.json({ token: signToken(user) })
}

module.exports = { register, login }
