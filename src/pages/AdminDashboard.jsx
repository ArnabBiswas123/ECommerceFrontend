import React, { useEffect, useState } from "react";
import "./admindashboardstyles.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
    status: "In Stock",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchproducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/route/getallproduct`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await response.json();
      if (res.success === true) {
        setProducts(res.data);
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchproducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.image) newErrors.image = "Product image is required";
    if (formData.stock === "" || formData.stock < 0)
      newErrors.stock = "Valid stock quantity is required";

    return newErrors;
  };
  const validateFormEdit = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    // if (!formData.image) newErrors.image = "Product image is required";
    if (formData.stock === "" || formData.stock < 0)
      newErrors.stock = "Valid stock quantity is required";

    return newErrors;
  };

  const handleAddProduct = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("countInStock", formData.stock);
    if (formData.image) {
      form.append("file", formData.image);
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return navigate("/");
      }
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/route/addnewproduct`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const savedProduct = await response.json();

      if (savedProduct.success == true) {
        const newProduct = {
          _id: savedProduct.createdProduct._id,
          name: savedProduct.createdProduct.name,
          price: savedProduct.createdProduct.price,
          description: savedProduct.createdProduct.description,
          imageUrl: savedProduct.createdProduct.imageUrl,
          stock: savedProduct.createdProduct.countInStock,
        };

        setProducts((prev) => [...prev, newProduct]);

        resetForm();
        setShowAddForm(false);
        // setFetchAgain((prev)=>!prev)
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
      setErrors({ api: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.countInStock.toString(),
    });
    setPreviewUrl(product.imageUrl);
    setShowAddForm(true);
  };

  const handleUpdateProduct = async () => {
    const validationErrors = validateFormEdit();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("countInStock", formData.stock);
    if (formData.image) {
      form.append("file", formData.image);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      return navigate("/");
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/route/updateproduct/${editingProduct}`,
        {
          method: "PUT",
          headers: {
            // Note: no Content-Type here, browser sets multipart boundary
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const result = await response.json();
      if (result.success) {
        const updated = result.updatedProduct;
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct
              ? {
                  _id: updated._id,
                  name: updated.name,
                  price: updated.price,
                  description: updated.description,
                  imageUrl: updated.imageUrl,
                  countInStock: updated.countInStock,
                  status:
                    updated.countInStock > 0 ? "In Stock" : "Out of Stock",
                }
              : p
          )
        );

        resetForm();
        setShowAddForm(false);
        setEditingProduct(null);
      } else {
        // token expired or other error
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setErrors({ api: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      // if no token, force re-login
      localStorage.removeItem("token");
      return navigate("/");
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/route/deleteproduct/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      // you could set an error state here if you want to show it to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      description: "",
      image: "",
      stock: "",
      status: "In Stock",
    });
    setErrors({});
  };
  const handleLogout=()=>{
    localStorage.removeItem('token');
    navigate('/')
  }

  // Cancel form
  const handleCancelForm = () => {
    resetForm();
    setShowAddForm(false);
    setPreviewUrl(null);
    setEditingProduct(null);
  };



  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Manage your products</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          <button
            className="add-product-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Product
          </button>
          <div className="product-stats">
            <span className="stat">
              Total Products: <strong>{products.length}</strong>
            </span>
          </div>
        </div>

        {/* Product Form Modal */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                <button className="close-btn" onClick={handleCancelForm}>
                  ×
                </button>
              </div>

              <div className="form-container">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? "error" : ""}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`form-input ${errors.price ? "error" : ""}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  {errors.price && (
                    <span className="error-message">{errors.price}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-textarea ${
                      errors.description ? "error" : ""
                    }`}
                    placeholder="Enter product description"
                    rows="2"
                  />
                  {errors.description && (
                    <span className="error-message">{errors.description}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Product Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  {previewUrl && (
                    <div className="image-preview">
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  )}
                  {errors.image && (
                    <span className="error-message">{errors.image}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={`form-input ${errors.stock ? "error" : ""}`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.stock && (
                    <span className="error-message">{errors.stock}</span>
                  )}
                </div>

                <div className="form-actions">
                  <button className="cancel-btn" onClick={handleCancelForm}>
                    Cancel
                  </button>
                  <button
                    className="submit-btn"
                    onClick={
                      editingProduct ? handleUpdateProduct : handleAddProduct
                    }
                  >
                    {editingProduct ? (
                      isLoading ? (
                        <>
                          <span className="spinner"></span>
                          Product Updating...
                        </>
                      ) : (
                        "Update Product"
                      )
                    ) : isLoading ? (
                      <>
                        <span className="spinner"></span>
                        Product Uploading...
                      </>
                    ) : (
                      "Add product"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td className="product-name">{product.name}</td>
                  <td className="product-price">${product.price}</td>
                  <td className="product-description">{product.description}</td>
                  <td className="product-stock">{product.countInStock}</td>
                  <td className="product-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
