const docsService = require('../services/docsService')

const getAllDocs = async (req, res) => {
  try {
    const docs = await docsService.getAllDocs(req.user.id)
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getDoc = async (req, res) => {
  try {
    const doc = await docsService.getDoc(req.params.id, req.user.id)
    res.status(200).json(doc)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const createDoc = async (req, res) => {
  try {
    const { id, name } = req.body
    if (!id || !name) return res.status(400).json({ error: 'id and name required' })
    const doc = await docsService.createDoc(id, req.user.id, name)
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const updateDoc = async (req, res) => {
  try {
    const { content } = req.body
    const doc = await docsService.updateDoc(req.params.id, req.user.id, content)
    res.status(200).json(doc)
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

const deleteDoc = async (req, res) => {
  try {
    await docsService.deleteDoc(req.params.id, req.user.id)
    res.status(200).json({ message: 'Doc deleted' })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
}

module.exports = { getAllDocs, getDoc, createDoc, updateDoc, deleteDoc }
