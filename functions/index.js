// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

exports.copyUserDataToColletion = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  let name = ''
  if(user.displayName){
    name = user.displayName; 
  }else{
    name = "名無しさん"; 
  }
  const comment = "こんにちは"
  const uid = user.uid

  const data = {
    displayName: name,
    comment: comment,
    email: email
  }
  admin.firestore().collection('users').doc(uid).set(data);  
});

exports.copyUserTestResultsToColletion = functions.firestore
  .document('users/{uid}/testReactions/{test_reaction_doc_id}')
  .onWrite((change, context) => {
    const data = change.after.data();
    console.log(data)
    admin.firestore().collection('users').doc(data.answerer_id).collection('userTestResults').add(data);  
  });