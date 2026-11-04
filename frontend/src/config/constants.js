// Store rules (the backend uses the same values in config/storeRules.js)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const BRAND = "Bookhaven";

export const FREE_SHIPPING_MIN = 50;  // subtotal of 50 or more -> free shipping
export const SHIPPING_FEE = 4.99;
export const LOW_STOCK_LIMIT = 10;    // stock under 10 shows "Only N left"
export const PAGE_SIZE = 8;
export const MAX_PER_BOOK = 10;     // the server accepts at most 10 copies of one book per order

// coupon code -> percentage off the subtotal
export const COUPONS = {
    SAVE10: 10
};

export const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "priceAsc", label: "Price: low to high" },
    { value: "priceDesc", label: "Price: high to low" },
    { value: "rating", label: "Top rated" }
];

export const RATING_OPTIONS = [
    { value: 4, label: "4 stars & up" },
    { value: 3, label: "3 stars & up" },
    { value: 0, label: "Any rating" }
];
