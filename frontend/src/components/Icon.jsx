// 20px icons, 2px stroke (design system rule). Colour comes from the text colour (currentColor).
const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
    cart: <><path d="M3 4h2.2l2.1 10.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L19.2 8H6" /><circle cx="9.5" cy="19" r="1.3" /><circle cx="16.5" cy="19" r="1.3" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c1.2-3.6 4-5 8-5s6.8 1.4 8 5" /></>,
    left: <path d="M14 6l-6 6 6 6" />,
    right: <path d="M10 6l6 6-6 6" />,
    x: <path d="M6 6l12 12M18 6L6 18" />,
    minus: <path d="M6 12h12" />,
    plus: <path d="M12 6v12M6 12h12" />,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></>,
    returns: <><path d="M4 12a8 8 0 1 0 2.5-5.8" /><path d="M4 4v4h4" /></>,
    shield: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.500-7-10V6z" />,
    heart: <path d="M12 20s-7.500-4.600-7.500-10.200A4.300 4.300 0 0 1 12 7.300a4.300 4.300 0 0 1 7.500 2.500C19.500 15.400 12 20 12 20z" />,
    book: <><path d="M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h10" /></>
};

export default function Icon({ name, size, filled }) {
    return (
        <svg
            className="icon"
            width={size || 20}
            height={size || 20}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    );
}
