import React, { useState, useEffect } from 'react';
import UserSetup from './components/UserSetup';
import Calculator from './components/Calculator';
import { UserData } from './types';
import { getUserId } from './utils/userUtils';
import { createOrUpdateUser } from './services/userService';

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string>('');

  // Load user data from localStorage on mount
  useEffect(() => {
    // Generate or get existing user ID
    const currentUserId = getUserId();
    setUserId(currentUserId);

    const savedData = localStorage.getItem('frivoloUserData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('frivoloUserData');
      }
    }
  }, []);

  const handleUserSetupComplete = async (data: UserData) => {
    try {
      // Create or update user in database first
      await createOrUpdateUser(userId, data);
      
      // Only update state and localStorage after successful database operation
      setUserData(data);
      localStorage.setItem('frivoloUserData', JSON.stringify(data));
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error - maybe show a message to user
    }
  };

  const handleReset = () => {
    setUserData(null);
    localStorage.removeItem('frivoloUserData');
  };

  return (
    <div className="App">
      {userData ? (
        <Calculator userData={userData} userId={userId} onReset={handleReset} />
      ) : (
        <UserSetup onComplete={handleUserSetupComplete} />
      )}
    </div>
  );
}

export default App;