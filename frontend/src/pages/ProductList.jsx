import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import Icon from "../components/Icon";
import { ErrorState, EmptyState, ProductSkeleton } from "../components/ui";
import { fetchBooks, fetchCategories, setFilters, clearFilters } from "../store/productsSlice";
import { COUPONS, FREE_SHIPPING_MIN, PAGE_SIZE, SORT_OPTIONS } from "../config/constants";

// Decoration for the hero: a shelf of book spines drawn with CSS (same cover colours as the books).
const shelf = [
    { theme: 1, height: 84, title: "Ponniyin Selvan" },
    { theme: 3, height: 70, title: "Atomic Habits" },
    { theme: 2, height: 92, title: "Sapiens" },
    { theme: 7, height: 76, title: "Clean Code" },
    { theme: 5, height: 88, title: "Wings of Fire" },
    { theme: 4, height: 68, title: "Thirukkural" },
    { theme: 6, height: 80, title: "Cosmos" }
];

function Hero() {
    const couponCode = Object.keys(COUPONS)[0];
    const percent = COUPONS[couponCode];

    const scrollToBooks = () => {
        const element = document.getElementById("books");
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="hero" aria-label="Offer">
            <div className="hero__text">
                <span className="hero__tag">This week only</span>
                <h1 className="hero__title">Your next favourite book is already on the shelf</h1>
                <p className="hero__copy">
                    Use code {couponCode} for {percent}% off your cart. Free shipping on orders of ${FREE_SHIPPING_MIN} or more.
                </p>
                <button type="button" className="btn btn--accent btn--lg" onClick={scrollToBooks}>
                    Shop deals
                </button>
            </div>

            <div className="hero__shelf" aria-hidden="true">
                {shelf.map((spine) => (
                    <span
                        key={spine.title}
                        className={`spine cover--t${spine.theme}`}
                        style={{ "--spine-height": spine.height + "%" }}
                    >
                        <span className="spine__title">{spine.title}</span>
                    </span>
                ))}
            </div>
        </section>
    );
}

function ActiveFilters() {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.products.filters);
    const chips = [];

    if (filters.search) {
        chips.push({ key: "search", label: `“${filters.search}”`, clear: { search: "" } });
    }
    if (filters.category) {
        chips.push({ key: "category", label: filters.category, clear: { category: "" } });
    }
    if (filters.minRating > 0) {
        chips.push({ key: "rating", label: `${filters.minRating} stars & up`, clear: { minRating: 0 } });
    }
    if (filters.minPrice !== "" || filters.maxPrice !== "") {
        const low = filters.minPrice !== "" ? "$" + filters.minPrice : "$0";
        const high = filters.maxPrice !== "" ? "$" + filters.maxPrice : "any";
        chips.push({ key: "price", label: `${low} to ${high}`, clear: { minPrice: "", maxPrice: "" } });
    }

    if (chips.length === 0) return null;

    return (
        <div className="active-filters" aria-label="Active filters">
            <span className="active-filters__label">Active:</span>
            {chips.map((chip) => (
                <button
                    key={chip.key}
                    type="button"
                    className="chip chip--active"
                    onClick={() => dispatch(setFilters(chip.clear))}
                    aria-label={`Remove filter ${chip.label}`}
                >
                    {chip.label}
                    <Icon name="x" size={16} />
                </button>
            ))}
        </div>
    );
}

export default function ProductList() {
    const dispatch = useDispatch();
    const { items, total, pages, status, error, filters, categories } = useSelector(
        (state) => state.products
    );
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch, filters]);

    const changePage = (page) => {
        dispatch(setFilters({ page }));
        const element = document.getElementById("books");
        if (element) element.scrollIntoView({ behavior: "smooth" });
    };

    const from = total === 0 ? 0 : (filters.page - 1) * PAGE_SIZE + 1;
    const to = Math.min(filters.page * PAGE_SIZE, total);

    return (
        <div className="container page">
            <Hero />

            {/* category chips for phones and tablets */}
            <div className="chips" role="tablist" aria-label="Categories">
                <button
                    type="button"
                    className={filters.category === "" ? "chip chip--selected" : "chip"}
                    onClick={() => dispatch(setFilters({ category: "" }))}
                >
                    All
                </button>
                {categories.map((item) => (
                    <button
                        type="button"
                        key={item.name}
                        className={filters.category === item.name ? "chip chip--selected" : "chip"}
                        onClick={() => dispatch(setFilters({ category: item.name }))}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            <div className="shop" id="books">
                <aside className="shop__sidebar" aria-label="Filters">
                    <FilterSidebar />
                </aside>

                <section className="shop__main">
                    <div className="shop__head">
                        <div>
                            <h2 className="shop__title">{filters.category || "All books"}</h2>
                            <p className="shop__count" aria-live="polite">
                                {status === "succeeded" && total > 0 && `Showing ${from}-${to} of ${total} books`}
                                {status === "succeeded" && total === 0 && "No books found"}
                                {status === "loading" && "Loading books…"}
                            </p>
                        </div>

                        <div className="shop__tools">
                            <button
                                type="button"
                                className="btn btn--secondary btn--sm shop__filter-btn"
                                onClick={() => setDrawerOpen(true)}
                            >
                                <Icon name="filter" size={16} /> Filters
                            </button>

                            <label className="sort">
                                <span className="sort__label">Sort by</span>
                                <select
                                    className="input input--sm"
                                    value={filters.sort}
                                    onChange={(event) => dispatch(setFilters({ sort: event.target.value }))}
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <ActiveFilters />

                    {status === "failed" ? (
                        <ErrorState
                            message={error || "Could not load books."}
                            onRetry={() => dispatch(fetchBooks())}
                        />
                    ) : status === "loading" || status === "idle" ? (
                        <div className="grid">
                            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                                <ProductSkeleton key={index} />
                            ))}
                        </div>
                    ) : items.length === 0 ? (
                        <EmptyState
                            title="No books match these filters"
                            text="Try a different category, price range or search word."
                        >
                            <button
                                type="button"
                                className="btn btn--secondary btn--md"
                                onClick={() => dispatch(clearFilters())}
                            >
                                Clear all filters
                            </button>
                        </EmptyState>
                    ) : (
                        <div className="grid">
                            {items.map((book) => (
                                <ProductCard key={book._id} book={book} />
                            ))}
                        </div>
                    )}

                    {status === "succeeded" && (
                        <Pagination page={filters.page} pages={pages} onChange={changePage} />
                    )}
                </section>
            </div>

            {drawerOpen && (
                <div className="drawer" role="dialog" aria-modal="true" aria-label="Filters">
                    <button
                        type="button"
                        className="drawer__overlay"
                        aria-label="Close filters"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="drawer__panel">
                        <button
                            type="button"
                            className="drawer__close"
                            aria-label="Close filters"
                            onClick={() => setDrawerOpen(false)}
                        >
                            <Icon name="x" />
                        </button>
                        <FilterSidebar onDone={() => setDrawerOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
