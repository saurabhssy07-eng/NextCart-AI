import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { userService } from '../../services/api';
import { setUser } from '../../store/authSlice';
import EmptyState from '../../components/ui/EmptyState';
import SectionHeader from '../../components/ui/SectionHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Card, { CardContent, CardFooter } from '../../components/ui/Card';

const AddressManager = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const initialFormState = {
    label: 'Home',
    street: '',
    locality: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    landmark: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  if (!user) return null;
  const addresses = user.addresses || [];

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingId(address._id);
      setFormData({
        label: address.label,
        street: address.street,
        locality: address.locality || '',
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country || 'India',
        landmark: address.landmark || ''
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.street.trim()) newErrors.street = 'Street is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/PIN Code is required';
    
    if (formData.zipCode && !/^[0-9]{5,6}$/.test(formData.zipCode.trim())) {
      newErrors.zipCode = 'Please enter a valid ZIP/PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSaving(true);
      let res;
      if (editingId) {
        res = await userService.updateAddress(editingId, formData);
      } else {
        res = await userService.addAddress(formData);
      }

      if (res.success) {
        dispatch(setUser(res.user));
        toast.success(editingId ? 'Address updated!' : 'Address added!');
        handleCloseModal();
      } else {
        toast.error(res.message || 'Failed to save address');
      }
    } catch (error) {
      toast.error('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await userService.deleteAddress(id);
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success('Address deleted.');
      }
    } catch (error) {
      toast.error('Failed to delete address.');
    }
  };

  const handleSetDefault = async (id, type) => {
    try {
      const res = await userService.setDefaultAddress(id, type);
      if (res.success) {
        dispatch(setUser(res.user));
        toast.success(`Default ${type} address updated.`);
      }
    } catch (error) {
      toast.error('Failed to update default address.');
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Saved Addresses" 
        action={
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus className="w-4 h-4" />}>
            Add New Address
          </Button>
        }
      />

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses saved yet"
          description="Add a shipping address to speed up your checkout process."
          actionLabel="Add Address"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address._id} className={address.isDefaultShipping ? 'border-primary-500 ring-1 ring-primary-500 shadow-md' : ''}>
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={address.label === 'Home' ? 'primary' : address.label === 'Office' ? 'secondary' : 'warning'}>
                      {address.label}
                    </Badge>
                    {address.isDefaultShipping && <Badge variant="success">Default</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal(address)} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(address._id)} className="p-1.5 text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">{user.firstName} {user.lastName}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {address.street}
                  {address.locality && <>, {address.locality}</>}
                  <br />
                  {address.city}, {address.state} {address.zipCode}
                  <br />
                  {address.country}
                </p>
                
                {address.landmark && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Landmark: {address.landmark}
                  </p>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 dark:bg-gray-800/50 gap-2">
                {!address.isDefaultShipping && (
                  <Button variant="secondary" size="sm" onClick={() => handleSetDefault(address._id, 'shipping')}>
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Address Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingId ? 'Edit Address' : 'Add New Address'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            {['Home', 'Office', 'Other'].map(type => (
              <label 
                key={type} 
                className={`cursor-pointer flex items-center justify-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  formData.label === type 
                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' 
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="label" 
                  value={type} 
                  checked={formData.label === type} 
                  onChange={handleChange} 
                  className="hidden" 
                />
                {type}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Street Address / House No."
              name="street"
              value={formData.street}
              onChange={handleChange}
              error={errors.street}
              placeholder="e.g. 123 Main St"
            />
            <Input
              label="Locality / Area (Optional)"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. Downtown"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
            />
            <Input
              label="ZIP / PIN Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              error={errors.zipCode}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Landmark (Optional)"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              placeholder="e.g. Near Metro Station"
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 mt-6">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddressManager;
