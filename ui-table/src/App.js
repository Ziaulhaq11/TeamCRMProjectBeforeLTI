import {Routes, Route} from 'react-router-dom'
import Signup from './components/SignUp';
import './App.css';
import SignIn from './components/SignIn';
import TableScreen from './components/TableScreen';
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAVvUnrK-gW29NGPjTwCZ_nXzvwP2ACW4",
  authDomain: "uitable-a55f7.firebaseapp.com",
  projectId: "uitable-a55f7",
  storageBucket: "uitable-a55f7.appspot.com",
  messagingSenderId: "107286989281",
  appId: "1:107286989281:web:783059cf07401c1c9eaaa0",
  measurementId: "G-7SDH7TGJ1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


function App() {
  return (
    <Routes>
      <Route path='/' element={ <TableScreen/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<SignIn/>}/>
    </Routes>
  );
}

export default App;
