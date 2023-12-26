

// const express = require('express');
// const app = express();
// const MongoClient = require('mongodb').MongoClient;

// app.use(express.json());

// // Replace <username>, <password>, and <dbname> with your MongoDB Atlas username, password, and database name
// const uri = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/?retryWrites=true&w=majority";
// async function connectToMongoDB() {
//  try {
//    const client = new MongoClient(uri);
//    await client.connect();
//    const collection = client.db("<dbname>").collection("devices");

//    app.post('/data', (req, res) => {
//      console.log(req.body);

//      collection.insertOne(req.body, function(err, result) {
//        if (err) throw err;
//        console.log("1 document inserted");
//        res.sendStatus(200);
//      });
//    });

//    app.listen(8080, () => console.log('Server listening on port 8080'));
//  } catch (err) {
//    console.error('Failed to connect to MongoDB:', err);
//  }
// }

// connectToMongoDB();

// const express = require('express');
// const app = express();
// const MongoClient = require('mongodb').MongoClient;

// app.use(express.json());

// // Replace <username>, <password>, and <dbname> with your MongoDB Atlas username, password, and database name
// const uri = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/?retryWrites=true&w=majority";

// async function connectToMongoDB() {
//   try {
//     const client = new MongoClient(uri);
//     await client.connect();
//     const collection = client.db("<dbname>").collection("devices");

//     app.post('/data', (req, res) => {
//       console.log(req.body);

//       collection.insertOne(req.body, function (err, result) {
//         if (err) {
//           console.error("Error inserting document:", err);
//           res.status(500).send("Internal Server Error");
//         } else {
//           console.log("1 document inserted");
//           res.sendStatus(200);
//         }
//       });
//     });

//     app.listen(8080, () => console.log('Server listening on port 8080'));
//   } catch (err) {
//     console.error('Failed to connect to MongoDB:', err);
//   }
// }

// connectToMongoDB();
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

app.use(express.json());

// Replace <username>, <password>, and <dbname> with your MongoDB Atlas username, password, and database name
const uri = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/<dbname>?retryWrites=true&w=majority";

async function connectToMongoDB() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("<dbname>").collection("devices");

    async function handlePostRequest(req, res) {
      try {
        console.log(req.body);

        // Perform the insert operation without checking isConnected
        const result = await collection.insertOne(req.body);
        console.log("1 document inserted");
        res.sendStatus(200);
      } catch (err) {
        console.error("Error inserting document:", err);
        res.status(500).send("Internal Server Error: " + err.message);
      }
    }

    app.post('/data', async (req, res) => {
      if (!client.isConnected()) {
        try {
          await client.connect();
        } catch (err) {
          console.error("Failed to connect to MongoDB:", err);
          res.status(500).send("Internal Server Error: Failed to connect to MongoDB");
          return;
        }
      }

      await handlePostRequest(req, res);
    });

    app.listen(8080, () => console.log('Server listening on port 8080'));
  } catch (err) {
    console.error('Failed to initialize MongoDB connection:', err);
  }
}

connectToMongoDB();


