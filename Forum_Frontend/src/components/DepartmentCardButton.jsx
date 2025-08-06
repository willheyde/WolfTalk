// components/DepartmentCardButton.jsx
import { useNavigate } from 'react-router-dom';

export default function DepartmentCardButton({ department }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/departments/${department.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left bg-red-600 text-white p-4 rounded-lg shadow-md hover:bg-red-700 transition"
    >
      <h2 className="text-xl font-bold mb-1">{department.name}</h2>
      <p className="text-sm text-gray-200">{department.description}</p>
    </button>
  );
}
