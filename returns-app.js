class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary:', error, errorInfo); }
  render() { if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">Reload</button></div>; return this.props.children; }
}

function ReturnsPage() {
  try {
    const [issues, setIssues] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      if (!AuthService.isAdmin()) { window.location.href = 'index.html'; return; }
      loadIssues();
    }, []);

    const loadIssues = async () => {
      try {
        const result = await trickleListObjects('issue', 1000, true);
        setIssues(result.items);
        setLoading(false);
      } catch (error) {
        showToast('Failed to load issues', 'error');
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

    const handleReturn = async (issue) => {
      try {
        const fine = calculateFine(issue.objectData.DueDate);
        const returnDate = new Date().toISOString();
        
        await trickleUpdateObject('issue', issue.objectId, {
          ...issue.objectData,
          Status: 'Returned',
          ReturnDate: returnDate,
          Fine: fine
        });
        
        const book = await trickleGetObject('book', issue.objectData.BookId);
        await trickleUpdateObject('book', book.objectId, {
          ...book.objectData,
          Available: book.objectData.Available + 1
        });
        
        showToast(fine > 0 ? `Book returned. Fine: ₹${fine}` : 'Book returned successfully', 'success');
        loadIssues();
      } catch (error) {
        showToast('Failed to process return', 'error');
      }
    };

    const issuedBooks = issues.filter(i => i.objectData.Status === 'Issued');
    const returnedBooks = issues.filter(i => i.objectData.Status === 'Returned');

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

    return (
      <div className="min-h-screen">
        <ThemeToggle />
        <Toast />
        <AdminHeader currentPage="returns" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Book Returns</h1>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Issued Books</h2>
            <div className="space-y-4">
              {issuedBooks.map(issue => {
                const fine = calculateFine(issue.objectData.DueDate);
                const isOverdue = fine > 0;
                return (
                  <div key={issue.objectId} className={`bg-[var(--card-bg)] rounded-xl p-6 shadow-lg ${isOverdue ? 'border-2 border-[var(--danger-color)]' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{issue.objectData.BookTitle}</h3>
                        <p className="text-[var(--text-secondary)]">Student: {issue.objectData.StudentName}</p>
                        <div className="mt-2 flex gap-4 text-sm">
                          <span>Issue: {new Date(issue.objectData.IssueDate).toLocaleDateString()}</span>
                          <span>Due: {new Date(issue.objectData.DueDate).toLocaleDateString()}</span>
                        </div>
                        {isOverdue && <p className="text-[var(--danger-color)] font-semibold mt-2">Fine: ₹{fine}</p>}
                      </div>
                      <button onClick={() => handleReturn(issue)} className="px-6 py-2 gradient-bg text-white rounded-lg">Return</button>
                    </div>
                  </div>
                );
              })}
              {issuedBooks.length === 0 && <p className="text-center text-[var(--text-secondary)]">No books currently issued</p>}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Returned Books History</h2>
            <div className="space-y-4">
              {returnedBooks.map(issue => (
                <div key={issue.objectId} className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold">{issue.objectData.BookTitle}</h3>
                  <p className="text-[var(--text-secondary)]">Student: {issue.objectData.StudentName}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span>Issued: {new Date(issue.objectData.IssueDate).toLocaleDateString()}</span>
                    <span>Returned: {new Date(issue.objectData.ReturnDate).toLocaleDateString()}</span>
                  </div>
                  {issue.objectData.Fine > 0 && <p className="text-[var(--danger-color)] font-semibold mt-2">Fine Paid: ₹{issue.objectData.Fine}</p>}
                </div>
              ))}
              {returnedBooks.length === 0 && <p className="text-center text-[var(--text-secondary)]">No return history yet</p>}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) { console.error('ReturnsPage error:', error); return null; }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><ReturnsPage /></ErrorBoundary>);
