import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../components/Icon";
import { OrderSummary } from "./Cart";
import { selectCartItems } from "../store/cartSlice";
import { placeOrder, resetPlaced } from "../store/ordersSlice";
import { formatPrice } from "../utils/price";

const emptyAddress = {
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: ""
};

export default function Checkout() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const { placing, placeError, placed } = useSelector((state) => state.orders);

    const [address, setAddress] = useState(Object.assign({}, emptyAddress, { fullName: user ? user.name : "" }));

    // forget the "order placed" screen when the customer leaves this page
    useEffect(() => {
        return () => {
            dispatch(resetPlaced());
        };
    }, [dispatch]);

    if (!token) {
        return <Navigate to="/login" replace state={{ from: "/checkout" }} />;
    }

    // order placed: show the confirmation (the cart was already cleared)
    if (placed) {
        return (
            <div className="container page">
                <div className="success">
                    <span className="success__icon"><Icon name="check" size={28} /></span>
                    <h1 className="success__title">Order placed</h1>
                    <p className="success__text">
                        Thank you, {placed.shippingAddress.fullName}. Your order number is
                        <strong> {placed._id.slice(-8).toUpperCase()}</strong>. Pay {formatPrice(placed.total)} in cash when it arrives.
                    </p>
                    <div className="success__actions">
                        <Link to="/orders" className="btn btn--primary btn--md">View my orders</Link>
                        <Link to="/" className="btn btn--secondary btn--md">Keep shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    const update = (field) => (event) => {
        setAddress(Object.assign({}, address, { [field]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(placeOrder({ shippingAddress: address }));
    };

    return (
        <div className="container page">
            <div className="page-head">
                <h1 className="page-title">Checkout</h1>
                <Link to="/cart" className="link link--icon"><Icon name="left" size={16} /> Back to cart</Link>
            </div>

            <div className="cart">
                <form className="panel form" id="checkout-form" onSubmit={handleSubmit}>
                    <h2 className="panel__title">Delivery address</h2>

                    <div className="form__grid">
                        <div className="field">
                            <label className="field__label" htmlFor="fullName">Full name</label>
                            <input id="fullName" className="input" value={address.fullName} onChange={update("fullName")} required autoComplete="name" />
                        </div>
                        <div className="field">
                            <label className="field__label" htmlFor="phone">Phone</label>
                            <input id="phone" type="tel" className="input" value={address.phone} onChange={update("phone")} required autoComplete="tel" />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="line1">Address line 1</label>
                        <input id="line1" className="input" value={address.line1} onChange={update("line1")} required autoComplete="address-line1" />
                    </div>
                    <div className="field">
                        <label className="field__label" htmlFor="line2">Address line 2 (optional)</label>
                        <input id="line2" className="input" value={address.line2} onChange={update("line2")} autoComplete="address-line2" />
                    </div>

                    <div className="form__grid form__grid--3">
                        <div className="field">
                            <label className="field__label" htmlFor="city">City</label>
                            <input id="city" className="input" value={address.city} onChange={update("city")} required autoComplete="address-level2" />
                        </div>
                        <div className="field">
                            <label className="field__label" htmlFor="state">State</label>
                            <input id="state" className="input" value={address.state} onChange={update("state")} required autoComplete="address-level1" />
                        </div>
                        <div className="field">
                            <label className="field__label" htmlFor="postalCode">Postal code</label>
                            <input id="postalCode" className="input" value={address.postalCode} onChange={update("postalCode")} required autoComplete="postal-code" />
                        </div>
                    </div>

                    <h2 className="panel__title">Payment</h2>
                    <label className="choice choice--box">
                        <input type="radio" name="payment" checked readOnly />
                        <span>Cash on delivery <small>Pay when the books arrive.</small></span>
                    </label>

                    {placeError && <p className="alert alert--error" role="alert">{placeError}</p>}
                </form>

                <OrderSummary showCoupon={false}>
                    <ul className="mini-list">
                        {items.map((item) => (
                            <li key={item.id}>
                                <span>{item.title} × {item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <button type="submit" form="checkout-form" className="btn btn--primary btn--lg btn--block" disabled={placing}>
                        {placing ? "Placing order…" : "Place order"}
                    </button>
                </OrderSummary>
            </div>
        </div>
    );
}
