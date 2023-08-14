const express = require("express")
const { connection } = require("./configs/db")
const { apiRouter } = require("./routes/allroutes")

require("dotenv").config()

const app = express()

app.use(express.json())
app.use("/api",apiRouter)

app.get("/", async (req, res) => {
    res.send("Air ticket booking system")
})


app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("Connected to the mongo database");
    }
    catch (error) {
        console.log(error.message);
    }
    console.log(`server is running on ${process.env.PORT}`);
})