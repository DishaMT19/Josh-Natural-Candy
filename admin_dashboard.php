<?php
session_start();
if (!isset($_SESSION['admin_logged_in'])) {
  header("Location: admin_login.html");
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Admin Dashboard - Josh Candy</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
  <style>
    :root {
      --primary-color: #6a11cb;
      --secondary-color: #2575fc;
      --success-color: #28a745;
      --danger-color: #dc3545;
      --dark-color: #343a40;
      --light-color: #f8f9fa;
    }
    
    body {
      background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
                  url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80');
      background-size: cover;
      background-attachment: fixed;
      color: #fff;
      min-height: 100vh;
    }
    
    .navbar {
      background: rgba(0, 0, 0, 0.8) !important;
      backdrop-filter: blur(10px);
    }
    
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 10px;
      transition: transform 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
    }
    
    .card-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 600;
    }
    
    .nav-tabs {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .nav-tabs .nav-link {
      color: rgba(255, 255, 255, 0.7);
      border: none;
      padding: 10px 20px;
      border-radius: 5px 5px 0 0;
    }
    
    .nav-tabs .nav-link.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.2);
      border-bottom: 2px solid var(--secondary-color);
    }
    
    .form-control {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    
    .form-control:focus {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border-color: var(--secondary-color);
      box-shadow: 0 0 0 0.25rem rgba(106, 17, 203, 0.25);
    }
    
    .btn-outline-light {
      border-color: rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.8);
    }
    
    .btn-outline-light:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .toast-container {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 9999;
    }
    
    .modal-content {
      background: rgba(0, 0, 0, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
    }
    
    .table {
      color: #fff;
    }
    
    .table th {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .table td {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .badge {
      font-weight: 500;
    }
    
    .product-item {
      transition: all 0.3s ease;
    }
    
    .product-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .order-card {
      position: relative;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
    }
    
    .order-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--secondary-color);
    }
    
    .order-status {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 0.8rem;
    }
    
    .product-img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      background-color: #f8f9fa;
    }
    
    .img-placeholder {
      background-color: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6c757d;
      font-size: 12px;
    }
    
    .order-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .order-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
  </style>
</head>
<body>
  <!-- Sticky Header -->
  <nav class="navbar fixed-top navbar-dark px-3 py-2">
    <div class="container-fluid">
      <span class="navbar-brand d-flex align-items-center">
        <i class="bi bi-candy text-warning me-2"></i>
        <span class="fw-bold">Josh Candy Admin</span>
      </span>
      <div>
        <span class="me-3 d-none d-md-inline">Welcome, Admin</span>
        <a href="backend/logout.php" class="btn btn-sm btn-outline-light">
          <i class="bi bi-box-arrow-right"></i> Logout
        </a>
      </div>
    </div>
  </nav>

  <div class="container mt-5 pt-4 pb-5">
    <!-- Dashboard Stats -->
    <div class="row mb-4" id="dashboardStats">
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="bg-primary bg-opacity-25 rounded p-3 me-3">
              <i class="bi bi-people-fill fs-3"></i>
            </div>
            <div>
              <h6 class="mb-1">Total Users</h6>
              <h3 class="mb-0" id="totalUsers">0</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="bg-success bg-opacity-25 rounded p-3 me-3">
              <i class="bi bi-box-seam fs-3"></i>
            </div>
            <div>
              <h6 class="mb-1">Total Products</h6>
              <h3 class="mb-0" id="totalProducts">0</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body d-flex align-items-center">
            <div class="bg-info bg-opacity-25 rounded p-3 me-3">
              <i class="bi bi-receipt fs-3"></i>
            </div>
            <div>
              <h6 class="mb-1">Total Orders</h6>
              <h3 class="mb-0" id="totalOrders">0</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nav Tabs -->
    <ul class="nav nav-tabs mb-4" id="adminTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button">
          <i class="bi bi-people-fill me-1"></i> Users
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="products-tab" data-bs-toggle="tab" data-bs-target="#products" type="button">
          <i class="bi bi-box-seam me-1"></i> Products
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button">
          <i class="bi bi-receipt me-1"></i> Orders
        </button>
      </li>
    </ul>

    <div class="tab-content">
      <!-- Users Tab -->
      <div class="tab-pane fade show active" id="users" role="tabpanel">
        <div class="card shadow">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-people-fill me-2"></i>Registered Users</span>
            <div class="input-group" style="width: 300px;">
              <input type="text" id="userSearch" class="form-control form-control-sm" placeholder="Search users...">
              <button class="btn btn-sm btn-outline-secondary" type="button">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="userList">
                  <tr>
                    <td colspan="4" class="text-center">Loading users...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Tab -->
      <div class="tab-pane fade" id="products" role="tabpanel">
        <div class="row">
          <!-- Add Product -->
          <div class="col-lg-5 mb-4">
            <div class="card shadow h-100">
              <div class="card-header bg-success bg-opacity-25">
                <i class="bi bi-plus-circle me-2"></i>Add New Product
              </div>
              <div class="card-body">
                <form id="productForm">
                  <div class="mb-3">
                    <label for="prodName" class="form-label">Product Name</label>
                    <input type="text" id="prodName" class="form-control" placeholder="e.g. Gummy Bears" required>
                  </div>
                  <div class="mb-3">
                    <label for="prodDesc" class="form-label">Description</label>
                    <textarea id="prodDesc" class="form-control" rows="2" placeholder="Product description"></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="prodPrice" class="form-label">Price (₹)</label>
                    <input type="number" id="prodPrice" class="form-control" placeholder="0.00" step="0.01" required>
                  </div>
                  <div class="mb-3">
                    <label for="prodImage" class="form-label">Image URL</label>
                    <input type="text" id="prodImage" class="form-control" placeholder="https://example.com/image.jpg">
                  </div>
                  <button type="submit" class="btn btn-success w-100">
                    <i class="bi bi-save me-1"></i> Add Product
                  </button>
                </form>
                <div id="prodMsg" class="text-success mt-2"></div>
              </div>
            </div>
          </div>

          <!-- Product List -->
          <div class="col-lg-7">
            <div class="card shadow">
              <div class="card-header d-flex justify-content-between align-items-center">
                <span><i class="bi bi-box-seam me-2"></i>Product Inventory</span>
                <div class="input-group" style="width: 250px;">
                  <input type="text" id="productSearch" class="form-control form-control-sm" placeholder="Search products...">
                  <button class="btn btn-sm btn-outline-secondary" type="button">
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="productList">
                      <tr>
                        <td colspan="4" class="text-center">Loading products...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Tab -->
      <div class="tab-pane fade" id="orders" role="tabpanel">
        <div class="card shadow">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span><i class="bi bi-receipt me-2"></i>Recent Orders</span>
            <div class="input-group" style="width: 250px;">
              <select id="orderFilter" class="form-select form-select-sm">
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div class="card-body">
            <div id="orderList">
              <div class="text-center py-4">Loading orders...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Container -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Edit Product Modal -->
  <div class="modal fade" id="editProductModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Product</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="editProductForm">
            <input type="hidden" id="editProdId">
            <div class="mb-3">
              <label for="editProdName" class="form-label">Product Name</label>
              <input type="text" id="editProdName" class="form-control" required>
            </div>
            <div class="mb-3">
              <label for="editProdDesc" class="form-label">Description</label>
              <textarea id="editProdDesc" class="form-control" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label for="editProdPrice" class="form-label">Price (₹)</label>
              <input type="number" id="editProdPrice" class="form-control" step="0.01" required>
            </div>
            <div class="mb-3">
              <label for="editProdImage" class="form-label">Image URL</label>
              <input type="text" id="editProdImage" class="form-control">
            </div>
            <div class="d-grid gap-2">
              <button type="submit" class="btn btn-primary">
                <i class="bi bi-save me-1"></i> Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    // Toast notification function
    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
      toast.setAttribute('aria-atomic', 'true');
      toast.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'danger' ? 'bi-exclamation-triangle' : 'bi-info-circle'} me-2"></i>
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
      document.getElementById('toastContainer').appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    // Load dashboard statistics
    async function loadStats() {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          fetch('backend/get_users.php'),
          fetch('backend/get_products.php'),
          fetch('backend/get_orders.php')
        ]);
        
        const users = await usersRes.json();
        const products = await productsRes.json();
        const orders = await ordersRes.json();
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalOrders').textContent = orders.length;
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }

    // Users functions
    async function loadUsers() {
      try {
        const res = await fetch('backend/get_users.php');
        const users = await res.json();
        
        let html = '';
        if (users.length === 0) {
          html = `<tr><td colspan="4" class="text-center">No users found</td></tr>`;
        } else {
          html = users.map((user, index) => `
            <tr class="product-item">
              <td>${index + 1}</td>
              <td><strong>${user.name}</strong></td>
              <td>${user.email}</td>
              <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id || index + 1})">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          `).join('');
        }
        
        document.getElementById('userList').innerHTML = html;
      } catch (error) {
        document.getElementById('userList').innerHTML = `
          <tr><td colspan="4" class="text-center text-danger">Error loading users</td></tr>
        `;
        console.error('Error loading users:', error);
      }
    }

    async function deleteUser(id) {
      if (!confirm("Are you sure you want to delete this user?")) return;
      
      try {
        const res = await fetch('backend/delete_user.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const result = await res.json();
        
        if (result.status === 'success') {
          showToast('User deleted successfully');
          loadUsers();
          loadStats();
        } else {
          showToast(result.message || 'Failed to delete user', 'danger');
        }
      } catch (error) {
        showToast('Error deleting user', 'danger');
        console.error('Error deleting user:', error);
      }
    }

    // Products functions
    async function loadProducts() {
      try {
        const res = await fetch('backend/get_products.php');
        const products = await res.json();
        
        let html = '';
        if (products.length === 0) {
          html = `<tr><td colspan="4" class="text-center">No products found</td></tr>`;
        } else {
          html = products.map(p => `
            <tr class="product-item">
              <td>
                <img src="${p.image || 'https://via.placeholder.com/40?text=No+Image'}" 
                     class="product-img" alt="${p.name}">
              </td>
              <td>
                <div><strong>${p.name}</strong></div>
                <small class="text-muted">${p.description ? p.description.substring(0, 50) + (p.description.length > 50 ? '...' : '') : 'No description'}</small>
              </td>
              <td>₹${parseFloat(p.price).toFixed(2)}</td>
              <td>
                <div class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-primary" onclick='showEditModal(${JSON.stringify(p)})'>
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${p.id})">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `).join('');
        }
        
        document.getElementById('productList').innerHTML = html;
      } catch (error) {
        document.getElementById('productList').innerHTML = `
          <tr><td colspan="4" class="text-center text-danger">Error loading products</td></tr>
        `;
        console.error('Error loading products:', error);
      }
    }

    async function deleteProduct(id) {
      if (!confirm("Are you sure you want to delete this product?")) return;
      
      try {
        const res = await fetch('backend/delete_product.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const result = await res.json();
        
        if (result.status === 'success') {
          showToast('Product deleted successfully');
          loadProducts();
          loadStats();
        } else {
          showToast(result.message || 'Failed to delete product', 'danger');
        }
      } catch (error) {
        showToast('Error deleting product', 'danger');
        console.error('Error deleting product:', error);
      }
    }

    function showEditModal(product) {
      document.getElementById('editProdId').value = product.id;
      document.getElementById('editProdName').value = product.name;
      document.getElementById('editProdDesc').value = product.description || '';
      document.getElementById('editProdPrice').value = product.price;
      document.getElementById('editProdImage').value = product.image || '';
      
      const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
      modal.show();
    }

    document.getElementById('editProductForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const id = document.getElementById('editProdId').value;
      const name = document.getElementById('editProdName').value;
      const description = document.getElementById('editProdDesc').value;
      const price = document.getElementById('editProdPrice').value;
      const image = document.getElementById('editProdImage').value;
      
      try {
        const res = await fetch('backend/update_product.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name, description, price, image })
        });
        const result = await res.json();
        
        if (result.status === 'success') {
          showToast('Product updated successfully');
          bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
          loadProducts();
        } else {
          showToast(result.message || 'Failed to update product', 'danger');
        }
      } catch (error) {
        showToast('Error updating product', 'danger');
        console.error('Error updating product:', error);
      }
    });

    document.getElementById('productForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('prodName').value;
      const description = document.getElementById('prodDesc').value;
      const price = document.getElementById('prodPrice').value;
      const image = document.getElementById('prodImage').value;
      
      try {
        const res = await fetch('backend/add_product.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, price, image })
        });
        const result = await res.json();
        
        if (result.status === 'success') {
          showToast('Product added successfully');
          document.getElementById('productForm').reset();
          loadProducts();
          loadStats();
        } else {
          showToast(result.message || 'Failed to add product', 'danger');
        }
      } catch (error) {
        showToast('Error adding product', 'danger');
        console.error('Error adding product:', error);
      }
    });

    // Orders functions 
    async function loadOrders(filter = 'all') {
      try {
        const res = await fetch('backend/get_orders.php');
        const orders = await res.json();
        const productRes = await fetch('backend/get_products.php');
        let allProducts = await productRes.json();
        if (!Array.isArray(allProducts)) {
          console.error('Expected product list to be an array:', allProducts);
          allProducts = [];
        }

        let filteredOrders = orders;
        if (filter === 'pending') {
          filteredOrders = orders.filter(o => o.status !== 'completed');
        } else if (filter === 'completed') {
          filteredOrders = orders.filter(o => o.status === 'completed');
        }

        let html = '';
        if (filteredOrders.length === 0) {
          html = `<div class="text-center py-4">No orders found</div>`;
        } else {
          html = filteredOrders.map(o => {
            let itemHtml = '';
            
            // Parse the items array from the order
           let items = [];
            try {
              if (typeof o.items === 'string') {
                const parsed = JSON.parse(o.items);
                items = Array.isArray(parsed) ? parsed : Object.values(parsed);
              } else if (Array.isArray(o.items)) {
                items = o.items;
              } else if (typeof o.items === 'object' && o.items !== null) {
                items = Object.values(o.items);
              }
            } catch (e) {
              console.error('Error parsing order items:', o.items, e);
              itemHtml = `<div class="text-danger">Error loading order items</div>`;
            }

            // Generate HTML for each item
            if (items.length > 0) {
              itemHtml = items.map(it => {
                const productId = it.product_id || it.id; // Handle different property names
                const prod = allProducts.find(p => Number(p.id) === Number(productId));
                
                if (!prod) {
                  return `
                    <div class="order-item">
                      <div class="flex-grow-1">
                        <div class="text-danger">❌ Unknown Product (ID: ${productId})</div>
                        <small>Quantity: ${it.quantity || it.qty || 1}</small>
                      </div>
                    </div>
                  `;
                }
                
                return `
                  <div class="order-item">
                    <img src="${prod.image || 'https://via.placeholder.com/40?text=No+Image'}" 
                         class="product-img me-3" alt="${prod.name}">
                    <div class="flex-grow-1">
                      <div><strong>${prod.name}</strong></div>
                      <small>Quantity: ${it.quantity || it.qty || 1} × ₹${parseFloat(prod.price).toFixed(2)}</small>
                    </div>
                    <div class="text-end">
                      <strong>₹${parseFloat((it.quantity || it.qty || 1) * prod.price).toFixed(2)}</strong>
                    </div>
                  </div>
                `;
              }).join('');
            } else {
              itemHtml = `<div class="text-danger">No items in this order</div>`;
            }

            return `
              <div class="order-card">
                <div class="order-status">
                  ${o.status === 'completed' 
                    ? '<span class="badge bg-success">Completed</span>' 
                    : '<span class="badge bg-warning text-dark">Pending</span>'}
                </div>
                <div class="mb-3">
                  <h6 class="mb-2">Order #${o.id}</h6>
                  ${itemHtml}
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div><strong>Total:</strong> ₹${parseFloat(o.total || o.amount || 0).toFixed(2)}</div>
                    <div><small class="text-muted">${o.user_name || 'Guest'} • ${o.created_at || o.date || ''}</small></div>
                  </div>
                  <div>
                   ${o.status !== 'completed'
                ? `<button class="btn btn-sm btn-success" onclick="markOrderComplete(${o.id})">
                    <i class="bi bi-check-circle me-1"></i> Complete
                  </button>`
                : ''}

                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
        
        document.getElementById('orderList').innerHTML = html;
      } catch (error) {
        document.getElementById('orderList').innerHTML = `
          <div class="text-center py-4 text-danger">Error loading orders</div>
        `;
        console.error('Error loading orders:', error);
      }
    }


    
    async function markOrderComplete(id) {
      if (!confirm("Mark this order as completed?")) return;
      
      try {
        const res = await fetch('backend/update_order_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, status: 'completed' })
        });
        const result = await res.json();
        
        if (result.status === 'success') {
          showToast('Order marked as completed');
          loadOrders(document.getElementById('orderFilter').value);
        } else {
          showToast(result.message || 'Failed to update order', 'danger');
        }
      } catch (error) {
        showToast('Error updating order', 'danger');
        console.error('Error updating order:', error);
      }
    }

    // Initialize the dashboard
    document.addEventListener('DOMContentLoaded', function() {
      loadStats();
      loadUsers();
      loadProducts();
      loadOrders();
      
      // Set up event listeners for filters
      document.getElementById('orderFilter').addEventListener('change', function() {
        loadOrders(this.value);
      });
    });
  </script>
</body>
</html>