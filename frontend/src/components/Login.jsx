// Login component
//
// @zgr2788
import React, { useContext, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import { AdminContext } from "../context/AdminContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [,setToken] = useContext(AdminContext);


    const submitLogin = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: JSON.stringify(
                'grant_type=&username=' + email + '&password=' + password + '&scope=&client_id=&client_secret='
                ),
        };

        const response = await fetch("/api/tokens", requestOptions);
        const data = await response.json();

        if (!response.ok){
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
            console.log(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    }

    return (
        <div className = "column">
            <form className = "box" onSubmit = {handleSubmit}>
                <h1 className = "title has-text-centered">Financial Management System - Login</h1>
                <br />
                <br />
                <div className = "field">
                    <label className = "label">Email Address</label>
                    <div className="control">
                        <input 
                            type="email" 
                            placeholder = "E-mail" 
                            value = {email} 
                            onChange = { (e) => setEmail(e.target.value) }
                            className = "input"
                            required                        
                        />
                    </div>
                </div>
                
                <div className = "field">
                    <label className = "label">Password</label>
                    <div className="control">
                        <input 
                            type="password" 
                            placeholder = "Password" 
                            value = {password} 
                            onChange = { (p) => setPassword(p.target.value) }
                            className = "input"
                            required                        
                        />
                    </div>
                </div>

                <ErrorMessage message = {errorMessage} />
                
                <br />
                <br />
                <br />

                <button className="button is-primary" type = "submit">
                    Login
                </button>

            </form>
        </div>
    );

};

export default Login;