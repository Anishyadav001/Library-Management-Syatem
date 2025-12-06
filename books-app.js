class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary:', error, errorInfo); }
  render() { if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">Reload</button></div>; return this.props.children; }
}

function BooksPage() {
  try {
    const [books, setBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [editBook, setEditBook] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
      if (!AuthService.isAdmin()) { window.location.href = 'index.html'; return; }
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

    const handleDelete = async (bookId) => {
      if (!confirm('Are you sure you want to delete this book?')) return;
      try {
        await trickleDeleteObject('book', bookId);
        showToast('Book deleted successfully', 'success');
        loadBooks();
      } catch (error) {
        showToast('Failed to delete book', 'error');
      }
    };

    const filteredBooks = books.filter(book => 
      book.objectData.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.objectData.Author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

    return (
      <div className="min-h-screen">
        <ThemeToggle />
        <Toast />
        <AdminHeader currentPage="books" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Books</h1>
            <button onClick={() => { setEditBook(null); setShowModal(true); }} className="px-6 py-3 gradient-bg text-white rounded-lg flex items-center gap-2">
              <div className="icon-plus text-xl"></div>Add Book
            </button>
          </div>
          <div className="mb-6">
            <input type="text" placeholder="Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <div key={book.objectId} className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-2">{book.objectData.Title}</h3>
                <p className="text-[var(--text-secondary)] mb-1">by {book.objectData.Author}</p>
                <p className="text-sm text-[var(--text-secondary)] mb-3">{book.objectData.Category}</p>
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Qty: {book.objectData.Quantity}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Available: {book.objectData.Available}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditBook(book); setShowModal(true); }} className="flex-1 py-2 bg-[var(--primary-color)] text-white rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(book.objectId)} className="flex-1 py-2 bg-[var(--danger-color)] text-white rounded-lg">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </main>
        {showModal && <BookModal book={editBook} onClose={() => setShowModal(false)} onSave={() => { loadBooks(); setShowModal(false); }} />}
      </div>
    );
  } catch (error) { console.error('BooksPage error:', error); return null; }
}

function BookModal({ book, onClose, onSave }) {
  const [formData, setFormData] = React.useState({ Title: book?.objectData.Title || '', Author: book?.objectData.Author || '', Category: book?.objectData.Category || 'Fiction', ISBN: book?.objectData.ISBN || '', Quantity: book?.objectData.Quantity || 1, Available: book?.objectData.Available || 1 });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (book) {
        await trickleUpdateObject('book', book.objectId, formData);
        showToast('Book updated successfully', 'success');
      } else {
        await trickleCreateObject('book', formData);
        showToast('Book added successfully', 'success');
      }
      onSave();
    } catch (error) {
      showToast('Operation failed', 'error');
      setLoading(false);
    }
  };

  return <Modal title={book ? 'Edit Book' : 'Add New Book'} onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><input type="text" placeholder="Title" value={formData.Title} onChange={(e) => setFormData({...formData, Title: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required /><input type="text" placeholder="Author" value={formData.Author} onChange={(e) => setFormData({...formData, Author: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required /><select value={formData.Category} onChange={(e) => setFormData({...formData, Category: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]">{['Fiction','Non-Fiction','Science','Technology','History','Biography','Literature','Education','Reference'].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select><input type="text" placeholder="ISBN" value={formData.ISBN} onChange={(e) => setFormData({...formData, ISBN: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required /><input type="number" placeholder="Quantity" value={formData.Quantity} onChange={(e) => setFormData({...formData, Quantity: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" min="1" required /><input type="number" placeholder="Available" value={formData.Available} onChange={(e) => setFormData({...formData, Available: parseInt(e.target.value)})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" min="0" required /><button type="submit" disabled={loading} className="w-full py-3 gradient-bg text-white rounded-lg">{loading ? 'Saving...' : 'Save Book'}</button></form></Modal>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><BooksPage /></ErrorBoundary>);