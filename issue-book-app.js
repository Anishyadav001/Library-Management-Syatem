class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary:', error, errorInfo); }
  render() { if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">Reload</button></div>; return this.props.children; }
}

function IssueBookPage() {
  try {
    const [books, setBooks] = React.useState([]);
    const [students, setStudents] = React.useState([]);
    const [selectedBook, setSelectedBook] = React.useState('');
    const [selectedStudent, setSelectedStudent] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      if (!AuthService.isAdmin()) { window.location.href = 'index.html'; return; }
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [booksData, studentsData] = await Promise.all([
          trickleListObjects('book', 1000, true),
          trickleListObjects('student', 1000, true)
        ]);
        setBooks(booksData.items.filter(b => b.objectData.Available > 0));
        setStudents(studentsData.items);
      } catch (error) {
        showToast('Failed to load data', 'error');
      }
    };

    const handleIssue = async (e) => {
      e.preventDefault();
      if (!selectedBook || !selectedStudent) return;
      
      setLoading(true);
      try {
        const book = books.find(b => b.objectId === selectedBook);
        const student = students.find(s => s.objectId === selectedStudent);
        
        const issueDate = new Date().toISOString();
        const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        await trickleCreateObject('issue', {
          BookId: book.objectId,
          StudentId: student.objectId,
          BookTitle: book.objectData.Title,
          StudentName: student.objectData.Name,
          IssueDate: issueDate,
          DueDate: dueDate,
          ReturnDate: '',
          Fine: 0,
          Status: 'Issued'
        });
        
        await trickleUpdateObject('book', book.objectId, {
          ...book.objectData,
          Available: book.objectData.Available - 1
        });
        
        showToast('Book issued successfully', 'success');
        setSelectedBook('');
        setSelectedStudent('');
        loadData();
      } catch (error) {
        showToast('Failed to issue book', 'error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen">
        <ThemeToggle />
        <Toast />
        <AdminHeader currentPage="issue" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Issue Book</h1>
          <div className="bg-[var(--card-bg)] rounded-xl p-8 shadow-lg">
            <form onSubmit={handleIssue} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Book</label>
                <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required>
                  <option value="">Choose a book...</option>
                  {books.map(book => (
                    <option key={book.objectId} value={book.objectId}>
                      {book.objectData.Title} by {book.objectData.Author} (Available: {book.objectData.Available})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select Student</label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required>
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student.objectId} value={student.objectId}>
                      {student.objectData.Name} ({student.objectData.RollNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-[var(--secondary-color)] p-4 rounded-lg">
                <p className="text-sm"><strong>Due Date:</strong> 7 days from issue date</p>
                <p className="text-sm"><strong>Fine:</strong> ₹5 per day for late returns</p>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 gradient-bg text-white rounded-lg font-semibold">
                {loading ? 'Issuing...' : 'Issue Book'}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  } catch (error) { console.error('IssueBookPage error:', error); return null; }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><IssueBookPage /></ErrorBoundary>);