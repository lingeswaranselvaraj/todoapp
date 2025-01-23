import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Sos = () => {
  const [userEmail, setUserEmail] = useState(() => {
    return sessionStorage.getItem('userEmail') || ''; // Retrieve email from session storage
  });

  const navigate = useNavigate(); // Initialize the navigate function

  const onSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const userData = JSON.parse(atob(token.split('.')[1]));
    const email = userData.email;

    // Store email in session storage for session management
    sessionStorage.setItem('userEmail', email);

    // Send email to backend
    try {
      const response = await fetch('http://localhost:5038/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to save or fetch user details');
      }

      const data = await response.json();
      if (data.userId) {
        sessionStorage.setItem('userId', data.userId); // Store user ID in session storage
      }
    } catch (error) {
      console.error("Error saving or fetching user details:", error);
    }

    // Redirect to the Todo App after successful login
    navigate('/home');
  };

  const onError = (error) => {
    console.error('Login Failed', error);
    alert('Login failed! Please try again.');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userEmail'); // Clear the email from session storage
    setUserEmail(''); // Clear state
  };

  return (
    <GoogleOAuthProvider clientId="406320822754-6iul5onkaiuboq2n9psvf3hmdsa5vrg7.apps.googleusercontent.com"> {/* Replace with your client ID */}
      <div style={styles.container}>
        {/* Replacing the "Google Sign-In" with the Todo App header */}
        <div className="header" style={styles.headerStyle}>
          <h2 className="app-title" style={styles.appTitle}>Todo App</h2>
        </div>
        {userEmail ? (
          <div style={styles.userInfo}>
            <p style={styles.loggedInText}>Logged in as: {userEmail}</p>
            <button style={styles.button} onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div style={styles.loginContainer}>
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              scope="profile email" // Request these scopes
            />
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

// Styles for the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  headerStyle: {
    marginBottom: '20px',
  },
  appTitle: {
    fontSize: '2rem',
    margin: 0,
    color: '#333',
  },
  userInfo: {
    textAlign: 'center',
  },
  loggedInText: {
    fontSize: '1.2rem',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#4285F4',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loginContainer: {
    marginTop: '20px',
  },
};

export default Sos;