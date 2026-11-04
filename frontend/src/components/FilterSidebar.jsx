import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, clearFilters } from "../store/productsSlice";
import { RATING_OPTIONS } from "../config/constants";

// Category, price range and customer rating. Nothing changes until "Apply filters" is pressed.
export default function FilterSidebar({ onDone }) {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.products.filters);
    const categories = useSelector((state) => state.products.categories);

    const [category, setCategory] = useState(filters.category);
    const [minPrice, setMinPrice] = useState(filters.minPrice);
    const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
    const [minRating, setMinRating] = useState(filters.minRating);

    // keep the form in step when a filter is removed from outside (chips, clear all)
    useEffect(() => {
        setCategory(filters.category);
        setMinPrice(filters.minPrice);
        setMaxPrice(filters.maxPrice);
        setMinRating(filters.minRating);
    }, [filters.category, filters.minPrice, filters.maxPrice, filters.minRating]);

    const apply = (event) => {
        event.preventDefault();
        dispatch(setFilters({ category, minPrice, maxPrice, minRating }));
        if (onDone) onDone();
    };

    const clearAll = () => {
        dispatch(clearFilters());
        if (onDone) onDone();
    };

    return (
        <form className="filters" onSubmit={apply}>
            <div className="filters__head">
                <h2 className="filters__title">Filters</h2>
                <button type="button" className="link-button" onClick={clearAll}>Clear all</button>
            </div>

            <fieldset className="filters__group">
                <legend className="filters__label">Category</legend>
                <label className="choice">
                    <input
                        type="radio"
                        name="category"
                        checked={category === ""}
                        onChange={() => setCategory("")}
                    />
                    <span>All books</span>
                </label>
                {categories.map((item) => (
                    <label className="choice" key={item.name}>
                        <input
                            type="radio"
                            name="category"
                            checked={category === item.name}
                            onChange={() => setCategory(item.name)}
                        />
                        <span>{item.name}</span>
                        <span className="choice__count">{item.count}</span>
                    </label>
                ))}
            </fieldset>

            <fieldset className="filters__group">
                <legend className="filters__label">Price</legend>
                <div className="price-range">
                    <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        className="input input--sm"
                        placeholder="Min"
                        aria-label="Minimum price"
                        value={minPrice}
                        onChange={(event) => setMinPrice(event.target.value)}
                    />
                    <span className="price-range__to">to</span>
                    <input
                        type="number"
                        min="0"
                        inputMode="decimal"
                        className="input input--sm"
                        placeholder="Max"
                        aria-label="Maximum price"
                        value={maxPrice}
                        onChange={(event) => setMaxPrice(event.target.value)}
                    />
                </div>
            </fieldset>

            <fieldset className="filters__group">
                <legend className="filters__label">Customer rating</legend>
                {RATING_OPTIONS.map((option) => (
                    <label className="choice" key={option.value}>
                        <input
                            type="radio"
                            name="rating"
                            checked={minRating === option.value}
                            onChange={() => setMinRating(option.value)}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
            </fieldset>

            <button type="submit" className="btn btn--primary btn--md btn--block">
                Apply filters
            </button>
        </form>
    );
}
