import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BookCover from "./BookCover";
import FavouriteButton from "./FavouriteButton";
import { Rating, PriceBlock, DiscountBadge, QuantityStepper } from "./ui";
import { addItem, increase, decrease, selectQuantityById, maxQuantity } from "../store/cartSlice";
import { showToast } from "../store/uiSlice";
import { LOW_STOCK_LIMIT } from "../config/constants";

export default function ProductCard({ book }) {
    const dispatch = useDispatch();
    const inCart = useSelector(selectQuantityById(book._id));
    const outOfStock = book.stock === 0;

    const handleAdd = () => {
        dispatch(addItem({ book, quantity: 1 }));
        dispatch(showToast({ message: "Added to cart", linkLabel: "View cart", linkTo: "/cart" }));
    };

    return (
        <article className={inCart > 0 ? "card card--product card--in-cart" : "card card--product"}>
            <FavouriteButton book={book} />

            <Link to={`/product/${book._id}`} className="card__media" aria-label={book.title}>
                <BookCover book={book} />
                <span className="card__badges">
                    <DiscountBadge percentage={book.discountPercentage} />
                </span>
            </Link>

            <div className="card__body">
                <span className="caption">{book.category}</span>
                <Link to={`/product/${book._id}`} className="card__title">{book.title}</Link>
                <span className="card__author">{book.author}</span>

                <div className="card__meta">
                    <Rating rating={book.rating} count={book.ratingCount} />
                </div>

                <div className="card__price-row">
                    <PriceBlock price={book.price} discountPercentage={book.discountPercentage} />
                    {!outOfStock && book.stock < LOW_STOCK_LIMIT && (
                        <span className="low-stock">Only {book.stock} left</span>
                    )}
                </div>

                <div className="card__action">
                    {inCart > 0 ? (
                        <div className="card__in-cart">
                            <QuantityStepper
                                value={inCart}
                                max={maxQuantity(book.stock)}
                                onDecrease={() => dispatch(decrease(book._id))}
                                onIncrease={() => dispatch(increase(book._id))}
                                label={`Quantity of ${book.title}`}
                            />
                            <span className="card__in-cart-text">{inCart} in cart</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="btn btn--primary btn--md btn--block"
                            onClick={handleAdd}
                            disabled={outOfStock}
                        >
                            {outOfStock ? "Out of stock" : "Add to cart"}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
