import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communitiesAPI } from '../services/api';
import type { CreateCommunityData } from '../types';

const CreateCommunity: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateCommunityData>({
    name: '',
    displayName: '',
    description: '',
    category: 'General',
    isPrivate: false,
    rules: [],
    tags: []
  });
  const [newRule, setNewRule] = useState('');
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addRule = () => {
    if (newRule.trim() && formData.rules!.length < 10) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules!, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules!.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && formData.tags!.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags!, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags!.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.displayName || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate community name
    if (!/^[a-z0-9_]+$/.test(formData.name)) {
      setError('Community name can only contain lowercase letters, numbers, and underscores');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await communitiesAPI.createCommunity(formData);
      navigate(`/community/${response.data.data!.name}`);
    } catch (err) {
      console.error('Error creating community:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to create community');
      } else {
        setError('Failed to create community');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a Community</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Community Name *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              r/
            </span>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="communityname"
              pattern="[a-z0-9_]+"
              title="Only lowercase letters, numbers, and underscores allowed"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            3-25 characters. Only lowercase letters, numbers, and underscores.
          </p>
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name *
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            required
            value={formData.displayName}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Community Display Name"
            maxLength={50}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Tell people what this community is about..."
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/500 characters
          </p>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Grammar">Grammar</option>
            <option value="Vocabulary">Vocabulary</option>
            <option value="Speaking">Speaking</option>
            <option value="Listening">Listening</option>
            <option value="Writing">Writing</option>
            <option value="Reading">Reading</option>
            <option value="IELTS">IELTS</option>
            <option value="TOEFL">TOEFL</option>
          </select>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Private community</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Private communities require approval to join
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Community Rules
          </label>
          <div className="space-y-2">
            {formData.rules!.map((rule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-1 text-sm bg-gray-50 px-3 py-2 rounded">
                  {index + 1}. {rule}
                </span>
                <button
                  type="button"
                  onClick={() => removeRule(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            
            {formData.rules!.length < 10 && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add a rule..."
                  maxLength={200}
                />
                <button
                  type="button"
                  onClick={addRule}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="space-y-2">
            {formData.tags!.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags!.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {formData.tags!.length < 5 && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Add a tag..."
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Community'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
