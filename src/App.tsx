import React, { useState, useEffect } from 'react';
import UserSetup from './components/UserSetup';
import Calculator from './components/Calculator';
import { UserData } from './types';
import { getUserId } from './utils/userUtils';
import { createOrUpdateUser } from './services/userService';

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error - maybe show a message to user
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="App">
      {userData && !isEditing ? (
        <Calculator userData={userData} userId={userId} onEdit={handleEdit} />
      ) : (
        <UserSetup 
          onComplete={handleUserSetupComplete} 
          initialData={isEditing ? userData : undefined}
          onCancel={isEditing ? handleCancelEdit : undefined}
        />
      )}
    </div>
  );
}

export default App;