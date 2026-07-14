import React, { useState, useEffect } from 'react';
import { campingAuthAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiXCircle, FiClock, FiEdit2 } from 'react-icons/fi';
import { formatDate } from 'date-fns';

const AuthorizationsList = ({ filter = 'all' }) => {
  const [authorizations, setAuthorizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [action, setAction] = useState(null); // 'approve', 'reject'
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  
  useEffect(() => {
    fetchAuthorizations();
  }, [filter]);
  
  const fetchAuthorizations = async () => {
    try {
      setLoading(true);
      let response;
      if (filter === 'my') {
        response = await campingAuthAPI.getMyRequests();
      } else {
        response = await campingAuthAPI.getPending(20, 0);
      }
      setAuthorizations(response.data.data);
    } catch (error) {
      toast.error('Error fetching authorizations');
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async () => {
    try {
      await campingAuthAPI.approve(selectedAuth.id, notes);
      toast.success('✅ Authorization approved!');
      setSelectedAuth(null);
      fetchAuthorizations();
    } catch (error) {
      toast.error('Error approving authorization');
    }
  };
  
  const handleReject = async () => {
    if (!reason) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await campingAuthAPI.reject(selectedAuth.id, reason, notes);
      toast.success('❌ Authorization rejected');
      setSelectedAuth(null);
      fetchAuthorizations();
    } catch (error) {
      toast.error('Error rejecting authorization');
    }
  };
  
  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 flex items-center gap-2',
      approved: 'bg-green-100 text-green-800 flex items-center gap-2',
      rejected: 'bg-red-100 text-red-800 flex items-center gap-2'
    };
    
    const icons = {
      pending: <FiClock />,
      approved: <FiCheckCircle />,
      rejected: <FiXCircle />
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  if (loading) {
    return <div className="text-center py-8">⏳ Loading authorizations...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {authorizations.map((auth) => (
          <div key={auth.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{auth.group_name}</h3>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <FiMapPin /> {auth.camp_location}
                </p>
              </div>
              {getStatusBadge(auth.status)}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Start Date</span>
                <p className="text-gray-600">{formatDate(new Date(auth.start_date), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">End Date</span>
                <p className="text-gray-600">{formatDate(new Date(auth.end_date), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Scouts</span>
                <p className="text-gray-600">{auth.number_of_scouts}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">District</span>
                <p className="text-gray-600">{auth.district_name}</p>
              </div>
            </div>
            
            {auth.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedAuth(auth);
                    setAction('approve');
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FiCheckCircle /> Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedAuth(auth);
                    setAction('reject');
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FiXCircle /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Action Modal */}
      {selectedAuth && action && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {action === 'approve' ? '✅ Approve Authorization' : '❌ Reject Authorization'}
            </h3>
            
            {action === 'reject' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Rejection Reason *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for rejection"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                  rows="3"
                />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                rows="3"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedAuth(null);
                  setAction(null);
                  setNotes('');
                  setReason('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={action === 'approve' ? handleApprove : handleReject}
                className={`flex-1 font-semibold py-2 px-4 rounded-lg transition text-white ${
                  action === 'approve'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizationsList;
