import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AUDIT_ROUTES } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

const AuditPage = () => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        const token = localStorage.getItem("token");
        const link = AUDIT_ROUTES+`?token=${token}`;
        // console.log(link);
        if(!token || token=="null") navigate("/login");
        const response = await axios.get(link);
        console.log(response.data.users);
        
        setAuditData(response.data.users);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching audit data:', err);
        setError('Failed to load audit data.');
        setLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/login")
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="audit-container">
      <h1>User Login Audit</h1>
      <button onClick={handleLogout}>logout</button>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Last Login Time</th>
          </tr>
        </thead>
        <tbody>
          {auditData.lastLogin.length > 0 ? (
            auditData.lastLogin?.map((user, index) => (
              <tr key={index}>
                <td>{auditData.email}</td>
                <td>{user}</td>
              </tr>
             ))
          ) : (
            <tr>
              <td colSpan="2">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditPage;
