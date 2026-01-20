require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:3000", // local Next.js
      "https://gadget-hunter.vercel.app", // prod (if any)
      /\.vercel\.app$/, // allow ALL Vercel preview URLs
    ],
    credentials: true,
  }),
);

app.use(express.json());

// MongoDB Client
const client = new MongoClient(process.env.MONGO_URI);

let cachedClient = null;
let cachedDb = null;

// Connect to MongoDB (Vercel optimized)
async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    await client.connect();
    const db = client.db("gadget-hunter");

    cachedClient = client;
    cachedDb = db;

    console.log("✅ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Gadget Hunter API is running...");
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");

    const products = await productsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// Get single product
app.get("/products/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");

    const product = await productsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// Add product
app.post("/products", async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");

    const { name, description, price, image, category } = req.body;

    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = {
      name,
      description,
      price,
      image,
      category,
      createdAt: new Date(),
    };

    const result = await productsCollection.insertOne(newProduct);

    res.status(201).json({
      message: "✅ Product added successfully",
      product: {
        _id: result.insertedId,
        ...newProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product",
      error: error.message,
    });
  }
});

// Export for Vercel
module.exports = app;
