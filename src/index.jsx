// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
// custom CSS
import "./assets/variables.scss";
import "./assets/style.scss";


import {model} from "./DataModel.js";

import { observable, configure } from "mobx";
configure({ enforceActions: "never", });  // we don't use Mobx actions
const reactiveModel = observable(model);

import {createRoot} from "react-dom/client";
import {Root} from "./Root.jsx";

const root = createRoot(document.getElementById('root'));  

root.render(<Root model={reactiveModel} />)

// debugging
// window.myModel= reactiveModel;  

import {reaction} from "mobx"
import "./firebase/firebaseModel.js"
import { connectToFirebase, getAuthObject } from "./firebase/firebaseModel.js"
 // connect to firebase
connectToFirebase(reactiveModel, reaction)


import { onAuthStateChanged } from "firebase/auth";
onAuthStateChanged(getAuthObject(), (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      reactiveModel.userSignedInACB(user);
      // ...
    }
  });
