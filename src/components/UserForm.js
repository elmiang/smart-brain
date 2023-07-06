import React, { useState } from "react";
import axios from 'axios';

const Register = ({ type, onRouteChange, loadUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const onSubmitRegister = () => {
    const data = {
      name: name,
      email: email,
      password: password
    }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/register`, data, {
      headers: {'Content-Type': 'application/json'},
    })
      .then(user => {
        if (user) {
          loadUser(user.data);
          onRouteChange('home');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const onSubmitSignIn = () => {
    const data = {
      email: email,
      password: password
    }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/signin`, data, {
      headers: {'Content-Type': 'application/json'},
    })
      .then(user => {
        if (user.data.id) {
          loadUser(user.data)
          onRouteChange('home');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  return(
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">{type === 'register' ? "Register" : "Sign In"}</legend>
            {type === 'register' 
              &&  <div className="mt3">
                    <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                    <input 
                      className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                      type="text" 
                      name="name"  
                      id="name"
                      onChange={onNameChange}
                    />
                  </div>
            }
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
              <input 
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                type="email" 
                name="email-address"  
                id="email-address"
                onChange={onEmailChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input 
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                type="password" 
                name="password"  
                id="password"
                onChange={onPasswordChange}
              />
            </div>
          </fieldset>
          {type === 'register' 
          ? <div className="">
              <input 
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                type="submit" 
                value="Register"
                onClick={onSubmitRegister}
              />
            </div>
          : (
              <div>
                <div className="">
                  <input 
                    onClick={onSubmitSignIn}
                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                    type="submit" 
                    value="Sign in"
                  />
                </div>
                <div className="lh-copy mt3">
                  <p onClick={() => onRouteChange('register')} href="#0" className="f6 link dim black pointer db">Register</p>
                </div>
              </div>
            )
          }
        </div>
      </main>
    </article>
  );
}

export default Register;