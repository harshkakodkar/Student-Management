import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentData);
      } catch (error) {
        setError("Error fetching students: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle edit action
  const handleEdit = (student) => {
    setForm({ name: student.name, email: student.email, course: student.course });
    setEditId(student.id);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    
    try {
      await deleteDoc(doc(db, "students", id));
      setStudents(students.filter(student => student.id !== id));
      setSuccess("Student deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error deleting student: " + error.message);
    }
  };

  // Handle save or update student action
  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.course) {
      setError("Please fill all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editId) {
        // Update student
        const studentRef = doc(db, "students", editId);
        await updateDoc(studentRef, form);
        const updatedStudents = students.map(student =>
          student.id === editId ? { ...student, ...form } : student
        );
        setStudents(updatedStudents);
        setSuccess("Student updated successfully");
      } else {
        // Add new student
        const newStudentRef = await addDoc(collection(db, "students"), form);
        setStudents([...students, { id: newStudentRef.id, ...form }]);
        setSuccess("Student added successfully");
      }

      setForm({ name: "", email: "", course: "" });
      setEditId(null);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Error saving student: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setForm({ name: "", email: "", course: "" });
    setEditId(null);
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Student List</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-200 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm mb-4 sm:mb-6">
          {success}
        </div>
      )}

      {/* Edit Form - responsive layout */}
      {editId && (
        <form onSubmit={handleSave} className="mb-6 sm:mb-8 bg-gray-700/50 p-4 sm:p-6 rounded-xl">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
            Edit Student
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 text-sm sm:text-base"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 text-sm sm:text-base"
                placeholder="john@example.com"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                Course
              </label>
              <select
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200 text-sm sm:text-base"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                <option value="BSc IT">BSc IT</option>
                <option value="MSc IT">MSc IT</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 transition duration-200 text-sm sm:text-base"
            >
              <FiSave className="mr-1 sm:mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium text-white bg-gray-600 hover:bg-gray-500 transition duration-200 text-sm sm:text-base"
            >
              <FiX className="mr-1 sm:mr-2" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Student Table - responsive version */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300">Name</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300 hidden sm:table-cell">Email</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300">Course</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-2 py-4 sm:px-4 sm:py-6 text-center text-xs sm:text-sm text-gray-400">
                  {isLoading ? "Loading students..." : "No students found"}
                </td>
              </tr>
            ) : (
              students.map(student => (
                <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-700/50 transition duration-150">
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-white text-xs sm:text-sm">
                    {student.name}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-300 text-xs sm:text-sm hidden sm:table-cell">
                    {student.email}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-gray-300 text-xs sm:text-sm">
                    {student.course}
                  </td>
                  <td className="px-2 py-2 sm:px-4 sm:py-3 text-right space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded bg-blue-600 hover:bg-blue-500 text-white transition duration-200"
                    >
                      <FiEdit2 className="mr-0 sm:mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded bg-red-600 hover:bg-red-500 text-white transition duration-200"
                    >
                      <FiTrash2 className="mr-0 sm:mr-1" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}