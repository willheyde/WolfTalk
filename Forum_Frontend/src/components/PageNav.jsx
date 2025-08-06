// src/components/PageNavBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const PageNavBar = () => {
 const navItems = [
  { name: "Class",    path: "/class" },  
  { name: "Major",    path: "/major" },
  { name: "Messages", path: "/messages" },
];

  return (
    <nav className="bg-white border-t border-b border-gray-200 px-6 py-3 flex gap-6 justify-center text-sm font-medium">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            isActive
              ? "text-red-700 border-b-2 border-red-700 pb-1"
              : "text-gray-700 hover:text-red-600"
          }
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default PageNavBar;
