import { Injectable } from '@angular/core';
import {Firestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

	getCollection(collectionPath: string) {}

	getDocument(documentPath: string) {}

	addDocument(documentPath: string) {}
}
