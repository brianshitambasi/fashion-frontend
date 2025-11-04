// src/components/shopowner/EditProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/productService';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const product = await productService.getProductById(id);
      setFormData({
        name: product.name,
        description: product.description,
        price: (product.price / 100).toFixed(2), // Convert cents to dollars
        category: product.category,
        stock: product.stock,
        image: null
      });
    } catch (err) {
      setError('Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setFetchLoading(false);
    }
  };

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
      // Convert price to cents
      const submitData = {
        ...formData,
        price: Math.round(parseFloat(formData.price) * 100)
      };

      await productService.updateProduct(id, submitData);
      alert('Product updated successfully!');
      navigate('/shopowner/products');
    } catch (err) {
      setError(err.message || 'Failed to update product');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="text-center">Loading product...</div>;

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Edit Product</h4>
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
                  <small className="text-muted">Leave empty to keep current image</small>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Product'}
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

export default EditProduct;