const express = require('express')
const {createRoom,enterRoom,removeRoom,renderMain,renderRoom, sendChat} = require('../controllers/index')
const router = express.Router()

router.get('/',renderMain)
router.get('/room',renderRoom)

router.post('/room', createRoom)
router.get('/room/:id', enterRoom)

router.delete('/room/:id', removeRoom);

router.post('/room/:id/chat', sendChat)

module.exports = router