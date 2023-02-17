const app = firebase.app();

const firebase_app = initializeApp(firebaseConfig);

const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);