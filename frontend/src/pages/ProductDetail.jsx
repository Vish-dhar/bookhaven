import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BookCover from "../components/BookCover";
import Icon from "../components/Icon";
import FavouriteButton from "../components/FavouriteButton";
import { Rating, PriceBlock, DiscountBadge, StockBadge, QuantityStepper, ErrorState } from "../components/ui";
import { fetchBookById, fetchRelated } from "../store/productsSlice";
import { addItem, maxQuantity } from "../store/cartSlice";
import { showToast } from "../store/uiSlice";
import { formatPrice, getDiscountPrice, round2 } from "../utils/price";
import { FREE_SHIPPING_MIN } from "../config/constants";

const views = [
    { key: "front", label: "Front cover" },
    { key: "back", label: "Back cover" },
    { key: "spine", label: "Spine" },
    { key: "inside", label: "Inside page" }
];

function RelatedBook({ book }) {
    return (
        <Link to={`/product/${book._id}`} className="mini">
            <BookCover book={book} />
            <span className="mini__title">{book.title}</span>
            <span className="mini__price">{formatPrice(getDiscountPrice(book.price, book.discountPercentage))}</span>
        </Link>
    );
}

export default function ProductDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { item: book, status, error } = useSelector((state) => state.products.detail);
    const related = useSelector((state) => state.products.related);

    const [view, setView] = useState("front");
    const [quantity, setQuantity] = useState(1);
    const [tab, setTab] = useState("description");

    useEffect(() => {
        dispatch(fetchBookById(id));
        setView("front");
        setQuantity(1);
        setTab("description");
    }, [dispatch, id]);

    useEffect(() => {
        if (book) {
            dispatch(fetchRelated({ category: book.category, excludeId: book._id }));
        }
    }, [dispatch, book]);

    if (status === "failed") {
        return (
            <div className="container page">
                <ErrorState message={error} onRetry={() => dispatch(fetchBookById(id))} />
                <p className="center-text"><Link to="/" className="link">Back to all books</Link></p>
            </div>
        );
    }

    if (!book || status === "loading") {
        return (
            <div className="container page">
                <div className="detail detail--loading" aria-busy="true">
                    <div className="skeleton skeleton--gallery" />
                    <div>
                        <div className="skeleton skeleton--line" />
                        <div className="skeleton skeleton--line skeleton--short" />
                        <div className="skeleton skeleton--line" />
                        <div className="skeleton skeleton--line skeleton--btn" />
                    </div>
                </div>
            </div>
        );
    }

    const outOfStock = book.stock === 0;
    const finalPrice = getDiscountPrice(book.price, book.discountPercentage);
    const saving = round2(book.price - finalPrice);
    const maxQty = maxQuantity(book.stock);

    const handleAdd = () => {
        dispatch(addItem({ book, quantity }));
        dispatch(showToast({ message: "Added to cart", linkLabel: "View cart", linkTo: "/cart" }));
    };

    const handleBuyNow = () => {
        dispatch(addItem({ book, quantity }));
        navigate("/checkout");
    };

    return (
        <div className="container page">
            <nav className="breadcrumb" aria-label="Breadcrumb">
                <Link to="/">Home</Link>
                <span aria-hidden="true">/</span>
                <span>{book.category}</span>
                <span aria-hidden="true">/</span>
                <span className="breadcrumb__current">{book.title}</span>
            </nav>

            <div className="detail">
                <div className="gallery">
                    <div className="gallery__main">
                        <BookCover book={book} view={view} />
                        <span className="card__badges"><DiscountBadge percentage={book.discountPercentage} /></span>
                    </div>
                    <p className="gallery__caption">Image {views.findIndex((v) => v.key === view) + 1} of {views.length}</p>
                    <div className="gallery__thumbs">
                        {views.map((item) => (
                            <button
                                type="button"
                                key={item.key}
                                className={item.key === view ? "thumb is-active" : "thumb"}
                                onClick={() => setView(item.key)}
                                aria-label={item.label}
                                aria-pressed={item.key === view}
                            >
                                <BookCover book={book} view={item.key} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="detail__info">
                    <div className="detail__badges">
                        <span className="chip chip--static">{book.category}</span>
                        <StockBadge stock={book.stock} showCount />
                    </div>

                    <h1 className="detail__title">{book.title}</h1>
                    <p className="detail__author">by {book.author}</p>

                    <p className="detail__rating">
                        <Rating rating={book.rating} />
                        <span>{book.ratingCount} reviews</span>
                        {book.publisher && <span>· Publisher: {book.publisher}</span>}
                    </p>

                    <div className="detail__price">
                        <PriceBlock price={book.price} discountPercentage={book.discountPercentage} large />
                        {saving > 0 && (
                            <span className="saving">You save {formatPrice(saving)} ({book.discountPercentage}%)</span>
                        )}
                    </div>

                    <p className="detail__summary">{book.description}</p>

                    <div className="detail__qty">
                        <span className="detail__qty-label">Quantity</span>
                        <QuantityStepper
                            value={outOfStock ? 0 : quantity}
                            min={1}
                            max={maxQty}
                            onDecrease={() => setQuantity(quantity - 1)}
                            onIncrease={() => setQuantity(quantity + 1)}
                        />
                    </div>

                    <div className="detail__actions">
                        <button type="button" className="btn btn--primary btn--lg" onClick={handleAdd} disabled={outOfStock}>
                            {outOfStock ? "Out of stock" : "Add to cart"}
                        </button>
                        <button type="button" className="btn btn--secondary btn--lg" onClick={handleBuyNow} disabled={outOfStock}>
                            Buy now
                        </button>
                        <FavouriteButton book={book} withLabel />
                    </div>

                    <ul className="assurances">
                        <li>
                            <Icon name="truck" />
                            <span><strong>Free shipping</strong>On orders of ${FREE_SHIPPING_MIN} or more</span>
                        </li>
                        <li>
                            <Icon name="returns" />
                            <span><strong>{book.returnPolicy}</strong>Return if the book is not right</span>
                        </li>
                        <li>
                            <Icon name="shield" />
                            <span><strong>{book.guarantee}</strong>Straight from the publisher</span>
                        </li>
                    </ul>
                </div>
            </div>

            <section className="tabs" aria-label="Book information">
                <div className="tabs__list" role="tablist">
                    {[
                        { key: "description", label: "Description" },
                        { key: "specs", label: "Specifications" },
                        { key: "reviews", label: `Reviews (${book.ratingCount})` }
                    ].map((item) => (
                        <button
                            type="button"
                            role="tab"
                            key={item.key}
                            aria-selected={tab === item.key}
                            className={tab === item.key ? "tab is-active" : "tab"}
                            onClick={() => setTab(item.key)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="tabs__panel" role="tabpanel">
                    {tab === "description" && (
                        <>
                            <p className="prose">{book.description}</p>
                            {book.tags.length > 0 && (
                                <div className="tag-row">
                                    {book.tags.map((tag) => (
                                        <span className="chip chip--static" key={tag}>{tag}</span>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {tab === "specs" && (
                        <table className="specs">
                            <tbody>
                                <tr><th>Author</th><td>{book.author}</td></tr>
                                <tr><th>Category</th><td>{book.category}</td></tr>
                                {book.publisher && <tr><th>Publisher</th><td>{book.publisher}</td></tr>}
                                {book.publishedYear && <tr><th>First published</th><td>{book.publishedYear}</td></tr>}
                                {book.pages && <tr><th>Pages</th><td>{book.pages}</td></tr>}
                                <tr><th>Language</th><td>{book.language}</td></tr>
                                {book.sku && <tr><th>SKU</th><td>{book.sku}</td></tr>}
                            </tbody>
                        </table>
                    )}

                    {tab === "reviews" && (
                        <div className="reviews">
                            <p className="reviews__summary">
                                <Rating rating={book.rating} count={book.ratingCount} />
                                <span>Showing {book.reviews.length} recent reviews</span>
                            </p>
                            {book.reviews.length === 0 && <p className="prose">No reviews yet.</p>}
                            {book.reviews.map((review) => (
                                <article className="review" key={review._id}>
                                    <div className="review__head">
                                        <strong>{review.name}</strong>
                                        <Rating rating={review.rating} />
                                    </div>
                                    <p>{review.comment}</p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {related.items.length > 0 && (
                <section className="related" aria-label="You may also like">
                    <h2 className="section-title">You may also like</h2>
                    <div className="related__grid">
                        {related.items.map((item) => (
                            <RelatedBook key={item._id} book={item} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
