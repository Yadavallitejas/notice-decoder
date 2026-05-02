import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, deleteHistoryItem } from '../services/firebaseConfig';
import HistoryCard from '../components/HistoryCard';
import toast from 'react-hot-toast';

export default function History() {
  const { user, loading } = useAuth();
  const [scans, setScans] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      try {
        const data = await getUserHistory(user.uid);
        setScans(data);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load history.");
      } finally {
        setFetching(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleDelete = async (scanId) => {
    if (window.confirm("Are you sure you want to delete this notice from your history?")) {
      try {
        await deleteHistoryItem(user.uid, scanId);
        setScans(scans.filter(s => s.id !== scanId));
        toast.success("Notice deleted.");
      } catch (error) {
        console.error("Error deleting doc:", error);
        toast.error("Failed to delete notice.");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Sign in to see your history</h2>
        <p className="text-gray-600">Your decoded notices are saved securely to your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1e3a5f] mb-8">Your Decoding History</h1>
      
      {fetching ? (
        <div className="space-y-4">
           {[1,2,3].map(i => (
             <div key={i} className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse"></div>
           ))}
        </div>
      ) : scans.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No history found. Decode your first notice to see it here!
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map(scan => (
            <HistoryCard key={scan.id} scan={scan} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
