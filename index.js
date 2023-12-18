const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());

// Replace <username>, <password>, and <dbname> with your MongoDB Atlas username, password, and database name
const mongoUri = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
 if (err) throw err;

 const collection = client.db("BLE").collection("devices");

 app.post('/data', (req, res) => {
  console.log(req.body);

  collection.insertOne(req.body, function(err, result) {
    if (err) throw err;
    console.log("1 document inserted");
    res.sendStatus(200);
  });
 });

 app.listen(8080, () => console.log('Server listening on port 8080'));
});