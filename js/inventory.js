/**
 * Inventory Management System
 * Core functionality for inventory management
 */



// Inventory data - will be loaded from localStorage or use defaults
let inventoryItems = [];

// DOM elements
let inventoryTableBody;
let addItemBtn;
let itemModal;
let closeModal;
let itemForm;
let deleteModal;
let cancelDelete;
let confirmDelete;

// Stats elements
let totalItemsEl;
let totalValueEl;
let lowStockItemsEl;

let currentItemId = null;

// Initialize the dashboard
function initDashboard() {
    console.log("Initializing dashboard...");
    
    // Load inventory data from localStorage
    loadInventoryData();
    
    // Stats elements
    totalItemsEl = document.getElementById('totalItems');
    totalValueEl = document.getElementById('totalValue');
    lowStockItemsEl = document.getElementById('lowStockItems');
    
    // Update stats if elements exist
    if (totalItemsEl && totalValueEl && lowStockItemsEl) {
        updateStats();
    }
    
    // Check which page we're on
    const isDashboardPage = window.location.pathname.includes('dashboard.html') || 
                          window.location.pathname.endsWith('/') || 
                          window.location.pathname.endsWith('/dashboard');
    
    const isInventoryPage = window.location.pathname.includes('inventory.html');
    
    if (isDashboardPage) {
        console.log("On dashboard page, initializing dashboard components");
        // We're on the dashboard - render dashboard components
        renderLowStockItems();
        renderRecentItems();
        updateCategoryChart();
        updateStatusChart();
    } 
    
    if (isInventoryPage) {
        console.log("On inventory page, initializing inventory components");
        // Get inventory page elements
        inventoryTableBody = document.getElementById('inventoryTableBody');
        
        // Check URL parameters for filters
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        const sortParam = urlParams.get('sort');
        
        // Apply URL parameters to filters if they exist
        if (filterParam) {
            const statusFilter = document.getElementById('statusFilter');
            if (statusFilter && filterParam === 'low-stock') {
                statusFilter.value = 'low-stock';
            } else if (statusFilter && filterParam === 'out-of-stock') {
                statusFilter.value = 'out-of-stock';
            }
        }
        
        if (sortParam) {
            const sortBy = document.getElementById('sortBy');
            if (sortBy && sortParam === 'recent') {
                // Add "recent" option if it doesn't exist
                if (!Array.from(sortBy.options).some(option => option.value === 'recent')) {
                    const option = document.createElement('option');
                    option.value = 'recent';
                    option.textContent = 'Most Recent';
                    sortBy.appendChild(option);
                }
                sortBy.value = 'recent';
            }
        }
        
        // Render inventory table if we're on the inventory page
        if (inventoryTableBody) {
            // Apply filters from URL parameters
            filterInventoryItems();
        }
        
        // Add event listeners for search and filters on inventory page
        const searchInput = document.getElementById('searchInventory');
        if (searchInput) {
            searchInput.addEventListener('input', filterInventoryItems);
        }
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterInventoryItems);
        }
        
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', filterInventoryItems);
        }
        
        const sortBySelect = document.getElementById('sortBy');
        if (sortBySelect) {
            sortBySelect.addEventListener('change', filterInventoryItems);
        }
    }
    
    // Modal elements and event listeners (for both pages)
    addItemBtn = document.getElementById('addItemBtn');
    itemModal = document.getElementById('itemModal');
    closeModal = document.getElementById('closeModal');
    itemForm = document.getElementById('itemForm');
    deleteModal = document.getElementById('deleteModal');
    cancelDelete = document.getElementById('cancelDelete');
    confirmDelete = document.getElementById('confirmDelete');
    
    // Add event listeners if elements exist
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => openItemModal());
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeItemModal);
    }
    
    if (itemForm) {
        itemForm.addEventListener('submit', handleItemFormSubmit);
    }
    
    if (cancelDelete) {
        cancelDelete.addEventListener('click', closeDeleteModal);
    }
    
    if (confirmDelete) {
        confirmDelete.addEventListener('click', handleDeleteItem);
    }
}

// Get current user ID
function getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser ? currentUser.id : null;
}

// Load inventory data from localStorage for current user
function loadInventoryData() {
    const userId = getCurrentUserId();
    if (!userId) {
        console.log("No user logged in, cannot load inventory");
        inventoryItems = [];
        return;
    }
    
    const savedInventory = localStorage.getItem(`inventory_${userId}`);
    inventoryItems = savedInventory ? JSON.parse(savedInventory) : [];
    console.log(`Loaded ${inventoryItems.length} items for user ${userId}`);
}

// Save inventory data to localStorage for current user
function saveInventoryData() {
    const userId = getCurrentUserId();
    if (!userId) {
        console.log("No user logged in, cannot save inventory");
        return;
    }
    
    localStorage.setItem(`inventory_${userId}`, JSON.stringify(inventoryItems));
    console.log(`Saved ${inventoryItems.length} items for user ${userId}`);
}

// Render the inventory table
function renderInventoryTable() {
    if (!inventoryTableBody) return;
    
    if (inventoryItems.length === 0) {
        inventoryTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                    No inventory items found. Add some items to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    inventoryTableBody.innerHTML = '';
    
    inventoryItems.forEach(item => {
        const totalValue = item.quantity * item.price;
        const statusClass = item.status === 'in-stock' ? 'bg-green-100 text-green-800' : 
                           item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-red-100 text-red-800';
                           
        const statusText = item.status === 'in-stock' ? 'In Stock' : 
                          item.status === 'low-stock' ? 'Low Stock' : 
                          'Out of Stock';
                          
        // Format category for display (capitalize first letter)
        const formattedCategory = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${item.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${formattedCategory}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.description}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.quantity}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">₱${item.price.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">₱${totalValue.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-brand-blue hover:text-brand-lightblue mr-3" onclick="openItemModal('${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800" onclick="openDeleteModal('${item.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        inventoryTableBody.appendChild(row);
    });
    
    const itemCountElement = document.getElementById('itemCount');
    if (itemCountElement) {
        itemCountElement.textContent = inventoryItems.length;
    }
}

// Update dashboard stats
function updateStats() {
    console.log("Updating stats...");
    
    if (!totalItemsEl || !totalValueEl || !lowStockItemsEl) {
        console.log("Stats elements not found");
        return;
    }
    
    // Calculate total items
    totalItemsEl.textContent = inventoryItems.length;
    
    // Calculate total value
    const totalValue = inventoryItems.reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);
    totalValueEl.textContent = `₱${totalValue.toFixed(2)}`;
    
    // Count low stock items
    const lowStockCount = inventoryItems.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;
    lowStockItemsEl.textContent = lowStockCount;
    
    console.log("Stats updated:", { 
        totalItems: inventoryItems.length, 
        totalValue: totalValue.toFixed(2), 
        lowStockCount 
    });
}

// Render low stock items on dashboard
function renderLowStockItems() {
    console.log("Rendering low stock items...");
    const lowStockTable = document.getElementById('lowStockTable');
    if (!lowStockTable) {
        console.log("Low stock table not found");
        return;
    }
    
    // Get low stock items
    const lowStockItems = inventoryItems.filter(item => 
        item.status === 'low-stock' || item.status === 'out-of-stock'
    ).slice(0, 5); // Show at most 5 items
    
    if (lowStockItems.length === 0) {
        lowStockTable.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    No low stock items found.
                </td>
            </tr>
        `;
        return;
    }
    
    lowStockTable.innerHTML = '';
    
    lowStockItems.forEach(item => {
        const statusClass = item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
        const statusText = item.status === 'low-stock' ? 'Low Stock' : 'Out of Stock';
        const formattedCategory = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${item.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${formattedCategory}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.quantity}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </td>
        `;
        
        lowStockTable.appendChild(row);
    });
    
    console.log(`${lowStockItems.length} low stock items rendered`);
}

// Render recently added items on dashboard
function renderRecentItems() {
    console.log("Rendering recent items...");
    const recentItemsTable = document.getElementById('recentItemsTable');
    if (!recentItemsTable) {
        console.log("Recent items table not found");
        return;
    }
    
    // Sort items by dateAdded property
    const recentItems = [...inventoryItems]
        .sort((a, b) => {
            // Use dateAdded if available, otherwise fallback to id
            const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(parseInt(a.id));
            const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(parseInt(b.id));
            return dateB - dateA;
        })
        .slice(0, 5); // Show at most 5 items
    
    if (recentItems.length === 0) {
        recentItemsTable.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                    No recent items found.
                </td>
            </tr>
        `;
        return;
    }
    
    recentItemsTable.innerHTML = '';
    
    recentItems.forEach(item => {
        const totalValue = item.quantity * item.price;
        const formattedCategory = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        // Use dateAdded if available, otherwise use id to create date
        const itemDate = item.dateAdded ? new Date(item.dateAdded) : new Date(parseInt(item.id));
        const formattedDate = itemDate.toLocaleDateString();
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${item.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${formattedCategory}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">₱${totalValue.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${formattedDate}</div>
            </td>
        `;
        
        recentItemsTable.appendChild(row);
    });
    
    console.log(`${recentItems.length} recent items rendered`);
}

// Update category chart on dashboard
function updateCategoryChart() {
    console.log("Updating category chart...");
    
    // Get categories count
    const categories = {
        'electronics': 0,
        'clothing': 0,
        'food': 0,
        'other': 0
    };
    
    inventoryItems.forEach(item => {
        if (categories[item.category] !== undefined) {
            categories[item.category]++;
        } else {
            categories.other++;
        }
    });
    
    // Update category count elements
    Object.keys(categories).forEach(category => {
        const countElement = document.getElementById(`${category}-count`);
        if (countElement) {
            countElement.textContent = categories[category];
        }
    });
    
    console.log("Category counts:", categories);
}

// Update status chart on dashboard
function updateStatusChart() {
    console.log("Updating status chart...");
    
    // Count items by status
    const statusCounts = {
        'in-stock': 0,
        'low-stock': 0,
        'out-of-stock': 0
    };
    
    inventoryItems.forEach(item => {
        if (statusCounts[item.status] !== undefined) {
            statusCounts[item.status]++;
        }
    });
    
    const totalItems = inventoryItems.length;
    
    // Calculate percentages
    const percentages = {
        'in-stock': totalItems > 0 ? Math.round((statusCounts['in-stock'] / totalItems) * 100) : 0,
        'low-stock': totalItems > 0 ? Math.round((statusCounts['low-stock'] / totalItems) * 100) : 0,
        'out-of-stock': totalItems > 0 ? Math.round((statusCounts['out-of-stock'] / totalItems) * 100) : 0
    };
    
    // Update status bars and percentages
    Object.keys(percentages).forEach(status => {
        const percentElement = document.getElementById(`${status}-percent`);
        const barElement = document.getElementById(`${status}-bar`);
        
        if (percentElement) {
            percentElement.textContent = `${percentages[status]}%`;
        }
        
        if (barElement) {
            barElement.style.width = `${percentages[status]}%`;
        }
    });
    
    // Update total summary
    const totalSummaryElement = document.getElementById('total-summary');
    if (totalSummaryElement) {
        totalSummaryElement.textContent = `Total: ${totalItems} items`;
    }
    
    console.log("Status percentages:", percentages);
}

// Filter inventory items based on search and filters
function filterInventoryItems() {
    if (!inventoryTableBody) return;
    
    // Get filter values
    const searchInputEl = document.getElementById('searchInventory');
    const categoryFilterEl = document.getElementById('categoryFilter');
    const statusFilterEl = document.getElementById('statusFilter');
    const sortByEl = document.getElementById('sortBy');
    
    if (!searchInputEl || !categoryFilterEl || !sortByEl) {
        console.error("Filter elements not found");
        return;
    }
    
    const searchTerm = searchInputEl.value.toLowerCase();
    const categoryFilter = categoryFilterEl.value;
    const statusFilter = statusFilterEl ? statusFilterEl.value : '';
    const sortBy = sortByEl.value;
    
    console.log("Filtering inventory with:", { 
        searchTerm, 
        categoryFilter, 
        statusFilter, 
        sortBy 
    });
    
    // Filter items
    let filteredItems = inventoryItems.filter(item => {
        // Search term filter
        const matchesSearch = searchTerm === '' || 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
        
        // Status filter
        const matchesStatus = statusFilter === '' || item.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    console.log(`Found ${filteredItems.length} items matching filters`);
    
    // Sort items
    filteredItems.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'quantity':
                return b.quantity - a.quantity;
            case 'price':
                return b.price - a.price;
            case 'recent':
                // Use dateAdded if available, otherwise fallback to id
                const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(parseInt(a.id));
                const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(parseInt(b.id));
                return dateB - dateA;
            default:
                return 0;
        }
    });
    
    // Render filtered items
    renderItems(filteredItems);
    
    // Update item count
    const itemCountElement = document.getElementById('itemCount');
    if (itemCountElement) {
        itemCountElement.textContent = filteredItems.length;
    }
    
    // Update URL parameters to reflect current filter state (without reloading the page)
    let newUrl = new URL(window.location.href);
    let params = new URLSearchParams(newUrl.search);
    
    // Only add parameters if they have values
    if (statusFilter) {
        params.set('filter', statusFilter);
    } else {
        params.delete('filter');
    }
    
    if (sortBy === 'recent') {
        params.set('sort', 'recent');
    } else {
        params.delete('sort');
    }
    
    newUrl.search = params.toString();
    window.history.replaceState({}, '', newUrl.toString());
}

// Render specific items to the table
function renderItems(items) {
    if (!inventoryTableBody) return;
    
    if (items.length === 0) {
        inventoryTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                    No inventory items found. Add some items to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    inventoryTableBody.innerHTML = '';
    
    items.forEach(item => {
        const totalValue = item.quantity * item.price;
        const statusClass = item.status === 'in-stock' ? 'bg-green-100 text-green-800' : 
                           item.status === 'low-stock' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-red-100 text-red-800';
                           
        const statusText = item.status === 'in-stock' ? 'In Stock' : 
                          item.status === 'low-stock' ? 'Low Stock' : 
                          'Out of Stock';
                          
        // Format category for display (capitalize first letter)
        const formattedCategory = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${item.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">${formattedCategory}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.description}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.quantity}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">₱${item.price.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">₱${totalValue.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-brand-blue hover:text-brand-lightblue mr-3" onclick="openItemModal('${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800" onclick="openDeleteModal('${item.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        inventoryTableBody.appendChild(row);
    });
}

// Open the item modal for adding or editing
function openItemModal(itemId = null) {
    itemForm.reset();
    document.getElementById('itemId').value = '';
    
    if (itemId) {
        // Edit existing item
        const item = inventoryItems.find(item => item.id === itemId);
        if (item) {
            document.getElementById('modalTitle').textContent = 'Edit Item';
            document.getElementById('itemId').value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemDescription').value = item.description;
            document.getElementById('itemQuantity').value = item.quantity;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemStatus').value = item.status;
        }
    } else {
        // Add new item
        document.getElementById('modalTitle').textContent = 'Add New Item';
    }
    
    itemModal.classList.remove('hidden');
    itemModal.classList.add('flex');
}

// Close the item modal
function closeItemModal() {
    itemModal.classList.add('hidden');
    itemModal.classList.remove('flex');
}

// Handle item form submission
function handleItemFormSubmit(event) {
    event.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const description = document.getElementById('itemDescription').value;
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const price = parseFloat(document.getElementById('itemPrice').value);
    const status = document.getElementById('itemStatus').value;
    
    if (itemId) {
        // Update existing item
        const index = inventoryItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
            inventoryItems[index] = {
                ...inventoryItems[index],
                name,
                category,
                description,
                quantity,
                price,
                status
            };
            
            // Show notification if function exists
            if (window.showNotification) {
                window.showNotification('Item successfully updated', 'success');
            }
        }
    } else {
        // Add new item
        const newItem = {
            id: Date.now().toString(),
            name,
            category,
            description,
            quantity,
            price,
            status,
            dateAdded: new Date().toISOString() // Add real date for sorting
        };
        
        inventoryItems.push(newItem);
        
        // Show notification if function exists
        if (window.showNotification) {
            window.showNotification('New item successfully added', 'success');
        }
    }
    
    // Save changes to localStorage
    saveInventoryData();
    
    closeItemModal();
    
    // Update all dashboard displays if we're on the dashboard page
    if (window.location.pathname.includes('dashboard.html') || 
        window.location.pathname.endsWith('/') || 
        window.location.pathname.endsWith('/dashboard')) {
        updateStats();
        renderLowStockItems();
        renderRecentItems();
        updateCategoryChart();
        updateStatusChart();
    }
    
    // Update inventory table if we're on the inventory page
    if (window.location.pathname.includes('inventory.html')) {
        renderInventoryTable();
    }
}

// Open delete confirmation modal
function openDeleteModal(itemId) {
    currentItemId = itemId;
    
    deleteModal.classList.remove('hidden');
    deleteModal.classList.add('flex');
}

// Close delete confirmation modal
function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
    currentItemId = null;
}

// Handle item deletion
function handleDeleteItem() {
    if (currentItemId) {
        const index = inventoryItems.findIndex(item => item.id === currentItemId);
        if (index !== -1) {
            // Find the row in the table to animate it
            const itemRow = document.querySelector(`tr button[onclick="openDeleteModal('${currentItemId}')"]`).closest('tr');
            
            // Animate the row removal if animation function exists
            if (window.animateDeleteItem && itemRow) {
                window.animateDeleteItem(itemRow);
            }
            
            // Remove the item from the data array
            inventoryItems.splice(index, 1);
            
            // Save changes to localStorage
            saveInventoryData();
            
            // Show success notification if function exists
            if (window.showNotification) {
                window.showNotification('Item successfully deleted', 'success');
            }
        }
        
        closeDeleteModal();
        
        // Update all dashboard displays if we're on the dashboard page
        if (window.location.pathname.includes('dashboard.html') || 
            window.location.pathname.endsWith('/') || 
            window.location.pathname.endsWith('/dashboard')) {
            updateStats();
            renderLowStockItems();
            renderRecentItems();
            updateCategoryChart();
            updateStatusChart();
        }
        
        // Update inventory table if we're on the inventory page and no animation
        if (window.location.pathname.includes('inventory.html') && (!window.animateDeleteItem)) {
            renderInventoryTable();
        }
    }
}

// Expose functions to be used in HTML
window.openItemModal = openItemModal;
window.openDeleteModal = openDeleteModal;
window.initDashboard = initDashboard; 
