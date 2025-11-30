import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, setProfile } from '../features/userSlice';
import ProfileCard from '../components/ProfileCard';
import ProfileForm from '../components/ProfileForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from 'react-bootstrap';
import { getUserIdFromToken } from '../utils/auth';
import { testProfile } from '../testData';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, userId: reduxUserId, status } = useSelector(state => state.user);
  const [editing, setEditing] = useState(false);

  const tokenUserId = getUserIdFromToken();
  const userId = tokenUserId || reduxUserId || "644f0b2c1234567890abcdef"; // fallback test id

  useEffect(() => {
    if (tokenUserId || reduxUserId) {
      dispatch(fetchUserProfile(userId));
    } else {
      // tạo data mặc định test
      dispatch(setProfile(testProfile));
    }
  }, [dispatch, userId, tokenUserId, reduxUserId]);

  if (!profile) {
    return (
      <div>
        <Header />
        <p className="text-center mt-5">Loading profile...</p>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container my-5">
        <ProfileCard profile={profile} />
        {!editing && (
          <div className="text-center mb-3">
            <Button variant="primary" onClick={() => setEditing(true)}>Edit Profile</Button>
          </div>
        )}
        {editing && <ProfileForm userId={userId} onClose={() => setEditing(false)} />}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;