// Admin register component
//
// @zgr2788

import React, { useState } from "react";

import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const RegisterAdmin = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: email, first_name: name, last_name: surname, pass_hash: password})
        };

        const response = await fetch("/api/admins", requestOptions);
        const data = await response.json();

        if (!response.ok){
            setErrorMessage(data.detail);
        } else {
            setSuccessMessage("Admin registered successfully!");
            setErrorMessage("")
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 8){
            submitRegistration();
        } else {
            setErrorMessage("Ensure that the passwords are matching and longer than 8 characters.");
        }
    }




    return (
        <div className = "column">
            <form className = "box" onSubmit = {handleSubmit}>
                <h1 className = "title has-text-centered">Register New Admin</h1>
                
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
                    <label className = "label">Name</label>
                    <div className="control">
                        <input 
                            type="text" 
                            placeholder = "First Name" 
                            value = {name} 
                            onChange = { (n) => setName(n.target.value) }
                            className = "input"
                            required                        
                        />
                    </div>
                </div>

                <div className = "field">
                    <label className = "label">Surname</label>
                    <div className="control">
                        <input 
                            type="text" 
                            placeholder = "Surname" 
                            value = {surname} 
                            onChange = { (s) => setSurname(s.target.value) }
                            className = "input"
                            required                        
                        />
                    </div>
                </div>
                
                <br />
                <br />

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

                <div className = "field">
                    <label className = "label">Confirm Password</label>
                    <div className="control">
                        <input 
                            type="password" 
                            placeholder = "Password" 
                            value = {confirmationPassword} 
                            onChange = { (c) => setConfirmationPassword(c.target.value) }
                            className = "input"
                            required                        
                        />
                    </div>
                </div>

                <ErrorMessage message = {errorMessage} />
                <SuccessMessage message = {successMessage} />
                <br />
                <br />
                <br />
                <br />

                <button className="button is-primary" type = "submit">
                    Register
                </button>

            </form>
        </div>


    );

};

export default RegisterAdmin