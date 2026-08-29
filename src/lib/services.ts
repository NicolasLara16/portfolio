import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

function requireDb() {
  if (!db) throw new Error("Firebase não configurado. Verifique o arquivo .env.local.");
  return db;
}

function requireStorage() {
  if (!storage) throw new Error("Firebase Storage não configurado. Verifique o arquivo .env.local.");
  return storage;
}

export async function addItem(collectionName: string, data: Record<string, unknown>): Promise<string> {
  const firestore = requireDb();
  const created = await addDoc(collection(firestore, collectionName), data);
  return created.id;
}

export async function updateItem(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  const firestore = requireDb();
  await updateDoc(doc(firestore, collectionName, id), data);
}

export async function removeItem(collectionName: string, id: string): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, collectionName, id));
}

export async function saveProfile(data: Record<string, unknown>): Promise<void> {
  const firestore = requireDb();
  await setDoc(doc(firestore, "profile", "main"), data);
}

export async function uploadCertificate(file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, "_");
  const fileRef = ref(requireStorage(), `certificates/${Date.now()}-${safeName}`);
  await uploadBytes(fileRef, file, { contentType: file.type });
  return getDownloadURL(fileRef);
}
