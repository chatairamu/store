// src/controllers/publicVendorController.js
// Controller for public-facing vendor information.

const Vendor = require('../models/Vendor');

/**
 * Gets public settings for a specific vendor.
 * @route GET /api/public/vendors/:id/settings
 */
exports.getVendorPublicSettings = async (req, res) => {
    try {
        const vendorId = req.params.id;
        const vendor = await Vendor.findById(vendorId); // findById already excludes sensitive info

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }

        // Only return specific, safe-to-be-public settings
        res.status(200).json({
            min_cart_value: vendor.min_cart_value,
            // You could add other public settings here in the future
        });

    } catch (error) {
        console.error('Get Vendor Public Settings Error:', error);
        res.status(500).json({ message: 'Server error while fetching vendor settings.' });
    }
};
