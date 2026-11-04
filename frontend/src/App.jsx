import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { EmptyState } from "./components/ui";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Favourites from "./pages/Favourites";
import { fetchFavourites } from "./store/favouritesSlice";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function NotFound() {
    return (
        <div className="container page">
            <EmptyState title="Page not found" text="This page does not exist.">
                <Link to="/" className="btn btn--primary btn--md">Go to the shop</Link>
            </EmptyState>
        </div>
    );
}

export default function App() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    // load the favourites of whoever is signed in (also after a page refresh)
    useEffect(() => {
        if (token) dispatch(fetchFavourites());
    }, [dispatch, token]);

    return (
        <>
            <ScrollToTop />
            <Header />
            <main className="main">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/favourites" element={<Favourites />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
            <Toast />
        </>
    );
}
