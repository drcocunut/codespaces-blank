const cards = document.querySelectorAll('.card');
const productModalDetails = document.getElementById('product-modal-details');
const addToCartBtn = document.getElementById('addToCartBtn');
const cartItemsList = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.getElementById('cart-count');

let cart = [];
let selectedProduct = {};

// Beim Laden der Seite das Fortnite-Modal öffnen
document.addEventListener('DOMContentLoaded', () => {
    openModal('fortniteModal');
});

cards.forEach(card => {
    card.addEventListener('click', () => {
        const product = card.dataset.product;
        const price = card.dataset.price;

        selectedProduct = { product, price };

        productModalDetails.innerText = `${product} für ${price}`;
        openModal('productDetailsModal');
    });
});

// Funktion zum Hinzufügen zum Warenkorb
addToCartBtn.addEventListener('click', () => {
    if (selectedProduct.product && selectedProduct.price) {
        addToCart(selectedProduct.product, selectedProduct.price);
        closeModal('productDetailsModal');
    }
});

function addToCart(productName, productPrice) {
    // Preis in eine Zahl umwandeln (Komma durch Punkt ersetzen für parseFloat)
    const priceValue = parseFloat(productPrice.replace(',', '.'));

    const existingItemIndex = cart.findIndex(item => item.name === productName);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity++;
    } else {
        cart.push({ name: productName, price: priceValue, quantity: 1 });
    }
    updateCartDisplay();
    updateCartCount();
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
    updateCartCount();
}

function updateCartDisplay() {
    cartItemsList.innerHTML = ''; // Warenkorb leeren
    let total = 0;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li>Dein Warenkorb ist leer.</li>';
    } else {
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('cart-item');
            // NEUER, BESSERER CODE
            listItem.innerHTML = `
    <span>${item.name} (${item.quantity}x)</span>
    <span>${item.price.toFixed(2).replace('.', ',')} € 
        <button class="cart-item-remove" data-product-name="${item.name}">&times;
        </button>
    </span>
`;
            cartItemsList.appendChild(listItem);
            total += item.price * item.quantity;
        });
    }
    cartTotalPrice.innerText = total.toFixed(2).replace('.', ',') + ' €';
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
}

function openModal(id) {
    // Alle offenen Modals schließen, bevor ein neues geöffnet wird
    document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
    });
    document.getElementById(id).classList.add('show');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

function openCart() {
    updateCartDisplay(); // Sicherstellen, dass der Warenkorb aktualisiert ist
    openModal('cartModal');
}

// Modals schließen, wenn außerhalb geklickt wird
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
};

// NEU: Event-Listener für die "Entfernen"-Buttons
cartItemsList.addEventListener('click', function(event) {
    // Prüfen, ob das geklickte Element ein "Entfernen"-Button ist
    if (event.target.classList.contains('cart-item-remove')) {
        // Den Produktnamen aus dem data-Attribut auslesen
        const productName = event.target.dataset.productName;
        // Die bekannte Funktion aufrufen
        removeFromCart(productName);
    }
});