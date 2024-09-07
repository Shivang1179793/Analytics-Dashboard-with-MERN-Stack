// src/scenes/logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Logout logic
    localStorage.removeItem("token");
    navigate("/dashboard");
  }, [navigate]);

  return null; // or you can return a loading spinner or message
};

export default Logout;
