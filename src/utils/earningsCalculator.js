// src/utils/earningsCalculator.js
// A module for calculating delivery partner earnings based on multiple factors.

const Settings = require('../models/Settings');
const FestivalSurcharge = require('../models/FestivalSurcharge');
const Product = require('../models/Product');
const pool = require('../config/db'); // For direct queries if needed

/**
 * Calculates the distance between two lat/long points in kilometers using the Haversine formula.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} The distance in kilometers.
 */
function getDistanceInKm(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2) || !lat1 || !lon1 || !lat2 || !lon2) {
        return 0;
    }
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}


/**
 * Calculates the total earnings for a single order based on various settings.
 * @param {object} order - The order object.
 * @returns {Promise<number>} The calculated earnings for the order.
 */
async function calculateDeliveryEarningsForOrder(order) {
    // 1. Fetch all settings
    const settings = await Settings.getAllDeliverySettings();

    // 2. Get order items and calculate total weight and special product surcharge
    const [orderItems] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    let totalWeight = 0;
    let specialProductSurcharge = 0;

    for (const item of orderItems) {
        const product = await Product.findById(item.product_id);
        totalWeight += (product.weight || 0) * item.quantity;
        if (product.is_special_product) {
            specialProductSurcharge += settings.special_product_surcharge || 0;
        }
    }

    // 3. Calculate distance
    const [vendor] = await pool.execute('SELECT latitude, longitude FROM vendors WHERE id = ?', [order.vendor_id]);
    const [address] = await pool.execute('SELECT latitude, longitude FROM addresses WHERE id = ?', [order.address_id]);
    const distanceKm = getDistanceInKm(
        vendor[0].latitude, vendor[0].longitude,
        address[0].latitude, address[0].longitude
    );

    // 4. Calculate base earnings
    let earnings = 0;
    earnings += settings.base_fee || 0;
    earnings += distanceKm * (settings.rate_per_km || 0);
    earnings += totalWeight * (settings.rate_per_kg || 0);

    // 5. Add surcharges
    earnings += specialProductSurcharge;
    if (totalWeight > settings.heavy_weight_threshold_kg) {
        earnings += settings.heavy_weight_surcharge || 0;
    }

    // 6. Check for and apply festival surcharge
    const festivalSurcharge = await FestivalSurcharge.findActiveSurchargeForDate(new Date(order.created_at));
    if (festivalSurcharge) {
        const percentageIncrease = festivalSurcharge.charge_percentage || 0;
        earnings += earnings * (percentageIncrease / 100);
    }

    return parseFloat(earnings.toFixed(2));
}

module.exports = { calculateDeliveryEarningsForOrder };
