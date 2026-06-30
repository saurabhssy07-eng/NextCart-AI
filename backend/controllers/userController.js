import { User } from '../models/index.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// -----------------------------------------
// PROFILE MANAGEMENT
// -----------------------------------------

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          firstName,
          lastName,
          phone,
          dateOfBirth,
          gender,
          bio
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};

// @desc    Upload & Update user avatar
// @route   POST /api/users/profile/avatar
// @access  Private
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Wrap Cloudinary upload in a promise
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: process.env.CLOUDINARY_FOLDER ? `${process.env.CLOUDINARY_FOLDER}/avatars` : 'nextcart/avatars',
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face', aspect_ratio: '1.0' },
              { fetch_format: 'auto', quality: 'auto' }
            ],
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await uploadStream();

    const user = await User.findById(req.user.id);
    
    // Delete old avatar from Cloudinary if it exists
    if (user.avatar && user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId).catch(err => console.log('Old avatar delete error:', err));
    }

    user.avatar = {
      publicId: result.public_id,
      url: result.secure_url
    };
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: user.avatar,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload avatar', error: error.message });
  }
};

// @desc    Delete user avatar (reset to default)
// @route   DELETE /api/users/profile/avatar
// @access  Private
export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.avatar && user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    user.avatar = {
      publicId: null,
      url: 'https://via.placeholder.com/150'
    };
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete avatar', error: error.message });
  }
};

// -----------------------------------------
// ADDRESS MANAGEMENT
// -----------------------------------------

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // If this is the first address, make it default billing and shipping
    if (user.addresses.length === 0) {
      req.body.isDefaultBilling = true;
      req.body.isDefaultShipping = true;
    }

    user.addresses.push(req.body);
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add address', error: error.message });
  }
};

// @desc    Update an existing address
// @route   PUT /api/users/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      address[key] = req.body[key];
    });

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update address', error: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Remove the address
    address.deleteOne();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete address', error: error.message });
  }
};

// @desc    Set address as default (billing or shipping)
// @route   PUT /api/users/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const { type } = req.body; // 'billing' or 'shipping'
    if (!['billing', 'shipping'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be billing or shipping' });
    }

    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Reset others
    user.addresses.forEach(addr => {
      if (type === 'billing') addr.isDefaultBilling = false;
      if (type === 'shipping') addr.isDefaultShipping = false;
    });

    // Set new default
    if (type === 'billing') address.isDefaultBilling = true;
    if (type === 'shipping') address.isDefaultShipping = true;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Default ${type} address updated`,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to set default address', error: error.message });
  }
};

// -----------------------------------------
// WISHLIST MANAGEMENT
// -----------------------------------------

// @desc    Toggle product in wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if product is already in wishlist
    const index = user.wishlist.indexOf(productId);
    
    let isAdded = false;
    if (index === -1) {
      // Add to wishlist
      user.wishlist.push(productId);
      isAdded = true;
    } else {
      // Remove from wishlist
      user.wishlist.splice(index, 1);
    }

    await user.save({ validateBeforeSave: false });

    // Populate the wishlist products to return
    const populatedUser = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name image images price discountPrice averageRating inStock category brand slug'
    });

    res.status(200).json({
      success: true,
      message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: populatedUser.wishlist,
      user: populatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update wishlist', error: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name image images price discountPrice averageRating inStock category brand slug'
    });

    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist', error: error.message });
  }
};

// -----------------------------------------
// NOTIFICATIONS MANAGEMENT
// -----------------------------------------

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Seed dummy notification if empty
    if (!user.notificationsList || user.notificationsList.length === 0) {
      user.notificationsList = [
        {
          title: 'Welcome to NextCart AI!',
          message: 'Explore our latest AI-powered shopping features and personalized recommendations.',
          isRead: false,
          createdAt: Date.now()
        },
        {
          title: 'Security Alert',
          message: 'A new login was detected on your account. Please review your active sessions.',
          isRead: false,
          createdAt: Date.now() - 86400000
        }
      ];
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      notifications: user.notificationsList.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/users/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const notification = user.notificationsList.id(req.params.id);

    if (notification) {
      notification.isRead = true;
      await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      notifications: user.notificationsList.sort((a, b) => b.createdAt - a.createdAt)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark notification', error: error.message });
  }
};
