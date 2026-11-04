// Store business rules (same rules are used in the React frontend).
// Change a value here and the order total calculation changes automatically.

const FREE_SHIPPING_MIN = 50;   // subtotal of 50 or more -> shipping is free
const SHIPPING_FEE = 4.99;      // otherwise this fee is added

// coupon code -> percentage off the subtotal
const COUPONS = {
    SAVE10: 10
};

module.exports = {
    FREE_SHIPPING_MIN,
    SHIPPING_FEE,
    COUPONS
};
