const pool = require('../db/index')

const getAllDocs = async (ownerId) => {
  const result = await pool.query(
    'SELECT id, name, created_at, updated_at FROM docs WHERE owner_id = $1',
    [ownerId]
  )
  return result.rows
}

const getDocById = async (id, ownerId) => {
  const result = await pool.query(
    'SELECT * FROM docs WHERE id = $1 AND owner_id = $2',
    [id, ownerId]
  )
  return result.rows[0] || null
}

const createDoc = async (id, ownerId, name) => {
  const result = await pool.query(
    'INSERT INTO docs (id, owner_id, name, content) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, ownerId, name, null]
  )
  return result.rows[0]
}

const updateDoc = async (id, ownerId, content) => {
  const result = await pool.query(
    'UPDATE docs SET content = $1, updated_at = NOW() WHERE id = $2 AND owner_id = $3 RETURNING *',
    [content, id, ownerId]
  )
  return result.rows[0] || null
}

const deleteDoc = async (id, ownerId) => {
  const result = await pool.query(
    'DELETE FROM docs WHERE id = $1 AND owner_id = $2 RETURNING id',
    [id, ownerId]
  )
  return result.rows[0] || null
}

module.exports = { getAllDocs, getDocById, createDoc, updateDoc, deleteDoc }
