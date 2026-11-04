import { BRAND } from "../config/constants";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__inner">
                <span>© {BRAND} · Online book store</span>
                <span>Book data: our own Bookhaven API (sample catalogue)</span>
            </div>
        </footer>
    );
}
