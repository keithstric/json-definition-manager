import {Injectable} from '@angular/core';
import {CollectionReference} from '@angular/fire/compat/firestore';
import {
	collection,
	deleteDoc,
	doc,
	Firestore,
	getDoc,
	getDocs, limit, orderBy, query,
	serverTimestamp,
	setDoc,
	updateDoc, where
} from '@angular/fire/firestore';
import {WhereQuery} from '@core/interfaces/firestore.interface';
import {v4 as uuid} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
	private _collectionCache: Map<string, any> = new Map<string, any>();
  constructor(private firestore: Firestore) {}

	getCollection(collectionPath: string): CollectionReference {
		if (!this._collectionCache.has(collectionPath)) {
			const collRef = collection(this.firestore, collectionPath);
			this._collectionCache.set(collectionPath, collRef);
		}
		return this._collectionCache.get(collectionPath);
	}

	getDocRef(collectionPath: string, id: string) {
		return doc(this.getCollection(collectionPath), id);
	}

	getDateFromTimestamp(timestamp: {seconds: number, nanoSeconds: number}) {
		return new Date(timestamp.seconds * 1000);
	}

	async getDocumentById<T>(collectionPath: string, documentId: string): Promise<T> {
		const docRef = this.getDocRef(collectionPath, documentId);
		const docSnap = await getDoc(docRef);
		return docSnap ? docSnap.data() as T : undefined;
	}

	async getDocumentsByQuery<T>(collectionPath: string, whereQuery: WhereQuery): Promise<T[]> {
		const returnVal = [];
		const fsQuery = this._parseWhereQuery(collectionPath, whereQuery);
		const querySnap = await getDocs(fsQuery);
		querySnap.forEach(doc => {
			returnVal.push(doc.data())
		});
		return returnVal;
	}

	private _parseWhereQuery(collectionPath: string, whereQuery: WhereQuery) {
		const collection = this.getCollection(collectionPath);
		const queryArgs: any[] = [collection];
		const whereArgs = [];
		const {fieldName, condition, value, arrayValue, sortDirection, sortBy} = whereQuery;
		const orderByFld = whereQuery.orderBy;
		const limitTo = whereQuery.limit;
		if (fieldName && condition && (value || arrayValue)) {
			whereArgs.push(fieldName);
			whereArgs.push(condition);
			arrayValue?.length ? whereArgs.push(arrayValue) : whereArgs.push(value);
			queryArgs.push(where.apply(this, whereArgs));
		}
		if (orderByFld) {
			const orderByArgs = [];
			if (Array.isArray(orderByFld)) {
				orderByFld.forEach(field => {
					orderByArgs.push(field);
					if (sortBy && sortBy === field) {
						orderByArgs.push(sortDirection || 'asc');
					}
				});
			}else{
				orderByArgs.push(orderByFld);
				if (sortDirection) {
					orderByArgs.push(sortDirection);
				}
			}
			queryArgs.push(orderBy.apply(this, orderByArgs));
		}
		if (limitTo) {
			queryArgs.push(limit(limitTo));
		}
		return query.apply(this, queryArgs);
	}

	async getAllDocuments<T>(collectionPath: string): Promise<T[]> {
		const returnVal: T[] = [];
		const querySnap = await getDocs(this.getCollection(collectionPath));
		if(!querySnap.empty) {
			querySnap.forEach(doc => returnVal.push(doc.data() as T));
		}
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
