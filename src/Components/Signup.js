import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {

    const [credentials, setCredentials] = useState({name:'', email:'', password:'', cpassword:''})

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        const {name, email, password} = credentials;
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
          })
          const json = await response.json();
          console.log(json)
          if(json.success) {
            // Save the auth-token and redirect to home page
            localStorage.setItem('token', json.authtoken);
            props.showAlert('success', 'Account Created Successfully');
            navigate('/');
          }
          else {
            props.showAlert('danger', 'Invalid Details');
          }
    }

    const onChange= (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='container my-2'>
             <h2 className='mb-3'>Create an account to use iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" onChange={onChange} minLength={3} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} required />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
