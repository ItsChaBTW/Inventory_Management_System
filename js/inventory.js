/**
 * Inventory Management System
 * Core functionality for inventory management
 */

// Sample default inventory data
const defaultInventory = [
    {
        id: '1',
        name: 'Laptop',
        category: 'electronics',
        description: 'High performance laptop with 16GB RAM',
        quantity: 5,
        price: 1200,
        status: 'in-stock'
    },
    {
        id: '2',
        name: 'T-Shirt',
        category: 'clothing',
        description: 'Cotton t-shirt, available in multiple colors',
        quantity: 50,
        price: 25,
        status: 'in-stock'
    },
    {
        id: '3',
        name: 'Coffee Beans',
        category: 'food',
        description: 'Premium coffee beans, 1kg package',
        quantity: 2,
        price: 15,
        status: 'low-stock'
    }
];

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
    // Get DOM elements
    inventoryTableBody = document.getElementById('inventoryTableBody');
    addItemBtn = document.getElementById('addItemBtn');
    itemModal = document.getElementById('itemModal');
    closeModal = document.getElementById('closeModal');
    itemForm = document.getElementById('itemForm');
    deleteModal = document.getElementById('deleteModal');
    cancelDelete = document.getElementById('cancelDelete');
    confirmDelete = document.getElementById('confirmDelete');
    
    // Stats elements
    totalItemsEl = document.getElementById('totalItems');
    totalValueEl = document.getElementById('totalValue');
    lowStockItemsEl = document.getElementById('lowStockItems');
    
    // Load inventory data from localStorage
    loadInventoryData();
    
    // Render the inventory table
    renderInventoryTable();
    updateStats();
    
    // Event listeners
    addItemBtn.addEventListener('click', () => openItemModal());
    closeModal.addEventListener('click', closeItemModal);
    itemForm.addEventListener('submit', handleItemFormSubmit);
    cancelDelete.addEventListener('click', closeDeleteModal);
    confirmDelete.addEventListener('click', handleDeleteItem);
}

// Load inventory data from localStorage
function loadInventoryData() {
    const savedInventory = localStorage.getItem('inventoryItems');
    
    if (savedInventory) {
        // Use saved inventory data if available
        inventoryItems = JSON.parse(savedInventory);
    } else {
        // Use default data if no saved data exists
        inventoryItems = [...defaultInventory];
        // Save default data to localStorage
        saveInventoryData();
    }
}

// Save inventory data to localStorage
function saveInventoryData() {
    localStorage.setItem('inventoryItems', JSON.stringify(inventoryItems));
}

// Render the inventory table
function renderInventoryTable() {
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
                <div class="text-sm text-gray-900">$${item.price.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">$${totalValue.toFixed(2)}</div>
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
    
    document.getElementById('itemCount').textContent = inventoryItems.length;
}

// Update dashboard stats
function updateStats() {
    // Calculate total items
    totalItemsEl.textContent = inventoryItems.length;
    
    // Calculate total value
    const totalValue = inventoryItems.reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);
    totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
    
    // Count low stock items
    const lowStockCount = inventoryItems.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;
    lowStockItemsEl.textContent = lowStockCount;
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
            status
        };
        
        inventoryItems.push(newItem);
    }
    
    // Save changes to localStorage
    saveInventoryData();
    
    closeItemModal();
    renderInventoryTable();
    updateStats();
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
            inventoryItems.splice(index, 1);
            
            // Save changes to localStorage
            saveInventoryData();
        }
        
        closeDeleteModal();
        renderInventoryTable();
        updateStats();
    }
}

// Expose functions to be used in HTML
window.openItemModal = openItemModal;
window.openDeleteModal = openDeleteModal;
window.initDashboard = initDashboard; 