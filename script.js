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

