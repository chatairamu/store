// src/utils/priceCalculator.js
// A utility to determine the correct current price of a product.

/**
 * Determines the effective current price of a product,
 * considering any active special prices or promotions.
 *
 * @param {object} product - The full product object from the database.
 * @returns {number} The current effective price.
 */
function getCurrentPrice(product) {
    if (!product) {
        return 0;
    }

    const now = new Date();
    const hasSpecialPrice = product.special_price && product.special_price > 0;
    const hasStartDate = product.special_price_start;
    const hasEndDate = product.special_price_end;

    if (hasSpecialPrice && hasStartDate && hasEndDate) {
        const startDate = new Date(product.special_price_start);
        const endDate = new Date(product.special_price_end);

        if (now >= startDate && now <= endDate) {
            return parseFloat(product.special_price);
        }
    }

    // If no active special price, return the standard sale price
    return parseFloat(product.sale_price);
}

module.exports = { getCurrentPrice };
