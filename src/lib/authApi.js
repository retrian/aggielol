// src/lib/authApi.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export const login = (email, pass) =>
  signInWithEmailAndPassword(auth, email, pass);

export const signup = (email, pass) =>
  createUserWithEmailAndPassword(auth, email, pass);
