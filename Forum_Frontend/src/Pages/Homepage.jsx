// Updated HomePage.jsx with sidebar navigation and integrated routing
import React from "react";
import { Navigate, Routes, Route, Outlet, Link, useNavigate } from "react-router-dom";

// Shared UI
import Logo from "../components/Logo";
import ProfileButton from "../components/ProfilePicture";

// Pages
import DepartmentBoard from "./DepartmentBoard";
import DirectMessages from "./DirectMessages";
import ProfilePage from "./Profile";
import DepartmentPage from "./DepartmentPoster";
import MessageDetail from './MessageDetail';
import DirectMessageDetails from "./DirectMessageDetails";
// Context
import { UserProvider, useUser } from "../context/UserContext";
import { DepartmentProvider } from "../context/DepartmentContext";
import { MessageProvider, useMessage } from "../context/MessageContext";
import DirectMessageProvider from '../context/DirectMessageContext';


function Sidebar() {
  const { user } = useUser();
  const { messages } = useMessage();
  const navigate = useNavigate();

  const sortedMessages = [...(messages || [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div onClick={() => navigate(`/profile/${user?.unityId}`)} className="cursor-pointer">
          <ProfileButton />
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => navigate("/friends")}
            className="block text-left w-full text-gray-800 hover:text-red-600 font-medium"
          >
            Friends
          </button>
          <button
            onClick={() => navigate("/departments")}
            className="block text-left w-full text-gray-800 hover:text-red-600 font-medium"
          >
            Departments
          </button>
          <button
            onClick={() => navigate("/messages")}
            className="block text-left w-full text-gray-800 hover:text-red-600 font-medium"
          >
            Direct Messages
          </button>

          <div className="pl-2 text-sm text-gray-500">
            {sortedMessages.map((msg) => (
              <div
                key={msg.id}
                className="hover:text-blue-600 cursor-pointer truncate"
                onClick={() => navigate(`/messages/${msg.id}`)}
              >
                {msg.title || msg.content.slice(0, 30)}
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="text-red-600 font-bold text-lg hover:underline"
        >
          WolfTalk
        </button>
      </div>
    </aside>
  );
}

function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 px-6 py-8 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  const { user, loading, departmentId } = useUser();

  if (loading) {
    return <p className="text-center text-gray-700">Loading user info...</p>;
  }

  return (
    <section className="space-y-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          Welcome to WolfTalk{user?.displayName ? `, ${user.displayName}` : ""}!
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          {user?.isStudent === false ? (
            <>Connect with students, answer class questions, and join your department’s conversations.</>
          ) : (
            <>A campus-only forum built for NC State—connect through department boards, class discussions, and professor Q&A threads.</>
          )}
        </p>
      </div>

      <div className="text-center">
        <Link
          to="/departments"
          className="inline-block px-6 py-3 bg-red-600 text-white rounded-full text-lg font-semibold shadow hover:bg-red-700 transition"
        >
          {user?.isStudent === false ? "Access Your Department Boards" : "Browse Departments & Classes"}
        </Link>
      </div>

      {user?.department && user.isStudent && (
        <div className="text-center text-sm text-gray-600">
          <p>Looking for peers in <strong>{user.department}</strong>?</p>
          <Link
            to={`/departments/${departmentId}`}
            className="text-blue-600 hover:underline"
          >
            Go to your department board
          </Link>
        </div>
      )}
    </section>
  );
}

export default function HomePage() {
  return (
    <UserProvider>
      <DirectMessageProvider>
      <DepartmentProvider>
        <MessageProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="departments" element={<DepartmentPage />} />
              <Route path="departments/:deptId" element={<DepartmentBoard />} />
              <Route path="messages" element={<DirectMessages />} />
              <Route path="profile/:unityId" element={<ProfilePage />} />
              <Route path="posts/:postId" element={<MessageDetail />} />
              <Route path="groupChat/:groupId" element={<DirectMessageDetails />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MessageProvider>
      </DepartmentProvider>
    </DirectMessageProvider>
  </UserProvider>
  );
}
