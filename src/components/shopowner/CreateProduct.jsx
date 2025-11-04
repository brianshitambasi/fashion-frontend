// src/components/shopowner/CreateProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert price to cents (if your backend expects cents)
      const submitData = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100) // Convert to cents
      };

      await productService.createProduct(submitData);
      alert('Product created successfully!');
      navigate('/shopowner/products');
    } catch (err) {
      setError(err.message || 'Failed to create product');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Add New Product</h4>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="stock" className="form-label">Stock *</label>
                      <input
                        type="number"
                        className="form-control"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Hair Styling">Hair Styling</option>
                    <option value="Hair Treatment">Hair Treatment</option>
                    <option value="Tools & Accessories">Tools & Accessories</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Product Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/shopowner/products')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;