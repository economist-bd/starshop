// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // If you're using Analytics
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Using getDocs for fetching multiple documents

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBQqak3FxPDQ6I200T2keY9p6MnE85ygF4",
    authDomain: "star-shop-2bd32.firebaseapp.com",
    projectId: "star-shop-2bd32",
    storageBucket: "star-shop-2bd32.firebasestorage.app",
    messagingSenderId: "1084495840351",
    appId: "1:1084495840351:web:89c024d279be196c9787ea",
    measurementId: "G-JD72DNHQ12" // This is your specific Analytics ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize Analytics
const auth = getAuth(app); // Get the Auth service instance
const db = getFirestore(app); // Get the Firestore service instance

// Get references to HTML elements
const authStatusElement = document.getElementById('auth-status');
const loginGoogleBtn = document.getElementById('login-google-btn');
const logoutBtn = document.getElementById('logout-btn');
const productListElement = document.getElementById('product-list');

// --- Firebase Authentication ---

// Google Sign-in Provider
const provider = new GoogleAuthProvider();

// Handle Google Login Button Click
loginGoogleBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("User signed in:", user.displayName);
        // UI will be updated by onAuthStateChanged listener
    } catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Google Sign-in Error:", errorMessage);
        // For example, if user closes the popup
        if (errorCode === 'auth/popup-closed-by-user') {
            console.log('Sign-in popup was closed by the user.');
        } else {
            console.error('Sign-in error:', errorMessage, errorCode);
        }
    }
});

// Handle Logout Button Click
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log("User signed out.");
        // UI will be updated by onAuthStateChanged listener
    } catch (error) {
        console.error("Sign-out Error:", error);
    }
});

// Listen for authentication state changes (user logs in/out)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        authStatusElement.textContent = `Welcome, ${user.displayName}!`;
        loginGoogleBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        // User is signed out
        authStatusElement.textContent = 'Please sign in to shop.';
        loginGoogleBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});

// --- Fetching Products ---

async function fetchProducts() {
    productListElement.textContent = 'Loading products from Firebase Firestore...';
    try {
        // Get all documents from the 'products' collection
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection); // Use getDocs for a collection
        
        if (productSnapshot.empty) {
            productListElement.textContent = 'No products found yet. Add some in Firestore!';
            return;
        }
        
        let productsHtml = '';
        productSnapshot.forEach(doc => {
            const product = doc.data();
            productsHtml += `
                <div class="product-item">
                    <h3>${product.name}</h3>
                    <p>Price: ${product.price} BDT</p>
                    <p>${product.description || ''}</p>
                    ${product.imageUrl ? `<img src="${product.imageUrl}" alt="${product.name}" style="max-width: 100px; height: auto;">` : ''}
                    <button>Add to Cart</button>
                </div>
            `;
        });
        productListElement.innerHTML = productsHtml;

    } catch (error) {
        console.error("Error fetching products:", error);
        productListElement.textContent = 'Error loading products. Please try again.';
    }
}

// Call fetchProducts when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts);

<script>
        document.addEventListener('DOMContentLoaded', function() {
            const bookGrid = document.getElementById('bookGrid');
            const loginModal = document.getElementById('loginModal');
            const detailsModal = document.getElementById('detailsModal');
            const closeLoginBtn = document.getElementById('closeLogin');
            const closeDetailsBtn = document.getElementById('closeDetails');

            // NAV TOGGLE
            const navToggle = document.getElementById('navToggle');
            const primaryNav = document.getElementById('primaryNav');

            navToggle.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', String(!expanded));
                primaryNav.classList.toggle('active');
            });

            // Close nav when clicking outside (mobile)
            window.addEventListener('click', function(event) {
                if (!event.target.closest('.navbar') && primaryNav.classList.contains('active')) {
                    primaryNav.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });

            const books = [];
            // Generate data for 100 books
            for (let i = 1; i <= 100; i++) {
                books.push({
                    id: i,
                    title: `The Secret of Book ${i}`,
                    // Using a placeholder image service for variety
                    cover: `https://picsum.photos/400/300?random=${i}`,
                    description: `This is a short, engaging summary for 'The Secret of Book ${i}'. It gives a glimpse into the adventures and mysteries that await the reader inside.`,
                    fullDescription: `Dive deep into the world of 'The Secret of Book ${i}'. This is the full, detailed description that explores the plot, main characters, and the central themes of t[...]
                });
            }

            // Populate the grid with book cards
            books.forEach(book => {
                const card = document.createElement('div');
                card.className = 'book-card';
                card.innerHTML = `
                    <div class="book-cover">
                        <img src="${book.cover}" alt="Cover for ${book.title}">
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p>${book.description}</p>
                        <div class="book-actions">
                            <button class="btn btn-details" data-id="${book.id}">Details</button>
                            <a href="/download/demo/${book.id}" class="btn btn-download" data-id="${book.id}">Download Demo</a>
                        </div>
                    </div>
                `;
                bookGrid.appendChild(card);
            });

            // Event Delegation for all buttons on the grid
            bookGrid.addEventListener('click', function(e) {
                const target = e.target;

                // Handle Download Demo click
                if (target.classList.contains('btn-download')) {
                    e.preventDefault(); // Prevent the link from navigating
                    loginModal.style.display = 'block';
                }

                // Handle Details click
                if (target.classList.contains('btn-details')) {
                    const bookId = target.dataset.id;
                    const book = books.find(b => b.id == bookId);
                    
                    if (book) {
                        document.getElementById('modal-book-cover').src = book.cover;
                        document.getElementById('modal-book-title').textContent = book.title;
                        document.getElementById('modal-book-description').textContent = book.fullDescription;
                        detailsModal.style.display = 'block';
                    }
                }
            });

            // Functions to close modals
            function closeModal(modal) {
                modal.style.display = 'none';
            }

            closeLoginBtn.onclick = () => closeModal(loginModal);
            closeDetailsBtn.onclick = () => closeModal(detailsModal);

            // Close modal if user clicks outside of the modal content
            window.onclick = function(event) {
                if (event.target == loginModal) {
                    closeModal(loginModal);
                }
                if (event.target == detailsModal) {
                    closeModal(detailsModal);
                }
            }
        });
    </script>

