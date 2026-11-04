import { API_URL } from "../config/constants";

// One small helper used by every thunk. It talks only to our own Bookhaven backend.
export const apiRequest = async (method, path, body, token) => {
    const headers = {};

    if (body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = "Bearer " + token;

    let response;

    try {
        response = await fetch(API_URL + path, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch (error) {
        throw new Error("Cannot reach the server. Check that the backend is running.");
    }

    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        throw new Error((data && data.message) || "Something went wrong");
    }

    return data;
};

// Turn { category: "Fiction", page: 2, minPrice: "" } into "?category=Fiction&page=2"
export const buildQuery = (params) => {
    const parts = [];

    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== "" && value !== null && value !== undefined && value !== 0) {
            parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        }
    });

    return parts.length ? "?" + parts.join("&") : "";
};
