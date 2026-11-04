// Round to 2 decimal places (money).
const round2 = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};

// Discount price = price x (1 - discountPercentage / 100)
const calcFinalPrice = (price, discountPercentage) => {
    return round2(price * (1 - discountPercentage / 100));
};

module.exports = {
    round2,
    calcFinalPrice
};
