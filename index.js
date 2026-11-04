import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

let client;
let dbPromise;

function getDb() {
  if (!dbPromise) {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is not set");
    }
    client = new MongoClient(process.env.MONGODB_URL);
    dbPromise = client
      .connect()
      .then(() => client.db("apps_store_project"))
      .catch((err) => {
        dbPromise = null;
        throw err;
      });
  }
  return dbPromise;
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/device-categories", async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection("device-categories").find({}).toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.collection("categories").find({}).toArray();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;