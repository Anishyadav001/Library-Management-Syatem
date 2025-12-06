class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary:', error, errorInfo); }
  render() { if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">Reload</button></div>; return this.props.children; }
}

function BrowseBooksPage() {
  try {
    const [books, setBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    React.useEffect(() => {
      if (!AuthService.isStudent()) { window.location.href = 'index.html'; return; }
      loadBooks();
    }, []);

    const loadBooks = async () => {
      try {
        const result = await trickleListObjects('book', 1000, true);
        setBooks(result.items);
        setLoading(false);
      } catch (error) {
        showToast('Failed to load books', 'error');
        setLoading(false);
      }
    };

    const categories = ['All', ...new Set(books.map(b => b.objectData.Category))];
    const filteredBooks = books.filter(book => {
      const matchesSearch = book.objectData.Title?.toLowerCase().includes(searchTerm.toLowerCase()) || book.objectData.Author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.objectData.Category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

    return (
      <div className="min-h-screen">
        <ThemeToggle />
        <Toast />
        <StudentHeader currentPage="books" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Browse Books</h1>
          <div className="mb-6 space-y-4">
            <input type="text" placeholder="Search by title or author..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat ? 'gradient-bg text-white' : 'bg-[var(--secondary-color)] text-[var(--text-secondary)]'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <div key={book.objectId} className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
                <div className="mb-4">
                  <div className="w-full h-32 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center mb-4">
                    <div className="icon-book text-4xl text-[var(--primary-color)]"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{book.objectData.Title}</h3>
                  <p className="text-[var(--text-secondary)] mb-1">by {book.objectData.Author}</p>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{book.objectData.Category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${book.objectData.Available > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {book.objectData.Available > 0 ? `${book.objectData.Available} Available` : 'Not Available'}
                    </span>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">Total: {book.objectData.Quantity}</span>
                </div>
              </div>
            ))}
          </div>
          {filteredBooks.length === 0 && <p className="text-center text-[var(--text-secondary)] py-8">No books found</p>}
        </main>
      </div>
    );
  } catch (error) { console.error('BrowseBooksPage error:', error); return null; }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><BrowseBooksPage /></ErrorBoundary>);
