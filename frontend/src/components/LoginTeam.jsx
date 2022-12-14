// Team login component
//
// @zgr2788
import React, { useContext, useState, useEffect } from "react";

import ErrorMessage from "./ErrorMessage";
import { TeamContext } from "../context/TeamContext";
import BounceLoader from "react-spinners/BounceLoader";


const TeamLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [teamToken, setTeamToken, teamLogin, setTeamLogin] = useContext(TeamContext);
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
            setButtonText('Login');
        } else {
            setTeamToken(data.access_token);
            setTeamLogin(true);
            setButtonText('Login');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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
                <h1 className="title has-text-centered">Team Login</h1>
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

                <button className="button is-primary" type="submit" onClick={() => setButtonText('Logging in...')}>
                    {buttonText}
                </button>


            </form>
        </div >
    );

};

export default TeamLogin;