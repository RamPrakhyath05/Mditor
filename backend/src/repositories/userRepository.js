const pool = require('../db/index')

const createUser = async (username, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
    [username, hashedPassword]
  )
  return result.rows[0]
}

const findByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  )
  return result.rows[0] || null
}

module.exports = { createUser, findByUsername }
