import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 hover:opacity-90">
      <div className="bg-red-700 text-white text-xs font-bold px-2 py-1 rounded">
        NC STATE
      </div>
      <h1 className="text-xl font-bold text-gray-800">WolfTalk</h1>
    </Link>
  );
}
