import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { EmptyState, ErrorState } from "../components/ui";
import { fetchMyOrders, cancelOrder } from "../store/ordersSlice";
import { formatPrice } from "../utils/price";

const statusClass = {
    PLACED: "badge badge--info",
    CONFIRMED: "badge badge--info",
    SHIPPED: "badge badge--warning",
    DELIVERED: "badge badge--success",
    CANCELLED: "badge badge--danger"
};

export default function Orders() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const { list, status, error } = useSelector((state) => state.orders);

    useEffect(() => {
        if (token) dispatch(fetchMyOrders());
    }, [dispatch, token]);

    if (!token) {
        return <Navigate to="/login" replace state={{ from: "/orders" }} />;
    }

    return (
        <div className="container page">
            <div className="page-head">
                <h1 className="page-title">My orders</h1>
                <Link to="/" className="link">Continue shopping</Link>
            </div>

            {status === "loading" && <p className="muted">Loading your orders…</p>}

            {status === "failed" && <ErrorState message={error} onRetry={() => dispatch(fetchMyOrders())} />}

            {status === "succeeded" && list.length === 0 && (
                <EmptyState title="No orders yet" text="Your orders will show up here after checkout.">
                    <Link to="/" className="btn btn--primary btn--md">Browse books</Link>
                </EmptyState>
            )}

            <div className="orders">
                {list.map((order) => (
                    <article className="panel order" key={order._id}>
                        <header className="order__head">
                            <div>
                                <strong>Order {order._id.slice(-8).toUpperCase()}</strong>
                                <span className="muted"> · {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <span className={statusClass[order.orderStatus]}>{order.orderStatus}</span>
                        </header>

                        <ul className="order__items">
                            {order.items.map((item) => (
                                <li key={item.book}>
                                    <span>{item.title} × {item.quantity}</span>
                                    <span>{formatPrice(item.lineTotal)}</span>
                                </li>
                            ))}
                        </ul>

                        <footer className="order__foot">
                            <span>
                                Total <strong>{formatPrice(order.total)}</strong>
                                {order.discount > 0 && <span className="muted"> (coupon {order.couponCode} saved {formatPrice(order.discount)})</span>}
                            </span>
                            {order.orderStatus === "PLACED" && (
                                <button type="button" className="btn btn--danger btn--sm" onClick={() => dispatch(cancelOrder(order._id))}>
                                    Cancel order
                                </button>
                            )}
                        </footer>
                    </article>
                ))}
            </div>
        </div>
    );
}
