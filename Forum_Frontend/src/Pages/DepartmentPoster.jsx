// pages/DepartmentsPage.jsx
import { useEffect, useState } from 'react';
import DepartmentCardButton from '../components/DepartmentCardButton';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/departments'); // adjust if needed
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading departments...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Departments</h1>
      {departments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <DepartmentCardButton key={dept.id} department={dept} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No departments available.</p>
      )}
    </div>
  );
}
