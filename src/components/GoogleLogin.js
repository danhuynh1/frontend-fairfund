import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const GoogleLoginButton = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: '35325676352-jdrrj0eeg9ohqaslpm53ni3mdbubfead.apps.googleusercontent.com', // Replace with your real ID
          callback: async (response) => {
            try {
              const res = await axios.post('http://localhost:5000/api/users/google-login', {
                tokenId: response.credential,
              });
              
              // Use the context's login function with the token from the backend
              login(res.data.token);
              
              // Programmatically navigate to the dashboard
              navigate('/');

            } catch (err) {
              console.error('Login failed:', err.response?.data || err.message);
            }
          },
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-login'),
          { theme: 'outline', size: 'large' }
        );
      } else {
        setTimeout(initializeGoogle, 100);
      }
    };

    initializeGoogle();
  }, [login, navigate]);

  return <div id="google-login"></div>;
};

export default GoogleLoginButton;