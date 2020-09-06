import Firebase from 'firebase'
import 'firebase/firestore'

// FIREBASEはAPI_KEYがバレても問題ないらしい
const config = {
    apiKey: "AIzaSyDuEXaZ7offK5ZxULvDgkHAIxMeGBYkjY4",
    authDomain: "yokochan-86e14.firebaseapp.com",
    databaseURL: "https://yokochan-86e14.firebaseio.com",
    projectId: "yokochan-86e14",
    storageBucket: "yokochan-86e14.appspot.com",
    // messagingSenderId: "{.....}"
  }

const firebaseApp = Firebase.initializeApp(config)
const firestore = firebaseApp.firestore()
firestore.settings({ timestampsInSnapshots: true })

export default firestore