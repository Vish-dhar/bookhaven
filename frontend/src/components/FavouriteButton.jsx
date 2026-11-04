import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "./Icon";
import { addFavourite, removeFavourite, selectIsFavourite } from "../store/favouritesSlice";

// Heart button. Round icon on book cards, text button on the detail page (withLabel).
export default function FavouriteButton({ book, withLabel }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const token = useSelector((state) => state.auth.token);
    const isFavourite = useSelector(selectIsFavourite(book._id));

    const handleClick = () => {
        // favourites belong to an account, so guests are sent to sign in first
        if (!token) {
            navigate("/login", { state: { from: location.pathname } });
            return;
        }

        dispatch(isFavourite ? removeFavourite(book._id) : addFavourite(book._id));
    };

    const label = isFavourite ? "Remove from favourites" : "Add to favourites";

    if (withLabel) {
        return (
            <button
                type="button"
                className={isFavourite ? "btn btn--secondary btn--lg fav-label is-active" : "btn btn--secondary btn--lg fav-label"}
                onClick={handleClick}
                aria-pressed={isFavourite}
            >
                <Icon name="heart" filled={isFavourite} />
                {isFavourite ? "Saved" : "Favourite"}
            </button>
        );
    }

    return (
        <button
            type="button"
            className={isFavourite ? "fav-btn is-active" : "fav-btn"}
            onClick={handleClick}
            aria-label={label}
            aria-pressed={isFavourite}
            title={label}
        >
            <Icon name="heart" filled={isFavourite} />
        </button>
    );
}
