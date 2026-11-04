// Sample catalogue for the Bookhaven store.
// Titles and authors are real books; prices, stock, ratings and reviews are SAMPLE DATA for the project.
// finalPrice is added by seed.js (price x (1 - discountPercentage / 100)).

const books = [
    // ---------- Fiction ----------
    {
        title: "The Alchemist", author: "Paulo Coelho", category: "Fiction",
        description: "A shepherd boy follows a dream across the desert in search of treasure and learns that the journey matters more than the prize. A short, calm read that stays with you.",
        price: 12.99, discountPercentage: 10, stock: 40, rating: 4.6, ratingCount: 1284,
        publisher: "HarperOne", publishedYear: 1988, pages: 208, tags: ["classic", "journey", "inspiring"], coverTheme: 3, featured: true
    },
    {
        title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction",
        description: "Seen through the eyes of a young girl in a small Southern town, this novel deals with courage, justice and growing up. A story that every reader should meet once.",
        price: 14.5, discountPercentage: 0, stock: 22, rating: 4.8, ratingCount: 2210,
        publisher: "Grand Central", publishedYear: 1960, pages: 336, tags: ["classic", "justice", "school reading"], coverTheme: 5
    },
    {
        title: "1984", author: "George Orwell", category: "Fiction",
        description: "A chilling vision of a world watched by Big Brother, where even thought is controlled. Still one of the most talked about novels of the last century.",
        price: 11.99, discountPercentage: 15, stock: 35, rating: 4.7, ratingCount: 1930,
        publisher: "Penguin Classics", publishedYear: 1949, pages: 328, tags: ["dystopia", "classic", "politics"], coverTheme: 7, featured: true
    },
    {
        title: "The Hobbit", author: "J. R. R. Tolkien", category: "Fiction",
        description: "Bilbo Baggins leaves his comfortable hole in the ground and joins a band of dwarves on a dangerous quest. The warm-hearted adventure that began Middle-earth.",
        price: 15.99, discountPercentage: 12, stock: 18, rating: 4.8, ratingCount: 1675,
        publisher: "Houghton Mifflin", publishedYear: 1937, pages: 310, tags: ["fantasy", "adventure", "classic"], coverTheme: 2
    },
    {
        title: "Pride and Prejudice", author: "Jane Austen", category: "Fiction",
        description: "Elizabeth Bennet and Mr Darcy misjudge each other in a sharp, funny story about manners, money and marriage in Regency England.",
        price: 9.99, discountPercentage: 0, stock: 8, rating: 4.5, ratingCount: 1410,
        publisher: "Penguin Classics", publishedYear: 1813, pages: 432, tags: ["romance", "classic"], coverTheme: 4
    },
    {
        title: "Malgudi Days", author: "R. K. Narayan", category: "Fiction",
        description: "Gentle short stories set in the imaginary South Indian town of Malgudi, full of small joys, quiet humour and unforgettable ordinary people.",
        price: 10.5, discountPercentage: 5, stock: 26, rating: 4.7, ratingCount: 864,
        publisher: "Indian Thought Publications", publishedYear: 1943, pages: 256, tags: ["short stories", "india", "classic"], coverTheme: 6
    },

    // ---------- Self Help ----------
    {
        title: "Atomic Habits", author: "James Clear", category: "Self Help",
        description: "A practical system for building good habits and breaking bad ones through tiny changes that add up. Clear ideas, simple examples and steps you can start today.",
        price: 18.99, discountPercentage: 20, stock: 60, rating: 4.8, ratingCount: 3120,
        publisher: "Avery", publishedYear: 2018, pages: 320, tags: ["habits", "productivity", "bestseller"], coverTheme: 1, featured: true
    },
    {
        title: "Deep Work", author: "Cal Newport", category: "Self Help",
        description: "Why the ability to focus without distraction is becoming rare and valuable, and a set of rules to train it. Useful for students and professionals alike.",
        price: 16.5, discountPercentage: 10, stock: 14, rating: 4.5, ratingCount: 970,
        publisher: "Grand Central", publishedYear: 2016, pages: 304, tags: ["focus", "career", "productivity"], coverTheme: 8
    },
    {
        title: "Ikigai", author: "Héctor García and Francesc Miralles", category: "Self Help",
        description: "Lessons from long-living people of Okinawa on finding purpose, staying active and enjoying small daily rituals.",
        price: 13.25, discountPercentage: 8, stock: 5, rating: 4.2, ratingCount: 756,
        publisher: "Penguin Life", publishedYear: 2016, pages: 208, tags: ["purpose", "wellbeing", "japan"], coverTheme: 3
    },

    // ---------- Technology ----------
    {
        title: "Clean Code", author: "Robert C. Martin", category: "Technology",
        description: "A handbook on writing code that other people can read, change and trust. Covers naming, functions, comments and refactoring with real examples.",
        price: 39.99, discountPercentage: 15, stock: 20, rating: 4.7, ratingCount: 1105,
        publisher: "Prentice Hall", publishedYear: 2008, pages: 464, tags: ["programming", "software", "best practices"], coverTheme: 8, featured: true
    },
    {
        title: "Introduction to Algorithms", author: "Cormen, Leiserson, Rivest and Stein", category: "Technology",
        description: "The big reference on algorithms and data structures, used in universities everywhere. Heavy, thorough and worth keeping on your desk.",
        price: 89.99, discountPercentage: 10, stock: 7, rating: 4.6, ratingCount: 640,
        publisher: "MIT Press", publishedYear: 1990, pages: 1312, tags: ["algorithms", "computer science", "reference"], coverTheme: 7
    },
    {
        title: "The Pragmatic Programmer", author: "David Thomas and Andrew Hunt", category: "Technology",
        description: "Practical habits and tips for becoming a better developer, from debugging to automation to taking responsibility for your work.",
        price: 44.0, discountPercentage: 12, stock: 16, rating: 4.7, ratingCount: 890,
        publisher: "Addison-Wesley", publishedYear: 1999, pages: 352, tags: ["programming", "career", "craft"], coverTheme: 2
    },
    {
        title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Technology",
        description: "A friendly but deep introduction to JavaScript, programming and the web, with exercises in every chapter.",
        price: 29.99, discountPercentage: 0, stock: 0, rating: 4.4, ratingCount: 512,
        publisher: "No Starch Press", publishedYear: 2011, pages: 472, tags: ["javascript", "web", "beginner"], coverTheme: 6
    },

    // ---------- Biography ----------
    {
        title: "Wings of Fire", author: "A. P. J. Abdul Kalam", category: "Biography",
        description: "The life story of Dr A. P. J. Abdul Kalam, from a small town in Tamil Nadu to India's missile and space programmes. Honest, humble and motivating.",
        price: 8.99, discountPercentage: 0, stock: 55, rating: 4.9, ratingCount: 2780,
        publisher: "Universities Press", publishedYear: 1999, pages: 180, tags: ["india", "science", "inspiring"], coverTheme: 1, featured: true
    },
    {
        title: "The Story of My Experiments with Truth", author: "M. K. Gandhi", category: "Biography",
        description: "Mahatma Gandhi's own account of his early life, his ideas on truth and non-violence, and the experiments that shaped them.",
        price: 11.5, discountPercentage: 5, stock: 19, rating: 4.4, ratingCount: 603,
        publisher: "Navajivan", publishedYear: 1927, pages: 464, tags: ["autobiography", "india", "history"], coverTheme: 4
    },
    {
        title: "Long Walk to Freedom", author: "Nelson Mandela", category: "Biography",
        description: "Nelson Mandela's autobiography, from his village childhood to prison and then to the presidency of a free South Africa.",
        price: 17.99, discountPercentage: 10, stock: 12, rating: 4.7, ratingCount: 721,
        publisher: "Little, Brown", publishedYear: 1994, pages: 656, tags: ["autobiography", "freedom", "history"], coverTheme: 5
    },

    // ---------- Finance ----------
    {
        title: "The Psychology of Money", author: "Morgan Housel", category: "Finance",
        description: "Short stories showing that doing well with money has less to do with intelligence and more to do with behaviour. Easy to read, hard to forget.",
        price: 15.99, discountPercentage: 18, stock: 44, rating: 4.7, ratingCount: 2045,
        publisher: "Harriman House", publishedYear: 2020, pages: 256, tags: ["money", "investing", "behaviour"], coverTheme: 3, featured: true
    },
    {
        title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", category: "Finance",
        description: "A simple, much-debated introduction to thinking about assets, income and financial independence, told through two very different father figures.",
        price: 10.99, discountPercentage: 10, stock: 31, rating: 4.3, ratingCount: 1860,
        publisher: "Plata Publishing", publishedYear: 1997, pages: 336, tags: ["money", "mindset", "beginner"], coverTheme: 6
    },
    {
        title: "The Intelligent Investor", author: "Benjamin Graham", category: "Finance",
        description: "The classic guide to value investing, margin of safety and keeping emotions out of your portfolio. Dense, but patient readers are rewarded.",
        price: 24.99, discountPercentage: 12, stock: 9, rating: 4.6, ratingCount: 998,
        publisher: "Harper Business", publishedYear: 1949, pages: 640, tags: ["stock market", "investing", "classic"], coverTheme: 7
    },

    // ---------- Tamil Literature ----------
    {
        title: "Ponniyin Selvan (Complete)", author: "Kalki R. Krishnamurthy", category: "Tamil Literature",
        description: "The famous Tamil historical novel of the Chola empire, full of palace plots, spies, rivers and young heroes. The complete story in one collection.",
        price: 32.0, discountPercentage: 15, stock: 15, rating: 4.9, ratingCount: 1530,
        publisher: "Sandhya Publications", publishedYear: 1954, pages: 2400, language: "Tamil", tags: ["tamil", "history", "chola"], coverTheme: 2, featured: true
    },
    {
        title: "Sivagamiyin Sabadham", author: "Kalki R. Krishnamurthy", category: "Tamil Literature",
        description: "A Pallava-era historical romance of the sculptor Aayanar, the princess Sivagami and the great king Narasimhavarman.",
        price: 21.5, discountPercentage: 10, stock: 11, rating: 4.7, ratingCount: 702,
        publisher: "Sandhya Publications", publishedYear: 1946, pages: 1400, language: "Tamil", tags: ["tamil", "history", "pallava"], coverTheme: 4
    },
    {
        title: "Thirukkural", author: "Thiruvalluvar", category: "Tamil Literature",
        description: "1,330 two-line verses on virtue, wealth and love, among the most treasured works in the Tamil language. A book to read a couplet at a time.",
        price: 7.5, discountPercentage: 0, stock: 70, rating: 4.9, ratingCount: 1990,
        publisher: "Tamil Classics Press", publishedYear: 2005, pages: 320, language: "Tamil", tags: ["tamil", "ethics", "classic"], coverTheme: 5
    },

    // ---------- Science ----------
    {
        title: "A Brief History of Time", author: "Stephen Hawking", category: "Science",
        description: "From the Big Bang to black holes, Stephen Hawking explains the biggest questions about the universe in plain language.",
        price: 14.99, discountPercentage: 10, stock: 24, rating: 4.5, ratingCount: 1320,
        publisher: "Bantam", publishedYear: 1988, pages: 256, tags: ["physics", "universe", "classic"], coverTheme: 8
    },
    {
        title: "Cosmos", author: "Carl Sagan", category: "Science",
        description: "A beautiful tour of the universe and of how humans came to understand it, written with wonder and warmth.",
        price: 16.99, discountPercentage: 7, stock: 6, rating: 4.7, ratingCount: 845,
        publisher: "Ballantine", publishedYear: 1980, pages: 396, tags: ["astronomy", "science", "classic"], coverTheme: 7
    },

    // ---------- History ----------
    {
        title: "Sapiens", author: "Yuval Noah Harari", category: "History",
        description: "A big-picture history of humankind, from early hunters to the modern age, asking how stories, money and empires shaped us.",
        price: 19.99, discountPercentage: 15, stock: 33, rating: 4.6, ratingCount: 2415,
        publisher: "Harper", publishedYear: 2011, pages: 464, tags: ["history", "humans", "bestseller"], coverTheme: 5
    },

    // ---------- Children ----------
    {
        title: "The Little Prince", author: "Antoine de Saint-Exupéry", category: "Children",
        description: "A pilot stranded in the desert meets a small prince from another planet. A gentle story for children and for the grown-ups reading it to them.",
        price: 8.5, discountPercentage: 0, stock: 29, rating: 4.8, ratingCount: 1740,
        publisher: "Mariner Books", publishedYear: 1943, pages: 96, tags: ["classic", "illustrated", "friendship"], coverTheme: 3
    }
];

module.exports = books;
