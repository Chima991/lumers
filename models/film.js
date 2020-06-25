const {Schema, model} = require('mongoose')

const film = new Schema ({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required:true
    },
    genre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },

})

module.exports = model('Film', film)