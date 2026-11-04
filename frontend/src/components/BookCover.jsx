// Book cover drawn with HTML + CSS from the book data (title, author, coverTheme).
// No picture files and no outside image service are used.
// view: "front" | "back" | "spine" | "inside"

export default function BookCover({ book, view = "front" }) {
    const theme = book.coverTheme || 1;

    return (
        <div
            className={`cover cover--t${theme} cover--${view}`}
            role="img"
            aria-label={`${book.title} by ${book.author}, ${view} view`}
        >
            {view === "front" && (
                <>
                    <span className="cover__brand">Bookhaven</span>
                    <span className="cover__title">{book.title}</span>
                    <span className="cover__rise" />
                    <span className="cover__author">{book.author}</span>
                </>
            )}

            {view === "back" && (
                <>
                    <span className="cover__blurb">{book.description}</span>
                    <span className="cover__meta">
                        {book.publisher ? book.publisher : "Bookhaven edition"}
                    </span>
                    <span className="cover__barcode" />
                </>
            )}

            {view === "spine" && (
                <span className="cover__spine">
                    <span className="cover__spine-title">{book.title}</span>
                    <span className="cover__spine-author">{book.author}</span>
                </span>
            )}

            {view === "inside" && (
                <>
                    <span className="cover__chapter">Chapter 1</span>
                    <span className="cover__lines" />
                    <span className="cover__folio">{book.pages ? "1 / " + book.pages : "1"}</span>
                </>
            )}
        </div>
    );
}
