import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "./Icon";
import { selectItemCount } from "../store/cartSlice";
import { setFilters } from "../store/productsSlice";
import { logout } from "../store/authSlice";
import { BRAND } from "../config/constants";

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const count = useSelector(selectItemCount);
    const user = useSelector((state) => state.auth.user);
    const currentSearch = useSelector((state) => state.products.filters.search);
    const [text, setText] = useState(currentSearch);

    const handleSearch = (event) => {
        event.preventDefault();
        dispatch(setFilters({ search: text.trim() }));
        navigate("/");
    };

    return (
        <header className="header">
            <div className="container header__inner">
                <Link to="/" className="logo" aria-label={`${BRAND} home`}>
                    <span className="logo__mark" aria-hidden="true" />
                    <span className="logo__text">{BRAND}</span>
                </Link>

                <form className="header__search" onSubmit={handleSearch} role="search">
                    <Icon name="search" />
                    <input
                        type="search"
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        placeholder="Search for books, authors and more"
                        aria-label="Search books"
                    />
                </form>

                <nav className="header__nav" aria-label="Main">
                    <NavLink to="/" end className="nav-link nav-link--hide-mobile">Books</NavLink>

                    {user ? (
                        <>
                            <NavLink to="/orders" className="nav-link nav-link--hide-mobile">Orders</NavLink>
                            <NavLink to="/favourites" className="nav-link nav-link--icon" aria-label="Favourites">
                                <Icon name="heart" />
                                <span className="cart-link__text">Favourites</span>
                            </NavLink>
                            <button
                                type="button"
                                className="nav-link nav-link--button"
                                onClick={() => dispatch(logout())}
                                title={user.email}
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" className="nav-link">Sign in</NavLink>
                    )}

                    <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
                        <Icon name="cart" />
                        <span className="cart-link__text">Cart</span>
                        <span className="count-badge">{count}</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
