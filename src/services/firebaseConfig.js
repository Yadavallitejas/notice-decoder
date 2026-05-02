import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * The initialized Firebase application instance.
 */
export const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance for managing users.
 */
export const auth = getAuth(app);

/**
 * Firestore Database instance for reading and writing data.
 */
export const db = getFirestore(app);

/**
 * Saves the analyzed document to the user's history collection.
 * 
 * @param {string} userId - The user's Firebase UID.
 * @param {string} inputText - The original text of the notice.
 * @param {Object} result - The parsed JSON result from the AI.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const saveAnalysis = async (userId, inputText, result) => {
  if (!userId) throw new Error("User must be logged in to save history.");
  
  const scansRef = collection(db, `analyses/${userId}/scans`);
  const docRef = await addDoc(scansRef, {
    inputText: inputText.substring(0, 500),
    result: result,
    documentTitle: result.title || "Untitled Notice",
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
};

/**
 * Retrieves the user's decoding history, ordered by creation date.
 * 
 * @param {string} userId - The user's Firebase UID.
 * @returns {Promise<Array>} An array of history document objects.
 */
export const getUserHistory = async (userId) => {
  if (!userId) throw new Error("User must be logged in to fetch history.");

  const q = query(collection(db, `analyses/${userId}/scans`), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }));
};

/**
 * Deletes a specific scan from the user's history.
 * 
 * @param {string} userId - The user's Firebase UID.
 * @param {string} scanId - The ID of the document to delete.
 * @returns {Promise<void>}
 */
export const deleteHistoryItem = async (userId, scanId) => {
  if (!userId || !scanId) throw new Error("User ID and Scan ID are required.");

  await deleteDoc(doc(db, `analyses/${userId}/scans`, scanId));
};
