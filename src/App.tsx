import React, { useState, useEffect } from 'react';
import UserSetup from './components/UserSetup';
import Calculator from './components/Calculator';

interface UserData {
  name: string;
  age: string;
  country: string;
  monthlySalary: string;
  hoursPerDay: string;
  daysPerWeek: string;
}

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
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

  const handleUserSetupComplete = (data: UserData) => {
    setUserData(data);
    localStorage.setItem('frivoloUserData', JSON.stringify(data));
  };

  const handleReset = () => {
    setUserData(null);
    localStorage.removeItem('frivoloUserData');
  };

  return (
    <div className="App">
      {userData ? (
        <Calculator userData={userData} onReset={handleReset} />
      ) : (
        <UserSetup onComplete={handleUserSetupComplete} />
      )}
    </div>
  );
}

export default App;