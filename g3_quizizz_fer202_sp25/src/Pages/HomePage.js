import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to QuizApp!</h1>
      <p className="text-gray-700 mt-4 max-w-lg">
      </p>
      <h5>Chào mừng bạn đến với Quizzes!</h5>
      <Link
        to="/guest"
        className="mt-6 px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Bắt đầu học
      </Link>
    </div>
  );
};

export default HomePage;