// src/utils/taxCalculator.js
// A centralized utility for calculating accurate totals including GST.

const pool = require('../config/db');

/**
 * Calculates subtotal, GST, and grand total for a given set of cart items.
 * @param {Array<object>} items - An array of items, each must have product_id, quantity, and sale_price.
 * @returns {Promise<object>} An object containing subtotal, gstTotal, and grandTotal.
 */
async function calculateTotals(items) {
    let subtotal = 0;
    let gstTotal = 0;

    if (!items || items.length === 0) {
        return { subtotal: 0, gstTotal: 0, grandTotal: 0 };
    }

    // Use a Map to cache GST percentages to avoid redundant DB calls for the same slab
    const gstSlabCache = new Map();

    for (const item of items) {
        const itemTotal = item.sale_price * item.quantity;
        subtotal += itemTotal;

        // Fetch product's gst_slab_id
        const [productRows] = await pool.execute('SELECT gst_slab_id FROM products WHERE id = ?', [item.product_id]);
        if (productRows.length === 0) continue; // Skip if product not found

        const slabId = productRows[0].gst_slab_id;
        let percentage = 0;

        if (gstSlabCache.has(slabId)) {
            percentage = gstSlabCache.get(slabId);
        } else {
            const [slabRows] = await pool.execute('SELECT percentage FROM gst_slabs WHERE id = ?', [slabId]);
            if (slabRows.length > 0) {
                percentage = slabRows[0].percentage;
                gstSlabCache.set(slabId, percentage);
            }
        }

        const itemGst = itemTotal * (percentage / 100);
        gstTotal += itemGst;
    }

    const grandTotal = subtotal + gstTotal;

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        gstTotal: parseFloat(gstTotal.toFixed(2)),
        grandTotal: parseFloat(grandTotal.toFixed(2))
    };
}

module.exports = { calculateTotals };
