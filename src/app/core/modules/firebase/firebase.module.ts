import { NgModule } from '@angular/core';
import {getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {getFirestore, initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {getFunctions, provideFunctions} from '@angular/fire/functions';
import {getMessaging, provideMessaging} from '@angular/fire/messaging';
import {getPerformance, providePerformance} from '@angular/fire/performance';
import {getRemoteConfig, provideRemoteConfig} from '@angular/fire/remote-config';
import {getStorage, provideStorage} from '@angular/fire/storage';
import firebaseConfig from '../../../../../firebase-cred.json';

@NgModule({
  declarations: [],
  imports: [
		provideFirebaseApp(() => initializeApp(firebaseConfig)),
		provideAuth(() => getAuth()),
		provideAnalytics(() => getAnalytics()),
		provideFirestore(() => initializeFirestore(getApp(), {ignoreUndefinedProperties: true})),
		provideDatabase(() => getDatabase()),
		provideFunctions(() => getFunctions()),
		provideMessaging(() => getMessaging()),
		providePerformance(() => getPerformance()),
		provideStorage(() => getStorage()),
		provideRemoteConfig(() => getRemoteConfig())
  ],
	providers: [
		ScreenTrackingService,
		UserTrackingService
	],
})
export class FirebaseModule { }
