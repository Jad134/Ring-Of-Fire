import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-592bf","appId":"1:475112071781:web:d3142680a19a10ab0d1c8c","storageBucket":"ring-of-fire-592bf.appspot.com","apiKey":"AIzaSyAq_3SoG-zjgnh_LO1YpyzzE7Xa30jNSMQ","authDomain":"ring-of-fire-592bf.firebaseapp.com","messagingSenderId":"475112071781"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
