// Get elements for sidebar, main content, menu container, user greeting, and brand text
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const toggleButton = document.getElementById('toggleSidebar');
const menuContainer = document.querySelector('.menu');
const userInfo = document.querySelector('.user-info');
const brandText = document.querySelector('.brand-text');

// Toggle sidebar and adjust main content
toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('closed');
    mainContent.classList.toggle('closed');
    userInfo.classList.toggle('d-none'); 
    menuContainer.classList.toggle('d-none'); 
    brandText.classList.toggle('d-none'); 
});

// Menu data structure
const menuData = [
    {
        "ParentName": "Dashboard",
        "ParentCaption": "Dashboard",
        "ParentUrl": "#",
        "Children": [
            {
                "Name": "Dashboard",
                "Caption": "Dashboard",
                "Url": "/Dashboards"
            }
        ]
    },
    {
        "ParentName": "ThirdParty",
        "ParentCaption": "Third Party",
        "ParentUrl": "#",
        "Children": [
            { "Name": "Customer", "Caption": "Customer", "Url": "/Customers" },
            { "Name": "CustomerContact", "Caption": "Customer Contact", "Url": "/CustomerContacts" },
            { "Name": "CustomerGroup", "Caption": "Customer Group", "Url": "/CustomerGroups" },
            { "Name": "CustomerSubGroup", "Caption": "Customer SubGroup", "Url": "/CustomerSubGroups" },
            { "Name": "Vendor", "Caption": "Vendor", "Url": "/Vendors" },
            { "Name": "VendorContact", "Caption": "Vendor Contact", "Url": "/VendorContacts" },
            { "Name": "VendorGroup", "Caption": "Vendor Group", "Url": "/VendorGroups" },
            { "Name": "VendorSubGroup", "Caption": "Vendor SubGroup", "Url": "/VendorSubGroups" }
        ]
    },
    {
        "ParentName": "Settings",
        "ParentCaption": "Settings",
        "ParentUrl": "#",
        "Children": [
            { "Name": "Config", "Caption": "Config", "Url": "/Configs" },
            { "Name": "Currency", "Caption": "Currency", "Url": "/Currencies" },
            { "Name": "Gender", "Caption": "Gender", "Url": "/Genders" },
        ]
    },
    {
        "ParentName": "Profile",
        "ParentCaption": "Profile",
        "ParentUrl": "#",
        "Children": [
            { "Name": "UserProfile", "Caption": "User Profile", "Url": "/UserProfiles" }
        ]
    },
    {
        "ParentName": "RoleMembership",
        "ParentCaption": "Role & Membership",
        "ParentUrl": "#",
        "Children": [
            { "Name": "Role", "Caption": "Role", "Url": "/Roles" },
            { "Name": "Claim", "Caption": "Claim", "Url": "/Claims" },
            { "Name": "Member", "Caption": "Member", "Url": "/Members" }
        ]
    }
];

// Retrieve selected menu from localStorage
const selectedMenu = localStorage.getItem('selected-menu');

// Generate menu items
menuData.forEach(parent => {
    const parentItem = document.createElement('div');
    parentItem.className = 'menu-item';
    parentItem.innerHTML = `
        <span>${parent.ParentCaption}</span>
        <span class="caret">&#9656;</span> <!-- Caret for submenu -->
    `;
    menuContainer.appendChild(parentItem);

    // Create submenu for parent item
    const submenu = document.createElement('div');
    submenu.className = 'submenu';

    let isChildSelected = false; // Track if a child item is selected

    parent.Children.forEach(child => {
        const childItem = document.createElement('a');
        childItem.href = child.Url;
        childItem.className = 'menu-item';
        childItem.innerText = child.Caption;

        // Check if the current URL matches the menu item URL or matches selected-menu from localStorage
        if (selectedMenu === child.Name || window.location.pathname === child.Url) {
            childItem.classList.add('menu-selected');
            submenu.classList.add('open'); // Automatically open the parent submenu
            const caret = parentItem.querySelector('.caret');
            caret.classList.add('rotate'); // Rotate caret when submenu is open
            isChildSelected = true; // Mark this parent as containing a selected child
        }

        // Add event listener to save selected menu to localStorage when clicked
        childItem.addEventListener('click', () => {
            localStorage.setItem('selected-menu', child.Name); // Save clicked menu name
        });

        submenu.appendChild(childItem);
    });

    // Append submenu to parent item
    menuContainer.appendChild(submenu);

    // Toggle submenu display on click, regardless of child selection
    parentItem.addEventListener('click', () => {
        submenu.classList.toggle('open');
        const caret = parentItem.querySelector('.caret');
        caret.classList.toggle('rotate'); // Rotate caret when toggled
    });
});

// Ambil data dari localStorage dan hilangkan tanda kutip jika ada
const firstName = localStorage.getItem('firstName')?.replace(/"/g, '');
const lastName = localStorage.getItem('lastName')?.replace(/"/g, '');

// Jika firstName dan lastName ada di localStorage, tampilkan
if (firstName && lastName) {
    document.getElementById('username').textContent = `${firstName} ${lastName}`;
} else {
    document.getElementById('username').textContent = 'UserName'; // Fallback jika tidak ada data
}

//Get currently active config
fetch('/api/Config/GetActiveConfig', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('activeConfig').textContent = data?.content?.data?.name;
        document.getElementById('activeCurrency').textContent = data?.content?.data?.currencyName;
    })
    .catch(error => {
        console.error('Error during API call:', error);
    });
