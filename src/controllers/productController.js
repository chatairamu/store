// src/controllers/productController.js
// Controller for handling product-related API logic.

const Product = require('../models/Product');

/**
 * Get all products, with optional filtering by category.
 * @route GET /api/products
 * @route GET /api/products?category=<id>
 */
exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId, tagId } = req.query;
    const filters = { categoryId, tagId };
    const products = await Product.findAll(filters);
    res.status(200).json(products);
  } catch (error) {
    console.error('Get All Products Error:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

/**
 * Get a single product by its ID.
 * @route GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    res.status(500).json({ message: 'Server error while fetching the product.' });
  }
};

/**
 * Create a new product.
 * @route POST /api/products
 * @access Protected (Vendors/Admins only)
 */
exports.createProduct = async (req, res) => {
  // This is a protected route. The 'protect' and 'admin' middleware
  // should be applied to the route that uses this controller.
  try {
    // Assuming the vendor's ID is attached to the request by middleware
    // e.g., req.vendor.id
    const vendorId = req.vendor ? req.vendor.id : null;
    if (!vendorId) {
        return res.status(403).json({ message: 'Not authorized. Only vendors can create products.' });
    }

    const productData = { ...req.body, vendor_id: vendorId };

    // Basic validation
    const { category_id, name, mrp, sale_price, gst_slab_id } = productData;
    if (!category_id || !name || !mrp || !sale_price || !gst_slab_id) {
      return res.status(400).json({ message: 'Please provide all required product fields.' });
    }

    const result = await Product.create(productData);
    const newProduct = await Product.findById(result.insertId);

    res.status(201).json({
      message: 'Product created successfully!',
      product: newProduct
    });

  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Server error while creating the product.' });
  }
};
