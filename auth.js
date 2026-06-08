import { auth } from './firebase.js';
import { createUserProfile, getUserData } from './database.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const authRoutes = ['/login.html', '/register.html', '/forgot-password.html', '/index.html', '/'];

export function initAuthRedirect() {
    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        
        if (user) {
            // User is logged in
            if (authRoutes.includes(currentPath) || currentPath === '/index.html') {
                window.location.replace('/dashboard.html');
            }
        } else {
            // User is logged out
            if (!authRoutes.includes(currentPath)) {
                window.location.replace('/login.html');
            }
        }
    });
}

export async function registerUser(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user.uid, email, username);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function logoutUser() {
    await signOut(auth);
    window.location.href = '/login.html';
}
