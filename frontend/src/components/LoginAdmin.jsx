// Admin login component
//
// @zgr2788
import React, { useContext, useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";
import { AdminContext } from "../context/AdminContext";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setAdminToken, , setAdminLogin] = useContext(AdminContext);
    const [buttonText, setButtonText] = useState('Login');

    const submitLogin = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: JSON.stringify(
                'grant_type=&username=' + email + '&password=' + password + '&scope=&client_id=&client_secret='
            ),
        };

        const response = await fetch("/api/tokens/", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);

        } else {
            setAdminToken(data.access_token);
            setAdminLogin(true);

        }
        setButtonText('Login');

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setButtonText('Logging in...')
        submitLogin();
    }


    useEffect(() => {
        setTimeout(() => {
            setErrorMessage("")
        }, 3000)
    }, [errorMessage]
    )

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Admin Login</h1>
                <br />
                <br />
                <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(p) => setPassword(p.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <ErrorMessage message={errorMessage} />

                <br />
                <br />
                <br />

                <button className="button is-primary" type="submit" >
                    {buttonText}
                </button>

            </form>
        </div>
    );

};

export default AdminLogin;