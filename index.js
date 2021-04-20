const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const objectId = require("mongodb").ObjectId

const app = express()
app.use(bodyParser.json())
app.use(cors());

const port = process.env.PORT || 5000

const uri = "mongodb+srv://carService:carService79@cluster0.5gken.mongodb.net/carService?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("carService").collection("Appointment");
  const serviceCollection = client.db("carService").collection("service");
  const reviewsCollection = client.db("carService").collection("reviews");
  const orderCollection = client.db("carService").collection("orders");
app.post("/addOrder", (req,res)=> {
    const order = req.body
    orderCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})
 app.get("/orders", (req,res)=>{
    orderCollection.find().toArray((err, docs) => res.send(docs))
 })
  app.get("/reviews", (req, res) => {
    reviewsCollection.find().toArray((err, docs) => res.send(docs))
})
app.post("/addReview", (req, res) => {
    const { email, review, name, imgURL } = req.body
    reviewsCollection.insertOne({
        name,
        email,
        review,
        imgURL,
    }).then((result) => res.send(result.insertedCount > 0))
})

app.get("/services", (req, res) => {
    serviceCollection.find().toArray((err, docs) => res.send(docs))
})
app.get("/delete-a-service/:id", (req, res) => {
    console.log(req.params.id)
    serviceCollection.deleteOne({_id: objectId(req.params.id)})
    .then(result => res.send(result.deletedCount > 0))
})
  app.post("/addService", (req,res)=>{
      const service = req.body
      serviceCollection.insertOne(service)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

});





app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(process.env.PORT || port)