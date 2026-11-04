import Icon from "./Icon";
import { formatPrice, getDiscountPrice } from "../utils/price";
import { LOW_STOCK_LIMIT } from "../config/constants";

// 4.5 (128)
export function Rating({ rating, count }) {
    return (
        <span className="rating" title={`${rating} out of 5`}>
            <span className="rating__star" aria-hidden="true">★</span>
            <span className="rating__value">{Number(rating).toFixed(1)}</span>
            {count !== undefined && <span className="rating__count">({count})</span>}
        </span>
    );
}

// $79.99  $99.99 (old price struck through)
export function PriceBlock({ price, discountPercentage, large }) {
    const finalPrice = getDiscountPrice(price, discountPercentage);

    return (
        <span className={large ? "price price--lg" : "price"}>
            <span className="price__now">{formatPrice(finalPrice)}</span>
            {discountPercentage > 0 && (
                <s className="price__old">{formatPrice(price)}</s>
            )}
        </span>
    );
}

export function DiscountBadge({ percentage }) {
    if (!percentage) return null;
    return <span className="badge badge--sale">-{percentage}%</span>;
}

// stock text: In stock / Only N left / Out of stock
export function StockBadge({ stock, showCount }) {
    if (stock === 0) {
        return <span className="badge badge--danger">Out of stock</span>;
    }
    if (stock < LOW_STOCK_LIMIT) {
        return <span className="badge badge--warning">Only {stock} left</span>;
    }
    return (
        <span className="badge badge--success">
            In stock{showCount ? ` · ${stock}` : ""}
        </span>
    );
}

// −  1  +
export function QuantityStepper({ value, onDecrease, onIncrease, min = 0, max = 99, label }) {
    return (
        <div className="stepper" role="group" aria-label={label || "Quantity"}>
            <button
                type="button"
                className="stepper__btn"
                onClick={onDecrease}
                disabled={value <= min}
                aria-label="Decrease quantity"
            >
                <Icon name="minus" />
            </button>
            <span className="stepper__value">{value}</span>
            <button
                type="button"
                className="stepper__btn"
                onClick={onIncrease}
                disabled={value >= max}
                aria-label="Increase quantity"
            >
                <Icon name="plus" />
            </button>
        </div>
    );
}

// "Could not load books."  [Retry]
export function ErrorState({ message, onRetry }) {
    return (
        <div className="state state--error" role="alert">
            <p className="state__title">{message}</p>
            {onRetry && (
                <button type="button" className="btn btn--secondary btn--md" onClick={onRetry}>
                    Retry
                </button>
            )}
        </div>
    );
}

export function EmptyState({ title, text, children }) {
    return (
        <div className="state">
            <span className="state__icon"><Icon name="book" size={32} /></span>
            <p className="state__title">{title}</p>
            {text && <p className="state__text">{text}</p>}
            {children}
        </div>
    );
}

export function ProductSkeleton() {
    return (
        <div className="card card--skeleton" aria-hidden="true">
            <div className="skeleton skeleton--cover" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line skeleton--btn" />
        </div>
    );
}
