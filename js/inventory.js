/**
 * Inventory Management module
 * Handles CRUD operations for inventory items
 */

// Store for inventory items
let inventoryItems = [];

// DOM Elements
let tableBody;
let emptyInventoryMessage;
let itemModal;
let itemForm;
let deleteModal;
let itemIdToDelete;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize inventory store from localStorage
    loadInventoryItems();
    
    // Get DOM elements
    tableBody = document.getElementById('inventoryTableBody');
    emptyInventoryMessage = document.getElementById('emptyInventory');
    itemModal = document.getElementById('itemModal');
    itemForm = document.getElementById('itemForm');
    deleteModal = document.getElementById('deleteModal');
    
    // Set up event listeners
    document.getElementById('addItemBtn').addEventListener('click', () => openItemModal());
    document.getElementById('closeModal').addEventListener('click', closeItemModal);
    itemForm.addEventListener('submit', handleItemFormSubmit);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteItem);
    
    // Render inventory table
    renderInventoryTable();
});

/**
 * Load inventory items from localStorage
 */
function loadInventoryItems() {
    // Get current user to use their ID as part of the storage key
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Each user has their own inventory
    const storageKey = `inventory_${currentUser.id}`;
    const storedItems = localStorage.getItem(storageKey);
    
    inventoryItems = storedItems ? JSON.parse(storedItems) : [];
}

/**
 * Save inventory items to localStorage
 */
function saveInventoryItems() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    const storageKey = `inventory_${currentUser.id}`;
    localStorage.setItem(storageKey, JSON.stringify(inventoryItems));
}

/**
 * Render the inventory table with all items
 */
function renderInventoryTable() {
    if (!tableBody) return;
    
    // Clear existing table rows
    tableBody.innerHTML = '';
    
    // Show/hide empty inventory message
    if (inventoryItems.length === 0) {
        if (emptyInventoryMessage) emptyInventoryMessage.style.display = 'block';
        return;
    } else {
        if (emptyInventoryMessage) emptyInventoryMessage.style.display = 'none';
    }
    
    // Add each item to the table
    inventoryItems.forEach(item => {
        const row = document.createElement('tr');
        
        // Calculate total value
        const totalValue = (item.quantity * item.price).toFixed(2);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${item.name}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-500 line-clamp-2">${item.description || 'No description'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${item.quantity}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">$${parseFloat(item.price).toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">$${totalValue}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button data-id="${item.id}" class="edit-btn text-blue-600 hover:text-blue-900 mr-4">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button data-id="${item.id}" class="delete-btn text-red-600 hover:text-red-900">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </td>
        `;
        
        // Add event listeners to edit and delete buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => openItemModal(item.id));
        deleteBtn.addEventListener('click', () => openDeleteModal(item.id));
        
        tableBody.appendChild(row);
    });
}

/**
 * Open the item modal for adding a new item or editing an existing one
 * @param {string} itemId - The ID of the item to edit, omit for adding new item
 */
function openItemModal(itemId = null) {
    // Reset form
    itemForm.reset();
    document.getElementById('itemId').value = '';
    
    if (itemId) {
        // Find the item to edit
        const itemToEdit = inventoryItems.find(item => item.id === itemId);
        if (itemToEdit) {
            // Populate form with item data
            document.getElementById('modalTitle').textContent = 'Edit Item';
            document.getElementById('itemId').value = itemToEdit.id;
            document.getElementById('itemName').value = itemToEdit.name;
            document.getElementById('itemDescription').value = itemToEdit.description || '';
            document.getElementById('itemQuantity').value = itemToEdit.quantity;
            document.getElementById('itemPrice').value = itemToEdit.price;
        }
    } else {
        // New item
        document.getElementById('modalTitle').textContent = 'Add New Item';
    }
    
    // Show modal
    itemModal.classList.remove('hidden');
}

/**
 * Close the item modal
 */
function closeItemModal() {
    itemModal.classList.add('hidden');
}

/**
 * Handle item form submission for adding or editing items
 * @param {Event} event - The form submission event
 */
function handleItemFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const itemId = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    const price = parseFloat(document.getElementById('itemPrice').value);
    
    // Validate required fields
    if (!name || isNaN(quantity) || isNaN(price)) {
        alert('Please fill in all required fields with valid values.');
        return;
    }
    
    if (itemId) {
        // Update existing item
        const index = inventoryItems.findIndex(item => item.id === itemId);
        if (index !== -1) {
            inventoryItems[index] = {
                ...inventoryItems[index],
                name,
                description,
                quantity,
                price,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // Add new item
        const newItem = {
            id: generateItemId(),
            name,
            description,
            quantity,
            price,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        inventoryItems.push(newItem);
    }
    
    // Save to localStorage
    saveInventoryItems();
    
    // Close modal and refresh table
    closeItemModal();
    renderInventoryTable();
}

/**
 * Open delete confirmation modal
 * @param {string} itemId - The ID of the item to delete
 */
function openDeleteModal(itemId) {
    itemIdToDelete = itemId;
    deleteModal.classList.remove('hidden');
}

/**
 * Close delete confirmation modal
 */
function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    itemIdToDelete = null;
}

/**
 * Confirm and process item deletion
 */
function confirmDeleteItem() {
    if (!itemIdToDelete) return;
    
    // Remove item from array
    inventoryItems = inventoryItems.filter(item => item.id !== itemIdToDelete);
    
    // Save to localStorage
    saveInventoryItems();
    
    // Close modal and refresh table
    closeDeleteModal();
    renderInventoryTable();
}

/**
 * Generate a unique item ID
 * @returns {string} A unique ID for the item
 */
function generateItemId() {
    return 'item_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * Get current user from localStorage
 * @returns {Object|null} The current user object or null if not logged in
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
} 