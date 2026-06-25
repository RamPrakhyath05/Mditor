const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userRepository = require('../repositories/userRepository')

const register = async (username, password) => {
  const existing = await userRepository.findByUsername(username)
  if (existing) throw new Error('Username already taken')

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await userRepository.createUser(username, hashedPassword)
  return user
}

const login = async (username, password) => {
  const user = await userRepository.findByUsername(username)
  if (!user) throw new Error('Invalid credentials')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid credentials')

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  return { token, username: user.username }
}

module.exports = { register, login }
