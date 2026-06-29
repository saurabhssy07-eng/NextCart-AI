import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { userService } from '../../services/api';
import { setUser } from '../../store/authSlice';

const ProfileInfo = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Prefer not to say',
    bio: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || 'Prefer not to say',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain exactly 10 digits.';
    }
    
    if (formData.bio && formData.bio.length > 300) {
      newErrors.bio = 'Bio cannot exceed 300 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fix the validation errors.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await userService.updateProfile(formData);
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success('Profile updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error('An error occurred while saving profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (2MB) and type
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type! Only JPG, PNG, and WEBP allowed.');
      return;
    }

    const data = new FormData();
    data.append('avatar', file);

    try {
      setIsUploading(true);
      const res = await userService.uploadAvatar(data);
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success('Avatar updated successfully!');
      } else {
        toast.error(res.message || 'Failed to upload avatar.');
      }
    } catch (error) {
      toast.error('An error occurred while uploading avatar.');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your avatar?')) return;
    
    try {
      setIsUploading(true);
      const res = await userService.deleteAvatar();
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success('Avatar removed.');
      }
    } catch (error) {
      toast.error('Failed to remove avatar.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h1>
      
      {/* Avatar Section */}
      <div className="flex flex-col items-center justify-center mb-10 pb-8 border-b border-gray-100 dark:border-gray-700">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md bg-gray-100 dark:bg-gray-700 relative">
            {user?.avatar?.url && user.avatar.url !== 'https://via.placeholder.com/150' ? (
              <img src={user.avatar.url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
            )}

            {/* Hover Overlay */}
            <div 
              onClick={() => !isUploading && fileInputRef.current.click()}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium">Change Photo</span>
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleAvatarChange} 
            accept="image/jpeg,image/png,image/webp,image/jpg" 
            className="hidden" 
          />

          {user?.avatar?.publicId && !isUploading && (
            <button 
              onClick={handleDeleteAvatar}
              className="absolute bottom-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm z-30"
              title="Remove Avatar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
          JPG, PNG or WEBP. Max 2MB.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'}`}
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'}`}
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
          </div>

          {/* Email (Disabled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Email cannot be changed.</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit number"
              className={`w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'}`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors focus:border-blue-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors focus:border-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            placeholder="Tell us a little about yourself..."
            className={`w-full px-4 py-2.5 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-colors resize-none ${errors.bio ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'}`}
          ></textarea>
          <div className="flex justify-between mt-1">
            {errors.bio ? (
              <p className="text-sm text-red-500">{errors.bio}</p>
            ) : (
              <p className="text-xs text-gray-500">Brief description for your profile.</p>
            )}
            <p className={`text-xs ${formData.bio.length > 300 ? 'text-red-500' : 'text-gray-500'}`}>
              {formData.bio.length}/300
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end border-t border-gray-100 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;
