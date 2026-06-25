const docsRepository = require('../repositories/docsRepository')

const getAllDocs = async (ownerId) => {
  return await docsRepository.getAllDocs(ownerId)
}

const getDoc = async (id, ownerId) => {
  const doc = await docsRepository.getDocById(id, ownerId)
  if (!doc) throw new Error('Doc not found or access denied')
  return doc
}

const createDoc = async (id, ownerId, name) => {
  return await docsRepository.createDoc(id, ownerId, name)
}

const updateDoc = async (id, ownerId, content) => {
  const doc = await docsRepository.updateDoc(id, ownerId, content)
  if (!doc) throw new Error('Doc not found or access denied')
  return doc
}

const deleteDoc = async (id, ownerId) => {
  const doc = await docsRepository.deleteDoc(id, ownerId)
  if (!doc) throw new Error('Doc not found or access denied')
  return doc
}

module.exports = { getAllDocs, getDoc, createDoc, updateDoc, deleteDoc }
