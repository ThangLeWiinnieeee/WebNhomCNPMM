import React from 'react';

const ProfileCard = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="card shadow-sm mb-4">
      <div className="row g-0">
        <div className="col-md-4 text-center p-3">
          <img 
            src={profile.avatar || "https://via.placeholder.com/150"} 
            alt="Avatar" 
            className="img-fluid rounded-circle border"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h3 className="card-title">{profile.name}</h3>
            <p className="card-text"><strong>Email:</strong> {profile.email}</p>
            <p className="card-text"><strong>Phone:</strong> {profile.phone || "N/A"}</p>
            <p className="card-text"><strong>Bio:</strong> {profile.bio || "Chưa có thông tin"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;