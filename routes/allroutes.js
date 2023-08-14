const express = require("express")
const { userModel } = require("../models/userModel")
const { flightModel } = require("../models/flightModel")
const { bookingModel } = require("../models/bookingModel")

const apiRouter = express.Router()


// user signup route
apiRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body
    try {
        const isExisting = await userModel.findOne({ email })
        if (isExisting) {
            res.send({ 'msg': 'user already exists please login' })
        } else {
            const user = new userModel({ name, email, password })
            await user.save()
            res.status(201)
            res.send({ 'msg': 'user registered successfully' })
        }
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})


// user login
apiRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const isValid = await userModel.findOne({ email })
        if (!isValid) {
            res.status(401)
            res.send({ 'msg': 'please enter  a correct email address' })
        } else {
            res.status(201)
            res.send({ 'msg': 'user logged in successfully' })
        }
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})


// all flights details
apiRouter.get("/flights", async (req, res) => {
    try {
        const flights = await flightModel.find()
        res.status(200)
        res.send({ 'msg': "all the flights", "flights": flights })
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})


// details for a particular flight by id
apiRouter.get("/flights/:id", async (req, res) => {
    let flightID = req.params.id
    try {
        const flight = await flightModel.findById({ "_id": flightID })
        res.status(200)
        res.send({ 'msg': `flight details with id: ${flightID}`, "flight": flight })
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})


// adding a new flight
apiRouter.post("/flights", async (req, res) => {
    const { airline, flightNo, departure, arrival, departureTime, arrivalTime, seats, price } = req.body
    try {
        const newFlight = new flightModel({ airline, flightNo, departure, arrival, departureTime, arrivalTime, seats, price })
        await newFlight.save()
        res.status(201)
        res.send({ 'msg': 'new flight has been added to the database' })
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})

// "airline": " Air-India",
// "flightNo": "673489",
// "departure": "Delhi",
// "arrival": "Mumbai",
// "departureTime": "2023-08-14T00:00:00.000Z",
// "arrivalTime": "2023-08-14T00:00:00.000Z",
// "seats": 250,
// "price": 5000


// update deatils of a specific flight
apiRouter.patch("/flights/:id", async (req, res) => {
    const payload = req.body
    const flightID = req.params.id
    try {
        await flightModel.findByIdAndUpdate({ "_id": flightID }, payload)
        res.status(204)
        res.send({ 'msg': `updated the details of the flight with id:${flightID}` })
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})


// delete a specific flight
apiRouter.delete("/flights/:id", async (req,res) => {
    const flightID = req.params.id
    try{
        await flightModel.findByIdAndDelete({"_id":flightID})
        res.status(202)
        res.send({'msg':`deleted the details of the flight with id:${flightID}`})
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})

// user can book a flight
apiRouter.post("/booking", async (req, res) => {
    try {
        const { userID, flightID } = req.body

        const user = await userModel.findById({ "_id": userID })
        const flight = await flightModel.findById({ "_id": flightID })

        if (!user || !flight) {
            res.status(404)
            res.send({ 'error': 'user or flight not found' })
        } else {
            const booking = new bookingModel({
                user,
                flight
            })
            await booking.save()
            res.status(201)
            res.send({'msg':`new booking from user: ${userID} for the flight: ${flightID}`})
        }
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})


// all the bookings route
apiRouter.get("/dashboard", async (req, res) => {
    try {
        const bookings = await bookingModel.find()
        res.status(200)
        res.send({'msg':'all the bookings','Bookings':bookings})
    }
    catch (error) {
        res.status(400)
        res.send({ 'msg': 'something went wrong', 'error': error.message })
    }
})
module.exports = {
    apiRouter
}