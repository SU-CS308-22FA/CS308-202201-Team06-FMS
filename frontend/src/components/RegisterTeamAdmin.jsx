// Team register component
//
// @zgr2788

import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";

import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const RegisterTeamAdmin = ({loggedInAdmin}) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [adminToken,] = useContext(AdminContext)

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + adminToken
            },
            body: JSON.stringify({ name: name, email: email, budget_total: budget, pass_hash: password })
        };

        const response = await fetch("/api/admins/createteam", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
            setSuccessMessage("");

        } else {
            setSuccessMessage("Team registered successfully!");
            setErrorMessage("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 8) {
            submitRegistration();
        } else {
            setErrorMessage("Ensure that the passwords are matching and longer than 8 characters.");
            setSuccessMessage("");
        }
    }



    if (loggedInAdmin){
    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register New Team</h1>

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
                    <label className="label">Team Name</label>
                    <div className="control">
                        <input
                            type="text"
                            placeholder="Team Name"
                            value={name}
                            onChange={(n) => setName(n.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Total Budget</label>
                    <div className="control">
                        <input
                            type="text"
                            placeholder="Budget"
                            value={budget}
                            onChange={(s) => setBudget(s.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <br />
                <br />

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

                <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                        <input
                            type="password"
                            placeholder="Password"
                            value={confirmationPassword}
                            onChange={(c) => setConfirmationPassword(c.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <ErrorMessage message={errorMessage} />
                <SuccessMessage message={successMessage} />
                <br />

                <button className="button is-primary" type="submit">
                    Register
                </button>

            </form>
        </div>


    );
    }

    return (null);

};

export default RegisterTeamAdmin;