class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary:', error, errorInfo); }
  render() { if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">Reload</button></div>; return this.props.children; }
}

function StudentDashboard() {
  try {
    const [myIssues, setMyIssues] = React.useState([]);
    const [allBooks, setAllBooks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const auth = AuthService.getAuth();
      if (!auth || auth.userType !== 'student') {
        window.location.href = 'index.html';
        return;
      }
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const auth = AuthService.getAuth();
        const [issues, books] = await Promise.all([
          trickleListObjects('issue', 1000, true),
          trickleListObjects('book', 1000, true)
        ]);
        const myIssuedBooks = issues.items.filter(i => i.objectData.StudentId === auth.studentId);
        setMyIssues(myIssuedBooks);
        setAllBooks(books.items);
        setLoading(false);
      } catch (error) {
        showToast('Failed to load data', 'error');
        setLoading(false);
      }
    };

    const calculateFine = (dueDate) => {
      const due = new Date(dueDate);
      const today = new Date();
      const diffTime = today - due;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays * 5 : 0;
    };

    const issuedBooks = myIssues.filter(i => i.objectData.Status === 'Issued');
    const returnedBooks = myIssues.filter(i => i.objectData.Status === 'Returned');

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

    return (
      <div className="min-h-screen">
        <ThemeToggle />
        <Toast />
        <StudentHeader currentPage="dashboard" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div><p className="text-[var(--text-secondary)] text-sm">Currently Issued</p><p className="text-3xl font-bold">{issuedBooks.length}</p></div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"><div className="icon-book-open text-2xl text-blue-600"></div></div>
              </div>
            </div>
            <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div><p className="text-[var(--text-secondary)] text-sm">Total Returned</p><p className="text-3xl font-bold">{returnedBooks.length}</p></div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"><div className="icon-book-check text-2xl text-green-600"></div></div>
              </div>
            </div>
            <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div><p className="text-[var(--text-secondary)] text-sm">Available Books</p><p className="text-3xl font-bold">{allBooks.reduce((sum, b) => sum + b.objectData.Available, 0)}</p></div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center"><div className="icon-library text-2xl text-purple-600"></div></div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">My Issued Books</h2>
            <div className="space-y-4">
              {issuedBooks.map(issue => {
                const fine = calculateFine(issue.objectData.DueDate);
                const isOverdue = fine > 0;
                return (
                  <div key={issue.objectId} className={`bg-[var(--card-bg)] rounded-xl p-6 shadow-lg ${isOverdue ? 'border-2 border-[var(--danger-color)]' : ''}`}>
                    <h3 className="text-xl font-bold">{issue.objectData.BookTitle}</h3>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span>Issue Date: {new Date(issue.objectData.IssueDate).toLocaleDateString()}</span>
                      <span>Due Date: {new Date(issue.objectData.DueDate).toLocaleDateString()}</span>
                    </div>
                    {isOverdue && <p className="text-[var(--danger-color)] font-semibold mt-2">Overdue! Fine: ₹{fine}</p>}
                  </div>
                );
              })}
              {issuedBooks.length === 0 && <p className="text-center text-[var(--text-secondary)] py-8">No books currently issued</p>}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Browse Books</h2>
            <div className="mb-4"><a href="browse-books.html" className="inline-block px-6 py-3 gradient-bg text-white rounded-lg">View All Books</a></div>
          </div>
        </main>
      </div>
    );
  } catch (error) { console.error('StudentDashboard error:', error); return null; }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><StudentDashboard /></ErrorBoundary>);