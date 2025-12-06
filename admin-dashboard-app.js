class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return <div className="min-h-screen flex items-center justify-center"><button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">Reload</button></div>;
    }
    return this.props.children;
  }
}

function AdminDashboard() {
  try {
    const [stats, setStats] = React.useState({ totalBooks: 0, issuedBooks: 0, returnedBooks: 0, totalStudents: 0 });
    const [categoryData, setCategoryData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      const auth = AuthService.getAuth();
      if (!auth || auth.userType !== 'admin') {
        window.location.href = 'index.html';
        return;
      }
      loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
      try {
        const [books, issues, students] = await Promise.all([
          trickleListObjects('book', 1000, true),
          trickleListObjects('issue', 1000, true),
          trickleListObjects('student', 1000, true)
        ]);

        const totalBooks = books.items.reduce((sum, book) => sum + (book.objectData.Quantity || 0), 0);
        const issuedBooks = issues.items.filter(i => i.objectData.Status === 'Issued').length;
        const returnedBooks = issues.items.filter(i => i.objectData.Status === 'Returned').length;

        setStats({ totalBooks, issuedBooks, returnedBooks, totalStudents: students.items.length });

        const categoryCount = {};
        books.items.forEach(book => {
          const cat = book.objectData.Category || 'Other';
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        setCategoryData(Object.entries(categoryCount).map(([name, count]) => ({ name, count })));
        setLoading(false);
      } catch (error) {
        showToast('Failed to load dashboard data', 'error');
        setLoading(false);
      }
    };

    if (loading) {
      return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;
    }

    return (
      <div className="min-h-screen" data-name="admin-dashboard" data-file="admin-dashboard-app.js">
        <ThemeToggle />
        <Toast />
        <AdminHeader currentPage="dashboard" />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard icon="library" title="Total Books" value={stats.totalBooks} color="blue" />
            <StatsCard icon="book-open" title="Issued Books" value={stats.issuedBooks} color="orange" />
            <StatsCard icon="book-check" title="Returned Books" value={stats.returnedBooks} color="green" />
            <StatsCard icon="users" title="Students" value={stats.totalStudents} color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Books by Category</h2>
              <CategoryChart data={categoryData} />
            </div>
            
            <div className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a href="books.html" className="block p-4 bg-[var(--secondary-color)] rounded-lg hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="icon-library text-2xl text-[var(--primary-color)]"></div>
                    <div><div className="font-semibold">Manage Books</div><div className="text-sm text-[var(--text-secondary)]">Add, edit, or delete books</div></div>
                  </div>
                </a>
                <a href="issue-book.html" className="block p-4 bg-[var(--secondary-color)] rounded-lg hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="icon-book-plus text-2xl text-[var(--primary-color)]"></div>
                    <div><div className="font-semibold">Issue Book</div><div className="text-sm text-[var(--text-secondary)]">Issue books to students</div></div>
                  </div>
                </a>
                <a href="students.html" className="block p-4 bg-[var(--secondary-color)] rounded-lg hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="icon-users text-2xl text-[var(--primary-color)]"></div>
                    <div><div className="font-semibold">Manage Students</div><div className="text-sm text-[var(--text-secondary)]">View and manage students</div></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('AdminDashboard error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><AdminDashboard /></ErrorBoundary>);