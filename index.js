

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

        const { devices } = req.body;

        if (!devices || !Array.isArray(devices)) {
          throw new Error("Invalid 'devices' field in the request body");
        }

        for (const device of devices) {
          const { mac, data, evtType, rssi } = device;

          if (!mac || !data || !evtType || !rssi) {
            console.error("Invalid device information:", device);
            continue; // Skip to the next iteration if the device information is incomplete
          }

          // Extract the last part after splitting with '09'
          const lastPart = data.split('09').pop();

          // Parse the hexadecimal data to UTF-8
          const parsedData = Buffer.from(lastPart, 'hex').toString('utf-8');

          console.log("Parsed Data:", parsedData);

          // Add a timestamp to the data before inserting it
          const dataWithTimestamp = {
            mac,
            parsedData,
            evtType,
            rssi,
            timestamp: new Date()
          };

          const result = await collection.insertOne(dataWithTimestamp);
          console.log("1 document inserted");
        }

        res.sendStatus(200);
      } catch (err) {
        console.error("Error inserting documents:", err);
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
