import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser, clearAuthError } from "../store/authSlice";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { token, status, error } = useSelector((state) => state.auth);

    const [mode, setMode] = useState("login");   // login | signup
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const from = (location.state && location.state.from) || "/";

    useEffect(() => {
        dispatch(clearAuthError());
    }, [mode, dispatch]);

    if (token) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const action = mode === "login"
            ? loginUser({ email, password })
            : signupUser({ name, email, password });

        const result = await dispatch(action);

        if (result.meta.requestStatus === "fulfilled") {
            navigate(from, { replace: true });
        }
    };

    const loading = status === "loading";

    return (
        <div className="container page">
            <div className="auth">
                <h1 className="auth__title">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
                <p className="auth__sub">
                    {mode === "login"
                        ? "Sign in to place orders and see your order history."
                        : "It takes a minute. You can check out right after."}
                </p>

                <div className="segmented" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "login"}
                        className={mode === "login" ? "segmented__btn is-active" : "segmented__btn"}
                        onClick={() => setMode("login")}
                    >
                        Sign in
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "signup"}
                        className={mode === "signup" ? "segmented__btn is-active" : "segmented__btn"}
                        onClick={() => setMode("signup")}
                    >
                        Create account
                    </button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <div className="field">
                            <label className="field__label" htmlFor="name">Full name</label>
                            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                        </div>
                    )}

                    <div className="field">
                        <label className="field__label" htmlFor="email">Email</label>
                        <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                        />
                        {mode === "signup" && <p className="field__msg">At least 6 characters.</p>}
                    </div>

                    {error && <p className="alert alert--error" role="alert">{error}</p>}

                    <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={loading}>
                        {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
