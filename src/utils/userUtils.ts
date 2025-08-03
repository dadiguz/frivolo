export const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
};

export const getUserId = (): string => {
  let userId = localStorage.getItem('frivoloUserId');
  
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('frivoloUserId', userId);
  }
  
  return userId;
};