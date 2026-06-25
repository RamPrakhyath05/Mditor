const express = require('express')
const router = express.Router()
const docsController = require('../controllers/docsController')
const authMiddleware = require('../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/', docsController.getAllDocs)
router.get('/:id', docsController.getDoc)
router.post('/', docsController.createDoc)
router.put('/:id', docsController.updateDoc)
router.delete('/:id', docsController.deleteDoc)

module.exports = router
