const pool = require('../db')

const loadYDoc = async (docId) => {
  const result = await pool.query(
    'SELECT ydoc FROM docs WHERE id = $1',
    [docId]
  )

  return result.rows[0]?.ydoc || null
}

const saveYDoc = async (docId, update) => {
  await pool.query(
    `UPDATE docs
     SET ydoc = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [update, docId]
  )
}

module.exports = {
  loadYDoc,
  saveYDoc,
}
