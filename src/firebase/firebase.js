import { config } from './config';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

firebase.initializeApp(config);

export const auth = firebase.auth();

export const fireauth = firebase.auth;

//const settings = {timestampsInSnapshots: true};
//firebase.firestore().settings(settings);
export const firestore = firebase.firestore();

export const firebasestore = firebase.firestore;