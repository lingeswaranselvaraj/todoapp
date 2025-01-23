import React, { useEffect, useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Sos = () => {
  const [userEmail, setUserEmail] = useState(() => {
    return sessionStorage.getItem('userEmail') || ''; // Retrieve email from session storage
  });

  const navigate = useNavigate(); // Initialize the navigate function

  // useEffect(() => {
  //   // Optional: Add cleanup function to clear the session when the component unmounts
  //   return () => {
  //     sessionStorage.removeItem('userEmail'); // Clear email when component unmounts
  //   };
  // }, []);

  const onSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    // Decode the JWT token to extract user information
    const userData = JSON.parse(atob(token.split('.')[1]));
    const email = userData.email;

    alert(`Login successful! Your email is: ${email}`);

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
        console.log(`User ID: ${data.userId}`);
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
      <div>
        <h2>Google Sign-In</h2>
        {userEmail ? (
          <div>
            <p>Logged in as: {userEmail}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            scope="profile email" // Request these scopes
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default Sos; // Ensure export matches the updated import in index.js
