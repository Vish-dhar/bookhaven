import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { EmptyState, ErrorState, ProductSkeleton } from "../components/ui";
import { fetchFavourites } from "../store/favouritesSlice";

export default function Favourites() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const { items, status, error } = useSelector((state) => state.favourites);

    useEffect(() => {
        if (token) dispatch(fetchFavourites());
    }, [dispatch, token]);

    if (!token) {
        return <Navigate to="/login" replace state={{ from: "/favourites" }} />;
    }

    return (
        <div className="container page">
            <div className="page-head">
                <h1 className="page-title">My favourites{status === "succeeded" ? ` (${items.length})` : ""}</h1>
                <Link to="/" className="link">Continue shopping</Link>
            </div>

            {status === "failed" && (
                <ErrorState message={error} onRetry={() => dispatch(fetchFavourites())} />
            )}

            {(status === "idle" || status === "loading") && items.length === 0 && (
                <div className="grid">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ProductSkeleton key={index} />
                    ))}
                </div>
            )}

            {status === "succeeded" && items.length === 0 && (
                <EmptyState title="No favourites yet" text="Tap the heart on any book to save it here.">
                    <Link to="/" className="btn btn--primary btn--md">Browse books</Link>
                </EmptyState>
            )}

            {items.length > 0 && (
                <div className="grid">
                    {items.map((book) => (
                        <ProductCard key={book._id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
}
