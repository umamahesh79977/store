// Check if admin is logged in
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'admin-login.html';
}

// Load all orders on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAllOrders();
});

// Function to load all orders
function loadAllOrders() {
    document.getElementById('section-title').textContent = 'All Orders';
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    displayOrders(orders);
}

// Function to load orders by status
function loadOrdersByStatus(status) {
    const statusTitles = {
        'accepted': 'Accepted Orders',
        'rejected': 'Rejected Orders',
        'pending': 'Pending Orders'
    };
    document.getElementById('section-title').textContent = statusTitles[status] || status;
    
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const filteredOrders = allOrders.filter(order => order.status === status);
    displayOrders(filteredOrders);
}

// Function to display orders
function displayOrders(orders) {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No orders found</div></div>';
        return;
    }
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = `col-md-6 order-card ${order.status || 'pending'}`;
        
        orderCard.innerHTML = `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between">
                    <span>Order #${order.orderId}</span>
                    <span class="badge ${getStatusBadgeClass(order.status)}">
                        ${order.status || 'pending'}
                    </span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${order.customer.fullName}</h5>
                    <p class="card-text">
                        <strong>Email:</strong> ${order.customer.email}<br>
                        <strong>Phone:</strong> ${order.customer.contactNumber}<br>
                        <strong>Address:</strong> ${order.customer.address}<br>
                        <strong>Date:</strong> ${new Date(order.date).toLocaleString()}
                    </p>
                    
                    <h6>Order Items:</h6>
                    <ul class="list-group mb-3">
                        ${order.items.map(item => `
                            <li class="list-group-item d-flex justify-content-between">
                                <span>${item.name} (${item.quantity}x)</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        `).join('')}
                    </ul>
                    
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Total: $${order.total.toFixed(2)}</h5>
                        <div>
                            ${order.status !== 'accepted' ? `
                                <button class="btn btn-success btn-sm" onclick="updateOrderStatus('${order.orderId}', 'accepted')">
                                    Accept
                                </button>
                            ` : ''}
                            ${order.status !== 'rejected' ? `
                                <button class="btn btn-danger btn-sm ms-2" onclick="updateOrderStatus('${order.orderId}', 'rejected')">
                                    Reject
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(orderCard);
    });
}

// Helper function to get badge class based on status
function getStatusBadgeClass(status) {
    switch(status) {
        case 'accepted': return 'bg-success';
        case 'rejected': return 'bg-danger';
        default: return 'bg-warning text-dark';
    }
}

// Function to update order status
function updateOrderStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Reload current view
        const currentTitle = document.getElementById('section-title').textContent;
        if (currentTitle.includes('Accepted')) {
            loadOrdersByStatus('accepted');
        } else if (currentTitle.includes('Rejected')) {
            loadOrdersByStatus('rejected');
        } else if (currentTitle.includes('Pending')) {
            loadOrdersByStatus('pending');
        } else {
            loadAllOrders();
        }
    }
}

//