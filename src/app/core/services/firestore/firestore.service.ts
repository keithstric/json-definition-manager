import {Injectable} from '@angular/core';
import {
	collection,
	deleteDoc,
	doc,
	Firestore,
	getDoc,
	getDocs, query,
	serverTimestamp,
	setDoc,
	updateDoc, where
} from '@angular/fire/firestore';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
	private _collectionCache: Map<string, any> = new Map<string, any>();
  constructor(private firestore: Firestore) {}

	getCollection(collectionPath: string) {
		if (!this._collectionCache.has(collectionPath)) {
			const collRef = collection(this.firestore, collectionPath);
			this._collectionCache.set(collectionPath, collRef);
		}
		return this._collectionCache.get(collectionPath);
	}

	getDocRef(collectionPath: string, id: string) {
		return doc(this.getCollection(collectionPath), id);
	}

	async getDocumentById<T>(collectionPath: string, documentId: string): Promise<T> {
		const docRef = this.getDocRef(collectionPath, documentId);
		const docSnap = await getDoc(docRef);
		return docSnap ? docSnap.data() as T : undefined;
	}

	async getDocumentsByQuery<T>(collectionPath: string, whereField: string, whereCondition: '==', whereValue: string): Promise<T[]> {
		const returnVal = [];
		const collection = this.getCollection(collectionPath);
		const q = query(collection, where(whereField, whereCondition, whereValue));
		const querySnap = await getDocs(q);
		console.log('querySnap=', querySnap);
		querySnap.forEach(doc => {
			console.log('doc=', doc);
			returnVal.push(doc.data())
		});
		return returnVal;
	}

	async getAllDocuments<T>(collectionPath: string): Promise<T[]> {
		const returnVal: T[] = [];
		const querySnap = await getDocs(this.getCollection(collectionPath));
		querySnap.forEach(doc => returnVal.push(doc.data() as T));
		return returnVal;
	}

	async addDocument<T>(collectionPath: string, payload: T, documentId?: string): Promise<T> {
		(payload as any).createdDate = serverTimestamp();
		(payload as any).createdBy = 'keithstric@gmail.com';
		const id = documentId ? documentId : uuid();
		(payload as any).id = id;
		const docRef = this.getDocRef(collectionPath, id);
		await setDoc(docRef, payload);
		return await this.getDocumentById<T>(collectionPath, id);
	}

	async deleteDocument<T>(collectionPath: string, documentId: string): Promise<T> {
		const currentDoc = this.getDocumentById<T>(collectionPath, documentId);
		const docRef = this.getDocRef(collectionPath, documentId);
		await deleteDoc(docRef);
		return currentDoc;
	}

	async updateDocument(collectionPath: string, documentId: string, payload: any, mergePayload = true): Promise<any> {
		payload.updatedDate = serverTimestamp();
		payload.updatedBy = 'keithstric@gmail.com';
		if (mergePayload) {
			const docRef = this.getDocRef(collectionPath, documentId);
			await updateDoc(docRef, payload);
			return await this.getDocumentById(collectionPath, documentId);
		} else {
			return await this.addDocument(collectionPath, payload, documentId);
		}
	}
}
