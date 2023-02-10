var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const functions = require('firebase-functions');

const jsonParser = bodyParser.json();

const urlencodedParser = bodyParser.urlencoded({ extended: true });

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBAnN60-yIbaJjKoQg1nDFebm2fGgGncgA",

  authDomain: "nlp-dynamic-impressions.firebaseapp.com",

  projectId: "nlp-dynamic-impressions",

  storageBucket: "nlp-dynamic-impressions.appspot.com",

  messagingSenderId: "914057375130",

  appId: "1:914057375130:web:6d8b8a8abd36f4c8fd1e23",

  measurementId: "G-YF915CTCP4"

};


// Initialize Firebase

var app = express();
const firebase_app = firebase.initializeApp(firebaseConfig);

const db = firestore.getFirestore(app);

app.post("/request", urlencodedParser, (req, res) => {
  console.log(req.body)
  
  /* db.collection("descriptors").add(req.body)
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });

  return "Success!"; */
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
