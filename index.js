import express from "express";
import cors from "cors";
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


const client = new MongoClient(process.env.MONGODB_URL);


export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const db = await connectToMongoDB();
const connaction = db.db("apps_store_project")

const deviceCategoriesCollection = connaction.collection("device-categories");
const categoriesCollection = connaction.collection("categories");


app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/device-categories", async (req, res) => {
    const result = await deviceCategoriesCollection.find({}).toArray();
    res.send(result);
});

app.get("/categories", async (req, res) => {
    const result = await categoriesCollection.find({}).toArray();
    res.send(result);
});



app.listen(port, () => {
    console.log("Server is running on port 5000");
});