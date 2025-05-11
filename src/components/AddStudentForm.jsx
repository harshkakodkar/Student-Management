import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function AddStudentForm() {
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [students, setStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.course) {
      setError("Please fill all fields");
      return;
    }

    if (editIndex !== null) {
      const updatedStudents = students.map((student, index) =>
        index === editIndex ? form : student
      );
      setStudents(updatedStudents);
      setEditIndex(null);
    } else {
      setStudents([...students, form]);
    }

    setForm({ name: "", email: "", course: "" });
    setError("");
  };

  const handleEdit = (index) => {
    const student = students[index];
    setForm({ name: student.name, email: student.email, course: student.course });
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedStudents = students.filter((_, idx) => idx !== index);
    setStudents(updatedStudents);
  };

  const handleSave = async () => {
    if (students.length === 0) {
      setError("No students to save!");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const studentsRef = collection(db, "students");
      await Promise.all(
        students.map((student) => addDoc(studentsRef, student))
      );

      setSuccess("All students saved successfully!");
      setStudents([]);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setError("Error saving students: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-300 hover:text-white transition duration-200"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">
            {editIndex !== null ? "Edit Student" : "Add New Student"}
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                  placeholder="john@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-1">
                Course
              </label>
              <select
                id="course"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
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

            <button
              type="submit"
              className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {editIndex !== null ? "Update Student" : "Add Student"}
            </button>
          </form>

          {students.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Students to be Saved</h3>
                <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-sm">
                  {students.length} {students.length === 1 ? "student" : "students"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Course</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-700/50 transition duration-150">
                        <td className="px-4 py-3 text-white">{student.name}</td>
                        <td className="px-4 py-3 text-gray-300">{student.email}</td>
                        <td className="px-4 py-3 text-gray-300">{student.course}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-500 text-white transition duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-200 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save All Students"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}