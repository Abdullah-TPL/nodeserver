

// // connectToMongoDB();
// const express = require('express');
// const app = express();
// const { MongoClient } = require('mongodb');

// app.use(express.json());

// // Replace <username>, <password>, and <dbname> with your MongoDB Atlas username, password, and database name
// const uri = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/<dbname>?retryWrites=true&w=majority";

// async function connectToMongoDB() {
//   try {
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     let isConnected = false;

//     await client.connect();
//     isConnected = true;

//     const collection = client.db("BLE_Gateway").collection("devices");

//     async function handlePostRequest(req, res) {
//       try {
//         console.log(req.body);

//         if (!isConnected) {
//           throw new Error("MongoDB client is not connected");
//         }

//         // Add a timestamp to the data before inserting it
//         const dataWithTimestamp = {
//           ...req.body,
//           timestamp: new Date()
//         };

//         const result = await collection.insertOne(dataWithTimestamp);
//         console.log("1 document inserted");
//         res.sendStatus(200);
//       } catch (err) {
//         console.error("Error inserting document:", err);
//         res.status(500).send("Internal Server Error: " + err.message);
//       }
//     }
    


//     async function handleGetRequest(req, res) {
//       try {
//         if (!isConnected) {
//           throw new Error("MongoDB client is not connected");
//         }

//         const data = await collection.find({}).toArray();
//         res.json(data);
//       } catch (err) {
//         console.error("Error retrieving data:", err);
//         res.status(500).send("Internal Server Error: " + err.message);
//       }
//     }

//     app.post('/data', handlePostRequest);
//     app.get('/data', handleGetRequest); // New endpoint for retrieving data

//     app.listen(8080, () => console.log('Server listening on port 8080'));
//   } catch (err) {
//     console.error('Failed to initialize MongoDB connection:', err);
//   }
// }

// connectToMongoDB();

//Updated Code

const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

app.use(express.json());

// Replace <username>, <password>, and <dbname> with your MongoDB Atlas username, password, and database name
const uri = "mongodb+srv://MERN:mernstack@cluster0.36bh8a0.mongodb.net/<dbname>?retryWrites=true&w=majority";

async function connectToMongoDB() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    let isConnected = false;

    await client.connect();
    isConnected = true;

    const collection = client.db("BLE_Gateway").collection("devices");

    async function handlePostRequest(req, res) {
      try {
        console.log(req.body);

        if (!isConnected) {
          throw new Error("MongoDB client is not connected");
        }

        // Check if the 'data' field is present in the request body
        if (!req.body.data) {
          throw new Error("'data' field is missing in the request body");
        }

        const { data } = req.body;

        // Extract the last part after splitting with '09'
        const lastPart = data.split('09').pop();

        // Parse the hexadecimal data to UTF-8
        const parsedData = Buffer.from(lastPart, 'hex').toString('utf-8');
        
        console.log("Parsed Data:", parsedData);

        // Add a timestamp to the data before inserting it
        const dataWithTimestamp = {
          ...req.body,
          parsedData,
          timestamp: new Date()
        };

        const result = await collection.insertOne(dataWithTimestamp);
        console.log("1 document inserted");
        res.sendStatus(200);
      } catch (err) {
        console.error("Error inserting document:", err);
        res.status(500).send("Internal Server Error: " + err.message);
      }
    }

    async function handleGetRequest(req, res) {
      try {
        if (!isConnected) {
          throw new Error("MongoDB client is not connected");
        }

        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (err) {
        console.error("Error retrieving data:", err);
        res.status(500).send("Internal Server Error: " + err.message);
      }
    }

    app.post('/data', handlePostRequest);
    app.get('/data', handleGetRequest); // New endpoint for retrieving data

    app.listen(8080, () => console.log('Server listening on port 8080'));
  } catch (err) {
    console.error('Failed to initialize MongoDB connection:', err);
  }
}

connectToMongoDB();

