const mongoose = require('mongoose')

const {Schema} = mongoose

const chatSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    user: {
        type: String,
        required: true,
    },
    chat: String,
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Chat', chatSchema)
