// src/controllers/vendorController.js
// Controller for rendering vendor dashboard pages.

const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Renders the main vendor dashboard page.
 * @route GET /vendor/dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const vendorId = req.vendor.id;

    // Fetch all data in parallel for efficiency
    const [
      netEarnings,
      vendorOrders,
      vendorProducts
    ] = await Promise.all([
      Vendor.calculateEarnings(vendorId),
      Order.findOrdersByVendorId(vendorId),
      Product.findByVendorId(vendorId)
    ]);

    const totalOrders = vendorOrders.length;
    const activeProducts = vendorProducts.filter(p => p.status === 'active').length;

    res.render('vendor/dashboard', {
      title: 'Dashboard',
      vendor: req.vendor,
      totalEarnings: netEarnings,
      totalOrders: totalOrders,
      activeProducts: activeProducts
    });
  } catch (error) {
    console.error('Vendor Dashboard Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Renders the vendor's product management page.
 * @route GET /vendor/products
 */
exports.getProductsPage = async (req, res) => {
  try {
    const products = await Product.findByVendorId(req.vendor.id);
    res.render('vendor/products', {
      title: 'My Products',
      vendor: req.vendor,
      products: products
    });
  } catch (error) {
    console.error('Vendor Products Page Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Handles the creation of a new product by a vendor.
 * @route POST /vendor/products
 */
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body, vendor_id: req.vendor.id };

    // Basic validation
    const { name, mrp, sale_price, category_id, gst_slab_id } = productData;
    if (!name || !mrp || !sale_price || !category_id || !gst_slab_id) {
      return res.status(400).send('Missing required fields.');
    }

    // Create product in DB
    const result = await Product.create(productData);
    const newProductId = result.insertId;

    // Handle file upload
    if (req.file) {
      const imagePath = req.file.path.replace('public/', ''); // Store relative path
      await Product.addImage(newProductId, imagePath);
    }

    // Handle tags
    const { tags } = req.body;
    if (tags) {
        const tagIds = Array.isArray(tags) ? tags : [tags];
        await Product.updateTags(newProductId, tagIds);
    }

    res.redirect('/vendor/products');

  } catch (error) {
    console.error('Vendor Create Product Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Handles the deletion of a product by a vendor.
 * @route DELETE /vendor/products/:id
 */
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const vendorId = req.vendor.id;

        // Security Check: Ensure the product belongs to the vendor
        const product = await Product.findById(productId);
        if (!product || product.vendor_id !== vendorId) {
            return res.status(403).json({ message: 'Not authorized to delete this product.' });
        }

        await Product.delete(productId);
        // Using 200 for AJAX response, or could be 204 No Content.
        res.status(200).json({ message: 'Product deleted successfully.' });

    } catch (error) {
        console.error('Vendor Delete Product Error:', error);
        res.status(500).json({ message: 'Server error while deleting product.' });
    }
};

/**
 * Renders the page for editing an existing product.
 * @route GET /vendor/products/edit/:id
 */
const Tag = require('../models/Tag');

exports.getEditProductPage = async (req, res) => {
    try {
        const productId = req.params.id;
        const vendorId = req.vendor.id;

        const [product, tags, productTags] = await Promise.all([
            Product.findById(productId),
            Tag.findAll(),
            Product.getTags(productId)
        ]);

        // Security Check: Ensure the product belongs to the vendor
        if (!product || product.vendor_id !== vendorId) {
            return res.status(403).send('Not authorized to edit this product.');
        }

        const productTagIds = productTags.map(t => t.id);

        res.render('vendor/editProduct', {
            title: 'Edit Product',
            vendor: req.vendor,
            product: product,
            allTags: tags,
            productTagIds: productTagIds
        });
    } catch (error) {
        console.error('Get Edit Product Page Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Handles the update of an existing product.
 * @route POST /vendor/products/edit/:id
 */
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const vendorId = req.vendor.id;
        const productData = req.body;

        // Security Check
        const product = await Product.findById(productId);
        if (!product || product.vendor_id !== vendorId) {
            return res.status(403).send('Not authorized to update this product.');
        }

        await Product.update(productId, productData);

        if (req.file) {
            // Handle new image upload - a more robust system would delete the old image
            const imagePath = req.file.path.replace('public/', '');
            // This simple addImage assumes one image. A real system would need an updateOrAddImage method.
            await Product.addImage(productId, imagePath);
        }

        // Handle tags
        const { tags } = req.body;
        const tagIds = tags ? (Array.isArray(tags) ? tags : [tags]) : [];
        await Product.updateTags(productId, tagIds);

        res.redirect('/vendor/products');

    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Renders the page for adding a new product.
 * @route GET /vendor/products/add
 */
exports.getAddProductPage = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.render('vendor/addProduct', {
            title: 'Add Product',
            vendor: req.vendor,
            allTags: tags
        });
    } catch (error) {
        console.error('Get Add Product Page Error:', error);
        res.status(500).send('Server Error');
    }
};

/**
 * Renders the vendor's order management page.
 * @route GET /vendor/orders
 */
exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await Order.findOrdersByVendorId(req.vendor.id);
    res.render('vendor/orders', {
      title: 'My Orders',
      vendor: req.vendor,
      orders: orders
    });
  } catch (error) {
    console.error('Vendor Orders Page Error:', error);
    res.status(500).send('Server Error');
  }
};

/**
 * Handles updating the status of an order.
 * @route POST /vendor/orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const vendorId = req.vendor.id;

        // Security check: Ensure the order belongs to this vendor.
        // We can do this by checking if the order appears in the vendor's order list.
        const vendorOrders = await Order.findOrdersByVendorId(vendorId);
        const orderExistsForVendor = vendorOrders.some(order => order.id.toString() === orderId);

        if (!orderExistsForVendor) {
            return res.status(403).send('Not authorized to update this order.');
        }

        await Order.updateStatus(orderId, status);
        res.redirect('/vendor/orders');

    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).send('Server Error');
    }
};
