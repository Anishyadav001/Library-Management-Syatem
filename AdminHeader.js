function AdminHeader({ currentPage }) {
  try {
    const auth = AuthService.getAuth();
    const navItems = [
      { name: 'Dashboard', page: 'dashboard', icon: 'layout-dashboard', href: 'admin-dashboard.html' },
      { name: 'Books', page: 'books', icon: 'library', href: 'books.html' },
      { name: 'Issue Book', page: 'issue', icon: 'book-plus', href: 'issue-book.html' },
      { name: 'Returns', page: 'returns', icon: 'book-check', href: 'returns.html' },
      { name: 'Students', page: 'students', icon: 'users', href: 'students.html' }
    ];

    return (
      <header className="bg-[var(--card-bg)] border-b border-[var(--border-color)] sticky top-0 z-30" data-name="admin-header" data-file="components/AdminHeader.js">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="icon-library text-2xl text-[var(--primary-color)]"></div>
              <h1 className="text-xl font-bold">Library Admin</h1>
            </div>
            
            <nav className="hidden md:flex gap-1">
              {navItems.map(item => (
                <a
                  key={item.page}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    currentPage === item.page 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'text-[var(--text-secondary)] hover:bg-[var(--secondary-color)]'
                  }`}
                >
                  <div className={`icon-${item.icon} text-lg`}></div>
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text-secondary)]">{auth?.name}</span>
              <button onClick={AuthService.logout} className="p-2 text-[var(--danger-color)] hover:bg-red-50 rounded-lg">
                <div className="icon-log-out text-xl"></div>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('AdminHeader component error:', error);
    return null;
  }
}