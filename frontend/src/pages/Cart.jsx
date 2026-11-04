import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BookCover from "../components/BookCover";
import Icon from "../components/Icon";
import { EmptyState, QuantityStepper } from "../components/ui";
import {
    increase,
    decrease,
    remove,
    clear,
    applyCoupon,
    removeCoupon,
    maxQuantity,
    selectCartItems,
    selectItemCount,
    selectSubtotal,
    selectDiscount,
    selectShipping,
    selectTotal
} from "../store/cartSlice";
import { formatPrice, round2 } from "../utils/price";
import { COUPONS, FREE_SHIPPING_MIN } from "../config/constants";

export function OrderSummary({ showCoupon, children }) {
    const dispatch = useDispatch();
    const count = useSelector(selectItemCount);
    const subtotal = useSelector(selectSubtotal);
    const discount = useSelector(selectDiscount);
    const shipping = useSelector(selectShipping);
    const total = useSelector(selectTotal);
    const { couponCode, couponError } = useSelector((state) => state.cart);
    const [code, setCode] = useState(couponCode);

    const toFreeShipping = round2(FREE_SHIPPING_MIN - subtotal);

    return (
        <aside className="summary" aria-label="Order summary">
            <h2 className="summary__title">Order summary</h2>

            {showCoupon && (
                <form
                    className="coupon"
                    onSubmit={(event) => {
                        event.preventDefault();
                        dispatch(applyCoupon(code));
                    }}
                >
                    <label className="field__label" htmlFor="coupon">Coupon code</label>
                    <div className="coupon__row">
                        <input
                            id="coupon"
                            className={couponError ? "input input--error" : "input"}
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            placeholder="Enter code"
                            aria-invalid={couponError ? "true" : "false"}
                            aria-describedby="coupon-msg"
                        />
                        <button type="submit" className="btn btn--secondary btn--md">Apply</button>
                    </div>
                    <p id="coupon-msg" className={couponError ? "field__msg field__msg--error" : "field__msg field__msg--ok"}>
                        {couponError}
                        {!couponError && couponCode && (
                            <>
                                {couponCode} applied: {COUPONS[couponCode]}% off{" "}
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => {
                                        dispatch(removeCoupon());
                                        setCode("");
                                    }}
                                >
                                    Remove
                                </button>
                            </>
                        )}
                    </p>
                </form>
            )}

            <dl className="summary__rows">
                <div><dt>Subtotal ({count} {count === 1 ? "item" : "items"})</dt><dd>{formatPrice(subtotal)}</dd></div>
                {discount > 0 && (
                    <div className="summary__discount"><dt>Coupon ({couponCode})</dt><dd>−{formatPrice(discount)}</dd></div>
                )}
                <div>
                    <dt>Shipping</dt>
                    <dd className={shipping === 0 ? "free" : ""}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</dd>
                </div>
                <div className="summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
            </dl>

            {shipping > 0 && (
                <p className="summary__hint">Add {formatPrice(toFreeShipping)} more for free shipping.</p>
            )}

            {children}
            <p className="summary__note">Prices in USD. The cart is saved after refresh.</p>
        </aside>
    );
}

export default function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const count = useSelector(selectItemCount);
    const token = useSelector((state) => state.auth.token);

    if (items.length === 0) {
        return (
            <div className="container page">
                <EmptyState title="Your cart is empty" text="Books you add will wait for you here.">
                    <Link to="/" className="btn btn--primary btn--md">Browse books</Link>
                </EmptyState>
            </div>
        );
    }

    const checkout = () => {
        navigate(token ? "/checkout" : "/login", { state: { from: "/checkout" } });
    };

    return (
        <div className="container page">
            <div className="page-head">
                <h1 className="page-title">Shopping cart ({count} {count === 1 ? "item" : "items"})</h1>
                <Link to="/" className="link link--icon"><Icon name="left" size={16} /> Continue shopping</Link>
            </div>

            <div className="cart">
                <section className="cart__items" aria-label="Cart items">
                    <div className="cart__head">
                        <span>Product</span>
                        <button type="button" className="btn btn--ghost btn--sm" onClick={() => dispatch(clear())}>
                            Clear cart
                        </button>
                    </div>

                    {items.map((item) => (
                        <article className="cart-row" key={item.id}>
                            <Link to={`/product/${item.id}`} className="cart-row__cover" aria-label={item.title}>
                                <BookCover book={item} />
                            </Link>

                            <div className="cart-row__info">
                                <span className="caption">{item.category}</span>
                                <Link to={`/product/${item.id}`} className="cart-row__title">{item.title}</Link>
                                <span className="cart-row__author">{item.author}</span>
                                <span className="price">
                                    <span className="price__now">{formatPrice(item.unitPrice)}</span>
                                    {item.discountPercentage > 0 && <s className="price__old">{formatPrice(item.price)}</s>}
                                </span>
                            </div>

                            <div className="cart-row__qty">
                                <QuantityStepper
                                    value={item.quantity}
                                    min={1}
                                    max={maxQuantity(item.stock)}
                                    onDecrease={() => dispatch(decrease(item.id))}
                                    onIncrease={() => dispatch(increase(item.id))}
                                    label={`Quantity of ${item.title}`}
                                />
                                <button type="button" className="btn btn--danger btn--sm" onClick={() => dispatch(remove(item.id))}>
                                    Remove
                                </button>
                            </div>

                            <strong className="cart-row__total">{formatPrice(round2(item.unitPrice * item.quantity))}</strong>
                        </article>
                    ))}
                </section>

                <OrderSummary showCoupon>
                    <button type="button" className="btn btn--primary btn--lg btn--block" onClick={checkout}>
                        Proceed to checkout
                    </button>
                </OrderSummary>
            </div>
        </div>
    );
}
