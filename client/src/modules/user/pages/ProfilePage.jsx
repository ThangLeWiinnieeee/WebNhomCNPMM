import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ProfileAvatar from '../components/Profile/ProfileAvatar';
import ProfileInfoForm from '../components/Profile/ProfileInfoForm';
import ProfileSecurity from '../components/Profile/ProfileSecurity';

const ProfilePage = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container py-5 flex-grow-1">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <ProfileAvatar />
                        <ProfileInfoForm />
                        <ProfileSecurity />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfilePage;