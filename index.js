
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require("dotenv").config();
const clc = require('cli-color');


app.use(cors());

// app.use(express.json());

//! Warning: Do not use in production
app.use(express.json({
    origin: "*",
}));


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');





// ******************** Work Starts **************************

// ***********************Extra functions ********************

function addMinutes(date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
}




// *************************CRUD operation *******************
const uri = "mongodb+srv://theCleaningFairies:jtjHne5uB0OYgCIf@cluster0.w2egzbh.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {

        const bookingCollection = client.db('bookingDB').collection('booking');

        console.log("Connected! ");



        app.get("/get-booking", async (req, res) => {


            const date = req.query.date;
            const duration = req.query.duration;

            // console.log('date ', date);
            // console.log('duration: ', duration);

            let slots = [];


            // console.log('ola');

            let startD = new Date();
            startD.setHours(1);
            startD.setMinutes(0)
            startD.setSeconds(0)

            let endD = new Date();
            endD.setDate(endD.getDate() + 1);

            endD.setHours(1);
            endD.setMinutes(0)
            endD.setSeconds(0)


            let newD = new Date(startD);


            while (newD < endD) {




                let stD = new Date(newD);
                newD = new Date(addMinutes(newD, parseInt(duration)));

                // console.log(clc.red(stD));
                // console.log(clc.green(newD), '\n\n');

                let slot = {
                    start: new Date(stD),
                    end: new Date(newD)
                }

                slots.push(slot);


            }


            res.send(slots);


        })


        app.post("/booking-slot", async (req, res) => {

            try {

                const data = req.body;
                console.log("body: ", data);

                const result = await bookingCollection.insertOne(data);

                return res.send({ success: true, result })


            } catch (error) {
                res.send({ status: false, error });
            }


        })














    } finally {

        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





// ******************** Work Ends *************************







app.get("/", async (req, res) => {

    setTimeout(() => {
        res.send("Transport inc server ")
    }, 1000);

})




app.listen(5000)

