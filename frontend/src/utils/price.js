export const round2 = (value) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
};

// Discount price = price x (1 - discountPercentage / 100)
export const getDiscountPrice = (price, discountPercentage) => {
    return round2(price * (1 - discountPercentage / 100));
};

export const formatPrice = (value) => {
    return "$" + Number(value).toFixed(2);
};
