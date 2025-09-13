import { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authenticate } from '../store/actions';


const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleMail = e => {
    setEmail(e.target.value)
  }

  const handlePassword = e => {
    setPassword(e.target.value)
  }

  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        localStorage.setItem('user', JSON.stringify(user))
        const userId = user.uid
        const token = user.stsTokenManager.accessToken
        dispatch(authenticate(userId, token))
        navigate('/')
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  const signInPage = () => {
    navigate('/login')
  }


  return (
    <div className='container mt-5'>
      <form>
        <div style={{display : 'flex', flexDirection : 'column', justifyContent : "center", alignItems : 'center'}}>
          <div className="mb-3 col-6">
            <label className='form-label '>Email Address</label>
            <input type="email" className='form-control' value={email} onChange={handleMail}/>
          </div>
          <div className="mb-3 col-6">
            <label className='form-label '>Password</label>
            <input type="password" className='form-control' value={password} onChange={handlePassword}/>
          </div>
          <button className='btn btn-primary' onClick={handleSubmit}>SignUp</button>
          <button className='btn btn-secondary mt-5' onClick={signInPage}>Log In here</button>
        </div>
      </form>
    </div>
  )
}


export default SignUp;