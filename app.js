class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [userType, setUserType] = React.useState('admin');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        if (userType === 'admin') {
          if (email === 'admin@library.com' && password === 'admin123') {
            AuthService.setAuth({ userType: 'admin', email: 'admin@library.com', name: 'Admin' });
            showToast('Welcome Admin!', 'success');
            setTimeout(() => window.location.href = 'admin-dashboard.html', 1000);
          } else {
            showToast('Invalid admin credentials', 'error');
          }
        } else {
          const students = await trickleListObjects('student', 100, true);
          const student = students.items.find(s => 
            s.objectData.Email === email && s.objectData.Password === password
          );
          
          if (student) {
            AuthService.setAuth({ 
              userType: 'student', 
              email: student.objectData.Email, 
              name: student.objectData.Name,
              studentId: student.objectId
            });
            showToast(`Welcome ${student.objectData.Name}!`, 'success');
            setTimeout(() => window.location.href = 'student-dashboard.html', 1000);
          } else {
            showToast('Invalid student credentials', 'error');
          }
        }
      } catch (error) {
        showToast('Login failed. Please try again.', 'error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4" data-name="app" data-file="app.js">
        <ThemeToggle />
        <Toast />
        
        <div className="max-w-md w-full bg-[var(--card-bg)] rounded-2xl shadow-2xl overflow-hidden">
          <div className="gradient-bg p-8 text-white text-center">
            <div className="icon-library text-5xl mb-4"></div>
            <h1 className="text-3xl font-bold mb-2">Library System</h1>
            <p className="text-blue-100">Manage your library efficiently</p>
          </div>

          <div className="p-8">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setUserType('admin')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  userType === 'admin' 
                    ? 'gradient-bg text-white' 
                    : 'bg-[var(--secondary-color)] text-[var(--text-secondary)]'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setUserType('student')}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  userType === 'student' 
                    ? 'gradient-bg text-white' 
                    : 'bg-[var(--secondary-color)] text-[var(--text-secondary)]'
                }`}
              >
                Student
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  placeholder={userType === 'admin' ? 'admin@library.com' : 'student@demo.com'}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                  placeholder={userType === 'admin' ? 'admin123' : 'student123'}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 gradient-bg text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-[var(--secondary-color)] rounded-lg">
              <p className="text-xs text-[var(--text-secondary)] mb-2">Demo Credentials:</p>
              <p className="text-xs"><strong>Admin:</strong> admin@library.com / admin123</p>
              <p className="text-xs"><strong>Student:</strong> student@demo.com / student123</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
