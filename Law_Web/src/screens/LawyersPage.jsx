import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LawyerCard from '@/components/common/LawyerCard';

const LawyersPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/user/lawyers');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch lawyers');
        setLawyers(data.lawyers || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  if (loading) return <div className="p-8">Loading lawyers...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Lawyers</h1>
      {lawyers.length === 0 ? (
        <p>No lawyers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawyers.map((lawyer) => (
            <LawyerCard key={lawyer._id} lawyer={lawyer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LawyersPage;



