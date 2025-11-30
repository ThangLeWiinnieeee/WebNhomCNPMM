import React, { useEffect } from 'react';
import ProfilePage from './pages/ProfilePage';
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from './features/userSlice';

function App() {
  const dispatch = useDispatch();
  const userId = "644f0b2c1234567890abcdef";

  useEffect(() => {
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  return <ProfilePage />;
}

export default App;