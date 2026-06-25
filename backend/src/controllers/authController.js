const authService = require('../services/authService')

const register = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }
    const user = await authService.register(username, password)
    res.status(201).json({ message: 'User created', user })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }
    const result = await authService.login(username, password)
    res.status(200).json(result)
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

module.exports = { register, login }
