import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const UserForm = ({ type, loadUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

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
    setFormErrors(validate(data));
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/register`, data, {
      headers: {'Content-Type': 'application/json'},
    })
      .then(user => {
        if (user) {
          loadUser(user.data);
          navigate('/home', { replace: true });
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
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/signin`, data, {
      headers: {'Content-Type': 'application/json'},
    })
      .then(user => {
        if (user.data.id) {
          loadUser(user.data)
          navigate('/home', { replace: true });
        }
        else {
          setFormErrors({login: "Username or password incorrect"});
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name cannot be empty";
    }
    if (!values.email) {
      errors.email = "Password cannot be empty";
    }
    else if (!email.includes("@")) {
      errors.email = "Email is in invalid format";
    }
    if (!values.password) {
      errors.password = "Password cannot be empty";
    }
    return errors;
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
                    <p>{formErrors.name}</p>
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
              <p>{formErrors.email}</p>
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
              <p>{formErrors.password}</p>
            </div>
          </fieldset>
          {type === 'register' 
          ? <div>
              <div className="">
                <input 
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                  type="submit" 
                  value="Register"
                  onClick={onSubmitRegister}
                />
              </div>
              <div className="lh-copy mt3">
                <p onClick={() => navigate('/login', { replace: true })} href="#0" className="f6 link dim black pointer db">Sign in</p>
              </div>
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
                  <p onClick={() => navigate('/register', { replace: true })} href="#0" className="f6 link dim black pointer db">Register</p>
                </div>
              </div>
            )
          }
          <p>{formErrors.login}</p>
        </div>
      </main>
    </article>
  );
}

export default UserForm;