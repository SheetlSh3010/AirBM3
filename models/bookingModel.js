const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'flights'
    }
})

const bookingModel = mongoose.model("booking", bookingSchema)
module.exports = {
    bookingModel
}