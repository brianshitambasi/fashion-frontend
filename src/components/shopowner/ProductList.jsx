// src/components/shopowner/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        setProducts(products.filter(product => product._id !== productId));
        alert('Product deleted successfully');
      } catch (err) {
        alert('Failed to delete product');
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) return <div className="text-center">Loading products...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Products</h3>
        <Link to="/shopowner/products/create" className="btn btn-primary">
          + Add New Product
        </Link>
      </div>

      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description}</p>
                <div className="mb-2">
                  <strong>Price: </strong>${(product.price / 100).toFixed(2)}
                </div>
                <div className="mb-2">
                  <strong>Category: </strong>{product.category}
                </div>
                <div className="mb-3">
                  <strong>Stock: </strong>{product.stock}
                </div>
                <div className="d-flex gap-2">
                  <Link 
                    to={`/shopowner/products/edit/${product._id}`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-5">
          <h5>No products found</h5>
          <p>Start by adding your first product!</p>
          <Link to="/shopowner/products/create" className="btn btn-primary">
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;