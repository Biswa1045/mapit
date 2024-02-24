// const firebase = require('firebase')
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../cred.json');
const firebaseConfig = {
    Credential: cert(serviceAccount)
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app); 
  
  module.exports = {db};