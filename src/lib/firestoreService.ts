import { db } from "./firebase";
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  collection, 
  serverTimestamp 
} from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./firestoreHelper";

export async function ensureUserProfileInFirestore(userId: string, email: string) {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, "users", userId), {
      userId,
      email,
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addBookmarkToFirestore(userId: string, productId: string) {
  const path = `users/${userId}/bookmarks/${productId}`;
  try {
    await setDoc(doc(db, "users", userId, "bookmarks", productId), {
      productId,
      userId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeBookmarkFromFirestore(userId: string, productId: string) {
  const path = `users/${userId}/bookmarks/${productId}`;
  try {
    await deleteDoc(doc(db, "users", userId, "bookmarks", productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getBookmarksFromFirestore(userId: string): Promise<string[]> {
  const path = `users/${userId}/bookmarks`;
  try {
    const querySnapshot = await getDocs(collection(db, "users", userId, "bookmarks"));
    const productIds: string[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data && data.productId) {
        productIds.push(data.productId);
      }
    });
    return productIds;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
