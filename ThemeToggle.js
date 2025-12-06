function ThemeToggle() {
  try {
    const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');

    React.useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-40 p-3 bg-[var(--card-bg)] rounded-full shadow-lg hover:scale-110 transition-transform"
        data-name="theme-toggle"
        data-file="components/ThemeToggle.js"
      >
        <div className={`icon-${theme === 'light' ? 'moon' : 'sun'} text-xl text-[var(--primary-color)]`}></div>
      </button>
    );
  } catch (error) {
    console.error('ThemeToggle component error:', error);
    return null;
  }
}