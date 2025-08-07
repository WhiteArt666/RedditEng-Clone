import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        {user && (
          <div className="space-y-4">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>English Level:</strong> {user.englishLevel}</p>
            <p><strong>Karma:</strong> {user.karma}</p>
            <p><strong>Joined:</strong> {new Date(user.joinedAt).toLocaleDateString()}</p>
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
