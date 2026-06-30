import { Product, Category } from '../models/index.js';

// GET all products with filtering and pagination
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isActive: true };

    let sortQuery = sort || '-createdAt';
    let projection = null;

    if (category) {
      filter.category = category;
    }

    if (search && search.trim().length > 0) {
      filter.$text = { $search: search };
      // Override sort to prioritize text search relevance if the user hasn't explicitly selected another sort like price
      if (!sort || sort === '-createdAt') {
        sortQuery = { score: { $meta: 'textScore' } };
      }
      projection = { score: { $meta: 'textScore' } };
    }

    let products = await Product.find(filter, projection)
      .populate('category', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    let total = await Product.countDocuments(filter);

    // Fallback: 1-character typo tolerance using regex if no results found
    if (products.length === 0 && search && search.trim().length > 3) {
      const term = search.trim();
      const fuzzyRegexes = [];
      for (let i = 0; i < term.length; i++) {
        fuzzyRegexes.push(term.slice(0, i) + '.' + term.slice(i + 1));
      }
      const fuzzyPattern = fuzzyRegexes.join('|');
      
      const fuzzyFilter = { isActive: true };
      if (category) fuzzyFilter.category = category;
      fuzzyFilter.$or = [
        { name: { $regex: fuzzyPattern, $options: 'i' } },
        { tags: { $regex: fuzzyPattern, $options: 'i' } },
        { brand: { $regex: fuzzyPattern, $options: 'i' } }
      ];

      products = await Product.find(fuzzyFilter)
        .populate('category', 'name slug')
        .sort(sort || '-createdAt')
        .skip(skip)
        .limit(parseInt(limit));
      
      total = await Product.countDocuments(fuzzyFilter);
    }

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Get products error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

// GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ Get product error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

// CREATE product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, image, specifications, tags } = req.body;

    // Validation
    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if SKU is unique
    if (sku) {
      const skuExists = await Product.findOne({ sku });
      if (skuExists) {
        return res.status(409).json({
          success: false,
          message: 'SKU already exists',
        });
      }
    }

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      sku: sku || `SKU-${Date.now()}`,
      image: image || 'https://via.placeholder.com/400',
      specifications,
      tags: tags || [],
    });

    await newProduct.save();
    await newProduct.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('❌ Create product error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
};

// UPDATE product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If category is being updated, verify it exists
    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Update product error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
};

// DELETE product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    console.error('❌ Delete product error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

// GET featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('❌ Get featured products error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message,
    });
  }
};

// GET products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category: categoryId, isActive: true })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('category', 'name slug');

    const total = await Product.countDocuments({ category: categoryId, isActive: true });

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Get products by category error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};