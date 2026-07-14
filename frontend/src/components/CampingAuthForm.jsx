import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { campingAuthAPI } from '../services/api';
import { FiCalendar, FiMapPin, FiUsers, FiTarget } from 'react-icons/fi';

const CampingAuthForm = ({ onSuccess }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const startDate = watch('start_date');
  
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await campingAuthAPI.create(data);
      toast.success('🎉 Camping authorization request submitted successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📋 Request Camping Authorization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location */}
        <div className="col-span-2">
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <FiMapPin className="mr-2 text-blue-600" /> Camp Location
          </label>
          <input
            type="text"
            placeholder="Enter camping location"
            {...register('camp_location', { required: 'Location is required' })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
          />
          {errors.camp_location && <span className="text-red-500 text-sm mt-1">{errors.camp_location.message}</span>}
        </div>
        
        {/* Start Date */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <FiCalendar className="mr-2 text-blue-600" /> Start Date
          </label>
          <input
            type="date"
            {...register('start_date', { required: 'Start date is required' })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
          />
          {errors.start_date && <span className="text-red-500 text-sm mt-1">{errors.start_date.message}</span>}
        </div>
        
        {/* End Date */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <FiCalendar className="mr-2 text-blue-600" /> End Date
          </label>
          <input
            type="date"
            {...register('end_date', {
              required: 'End date is required',
              validate: (value) => new Date(value) >= new Date(startDate) || 'End date must be after start date'
            })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
          />
          {errors.end_date && <span className="text-red-500 text-sm mt-1">{errors.end_date.message}</span>}
        </div>
        
        {/* Number of Scouts */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <FiUsers className="mr-2 text-blue-600" /> Number of Scouts
          </label>
          <input
            type="number"
            placeholder="Number of scouts"
            {...register('number_of_scouts', {
              required: 'Number of scouts is required',
              min: { value: 1, message: 'Must be at least 1 scout' }
            })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
          />
          {errors.number_of_scouts && <span className="text-red-500 text-sm mt-1">{errors.number_of_scouts.message}</span>}
        </div>
        
        {/* Objective */}
        <div className="col-span-2">
          <label className="flex items-center text-lg font-semibold text-gray-700 mb-3">
            <FiTarget className="mr-2 text-blue-600" /> Camping Objective
          </label>
          <textarea
            placeholder="Describe the objective and activities planned"
            rows="4"
            {...register('camping_objective', { required: 'Objective is required' })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
          />
          {errors.camping_objective && <span className="text-red-500 text-sm mt-1">{errors.camping_objective.message}</span>}
        </div>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '⏳ Submitting...' : '✅ Submit Request'}
      </button>
    </form>
  );
};

export default CampingAuthForm;
