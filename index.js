import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { isRecording } from "./controller/recordingController.js";
import recordingRoutes from "./routes/recordingRoutes.js";
import Item from "./model/Item.js";
import Recording from "./model/Record.js";

const app = express();
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

const fetchDataAndStore = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    for (const item of data.products) {
      const existingItem = await Item.findOne({ id: item.id });

      if (!existingItem) {
        const newItem = new Item({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          price: item.price,
        });

        await newItem.save();
      }
    }
  } catch (error) {
    console.error("Error fetching and storing data:", error);
  }
};

mongoose
  .connect(MONGOURL)
  .then(async () => {
    try {
      await fetchDataAndStore();
      console.log("Data fetched and stored successfully");
    } catch (error) {
      console.error("Error fetching and storing data:", error);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use((req, res, next) => {
  if (isRecording) {
    const originalSend = res.send;
    const start = Date.now();

    res.send = function (body) {
      const duration = Date.now() - start;
      const recording = new Recording({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        request: {
          method: req.method,
          url: req.originalUrl,
          headers: req.headers,
          body: req.body,
        },
        response: {
          status: res.statusCode,
          headers: res.getHeaders(),
          body: body,
          duration: duration,
        },
      });

      recording
        .save()
        .then(() => {})
        .catch((error) => {
          console.error("Error saving recording:", error);
        });

      originalSend.call(this, body);
    };
  }
  next();
});

app.use("/recordings", recordingRoutes);
