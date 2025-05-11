import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import StudentList from "./StudentList";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPlus } from "react-icons/fi";

export default function Home() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth);
  };

  const goToAddStudent = () => {
    navigate("/add-student");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden p-4 sm:p-6 md:p-8 border border-gray-700 relative">
          {/* Sign Out button - better mobile positioning */}
          <button
            onClick={handleSignOut}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-500 transition duration-200 text-sm sm:text-base"
          >
            <FiLogOut className="mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Title - adjusted for mobile */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 text-center mt-2 sm:mt-0">
            Student Management
          </h1>

          {/* Add Student Button - responsive sizing */}
          <div className="text-center mb-6 sm:mb-8">
            <button
              onClick={goToAddStudent}
              className="flex items-center mx-auto px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition duration-200 text-sm sm:text-base"
            >
              <FiPlus className="mr-1 sm:mr-2" />
              Add New Student
            </button>
          </div>

          {/* Student List */}
          <StudentList />
        </div>
      </div>
    </div>
  );
}
