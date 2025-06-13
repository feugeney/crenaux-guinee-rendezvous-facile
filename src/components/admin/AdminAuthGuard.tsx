
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const adminAuth = localStorage.getItem('adminAuthenticated');
  
  if (adminAuth !== 'true') {
    return null; // La redirection se fait dans useEffect
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
