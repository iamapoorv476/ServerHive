import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../store/slices/gigsSlice';
import { Plus, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../store/hooks';
import { CreateGigData } from '../types';

interface FormData {
  title: string;
  description: string;
  budget: string;
}

const CreateGig: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    budget: '',
  });

  const { title, description, budget } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !description || !budget) {
      toast.error('Please fill in all fields');
      return;
    }

    if (parseFloat(budget) <= 0) {
      toast.error('Budget must be greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      const gigData: CreateGigData = {
        title,
        description,
        budget: parseFloat(budget),
      };

      const result = await dispatch(createGig(gigData)).unwrap();

      toast.success('Gig created successfully!');
      navigate(`/gigs/${result._id}`);
    } catch (error: any) {
      toast.error(error || 'Failed to create gig');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="mb-8">
          <div className="inline-flex p-4 bg-primary-100 rounded-full mb-4">
            <Plus className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Gig</h1>
          <p className="text-gray-600">
            Create a job posting and receive bids from talented freelancers
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Gig Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={onChange}
              className="input"
              placeholder="e.g., Build a responsive website with React"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Keep it clear and descriptive (max 100 characters)
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              className="input"
              rows={8}
              placeholder="Describe your project in detail. Include requirements, deliverables, timeline, and any specific skills needed..."
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Provide detailed information to attract the best freelancers (max 2000 characters)
            </p>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Budget <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="budget"
                name="budget"
                value={budget}
                onChange={onChange}
                className="input pl-12"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Set a competitive budget to attract quality bids
            </p>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Gig</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;