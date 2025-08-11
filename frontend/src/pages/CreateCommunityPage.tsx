import React from 'react';
import CreateCommunity from '../components/CreateCommunity';

const CreateCommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <CreateCommunity />
      </div>
    </div>
  );
};

export default CreateCommunityPage;
