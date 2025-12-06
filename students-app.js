class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary:', error, errorInfo); }
  render() { if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center"><button onClick={() => window.location.reload()} className="px-6 py-2 gradient-bg text-white rounded-lg">Reload</button></div>; return this.props.children; }
}

function StudentsPage() {
  try {
    const [students, setStudents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [editStudent, setEditStudent] = React.useState(null);

    React.useEffect(() => {
      if (!AuthService.isAdmin()) { window.location.href = 'index.html'; return; }
      loadStudents();
    }, []);

    const loadStudents = async () => {
      try {
        const result = await trickleListObjects('student', 1000, true);
        setStudents(result.items);
        setLoading(false);
      } catch (error) {
        showToast('Failed to load students', 'error');
        setLoading(false);
      }
    };

    const handleDelete = async (studentId) => {
      if (!confirm('Are you sure you want to delete this student?')) return;
      try {
        await trickleDeleteObject('student', studentId);
        showToast('Student deleted successfully', 'success');
        loadStudents();
      } catch (error) {
        showToast('Failed to delete student', 'error');
      }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading...</div></div>;

    return (
      <div className="min-h-screen">
        <ThemeToggle />
        <Toast />
        <AdminHeader currentPage="students" />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Students</h1>
            <button onClick={() => { setEditStudent(null); setShowModal(true); }} className="px-6 py-3 gradient-bg text-white rounded-lg flex items-center gap-2">
              <div className="icon-user-plus text-xl"></div>Add Student
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(student => (
              <div key={student.objectId} className="bg-[var(--card-bg)] rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--secondary-color)] flex items-center justify-center">
                    <div className="icon-user text-3xl text-[var(--primary-color)]"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{student.objectData.Name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{student.objectData.RollNumber}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm"><strong>Email:</strong> {student.objectData.Email}</p>
                  <p className="text-sm"><strong>Department:</strong> {student.objectData.Department}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditStudent(student); setShowModal(true); }} className="flex-1 py-2 bg-[var(--primary-color)] text-white rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(student.objectId)} className="flex-1 py-2 bg-[var(--danger-color)] text-white rounded-lg">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </main>
        {showModal && <StudentModal student={editStudent} onClose={() => setShowModal(false)} onSave={() => { loadStudents(); setShowModal(false); }} />}
      </div>
    );
  } catch (error) { console.error('StudentsPage error:', error); return null; }
}

function StudentModal({ student, onClose, onSave }) {
  const [formData, setFormData] = React.useState({ Name: student?.objectData.Name || '', Email: student?.objectData.Email || '', Password: student?.objectData.Password || '', RollNumber: student?.objectData.RollNumber || '', Department: student?.objectData.Department || 'Computer Science' });
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (student) {
        await trickleUpdateObject('student', student.objectId, formData);
        showToast('Student updated successfully', 'success');
      } else {
        await trickleCreateObject('student', formData);
        showToast('Student added successfully', 'success');
      }
      onSave();
    } catch (error) {
      showToast('Operation failed', 'error');
      setLoading(false);
    }
  };

  return <Modal title={student ? 'Edit Student' : 'Add New Student'} onClose={onClose}><form onSubmit={handleSubmit} className="space-y-4"><input type="text" placeholder="Full Name" value={formData.Name} onChange={(e) => setFormData({...formData, Name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required /><input type="email" placeholder="Email" value={formData.Email} onChange={(e) => setFormData({...formData, Email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required /><input type="password" placeholder="Password" value={formData.Password} onChange={(e) => setFormData({...formData, Password: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required={!student} /><input type="text" placeholder="Roll Number" value={formData.RollNumber} onChange={(e) => setFormData({...formData, RollNumber: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]" required /><select value={formData.Department} onChange={(e) => setFormData({...formData, Department: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--background)]">{['Computer Science','Electronics','Mechanical','Civil','Electrical','IT','BBA','MBA'].map(dept => <option key={dept} value={dept}>{dept}</option>)}</select><button type="submit" disabled={loading} className="w-full py-3 gradient-bg text-white rounded-lg">{loading ? 'Saving...' : 'Save Student'}</button></form></Modal>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><StudentsPage /></ErrorBoundary>);