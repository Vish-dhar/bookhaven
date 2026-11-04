import Icon from "./Icon";

// ‹ 1 2 3 ›
export default function Pagination({ page, pages, onChange }) {
    if (pages <= 1) return null;

    const numbers = [];
    for (let number = 1; number <= pages; number++) {
        // up to 7 pages: show every number; more pages: first, last and the ones around the current page
        if (pages <= 7 || number === 1 || number === pages || Math.abs(number - page) <= 1) {
            numbers.push(number);
        } else if (numbers[numbers.length - 1] !== "gap") {
            numbers.push("gap");
        }
    }

    return (
        <nav className="pagination" aria-label="Pages">
            <button
                type="button"
                className="pagination__btn"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
            >
                <Icon name="left" />
            </button>

            {numbers.map((number, index) =>
                number === "gap" ? (
                    <span key={"gap" + index} className="pagination__gap">…</span>
                ) : (
                    <button
                        type="button"
                        key={number}
                        className={number === page ? "pagination__btn is-active" : "pagination__btn"}
                        onClick={() => onChange(number)}
                        aria-current={number === page ? "page" : undefined}
                    >
                        {number}
                    </button>
                )
            )}

            <button
                type="button"
                className="pagination__btn"
                onClick={() => onChange(page + 1)}
                disabled={page >= pages}
                aria-label="Next page"
            >
                <Icon name="right" />
            </button>
        </nav>
    );
}
