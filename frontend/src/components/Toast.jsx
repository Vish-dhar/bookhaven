import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../store/uiSlice";
import Icon from "./Icon";

export default function Toast() {
    const dispatch = useDispatch();
    const toast = useSelector((state) => state.ui.toast);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => dispatch(hideToast()), 3500);
        return () => clearTimeout(timer);
    }, [toast, dispatch]);

    if (!toast) return null;

    return (
        <div className="toast" role="status">
            <span className="toast__icon"><Icon name="check" /></span>
            <span className="toast__message">{toast.message}</span>
            {toast.linkTo && (
                <Link to={toast.linkTo} className="toast__link" onClick={() => dispatch(hideToast())}>
                    {toast.linkLabel}
                </Link>
            )}
        </div>
    );
}
