const express = require("express");

const router = express.Router();

const Product = require("../models/productModel");

// ✅ POST - Add product
router.post("/", async (req, res) => {
  try {
    const { name, quantity, price, location } = req.body;

    const product = new Product({
      name,
      quantity,
      price,
      location,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET - Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;