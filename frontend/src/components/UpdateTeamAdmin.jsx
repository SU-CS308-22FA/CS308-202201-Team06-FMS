// Team update component
//
// @zgr2788

import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";

import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const UpdateTeamAdmin = ({loggedInAdmin}) => {
    const [namedb, setNamedb] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [adminToken,] = useContext(AdminContext)

    const submitUpdate = async (namedb) => {
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + adminToken
            },
            body: JSON.stringify({ name: name, email: email, budget_total: budget, pass_hash: password })
        };

        const response = await fetch('/api/admins/updateteam/' + namedb + "/", requestOptions);

        if (!response.ok) {
            setErrorMessage("Team not found in database!");
            setSuccessMessage("");

        } else {
            setSuccessMessage("Team updated successfully!");
            setErrorMessage("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitUpdate(namedb);
    }



    if (loggedInAdmin){
    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Update Existing Team</h1>

                <div className="field">
                    <label className="label">Old Team Name</label>
                    <div className="control">
                        <input
                            type="text"
                            placeholder="Team Name"
                            value={namedb}
                            onChange={(l) => setNamedb(l.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                <br />
                <br />
                <br />

                <div className="field">
                    <label className="label">New Team Name</label>
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
                    <label className="label">New Email Address</label>
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
                    <label className="label">New Total Budget</label>
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


                <div className="field">
                    <label className="label">New Password</label>
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
                    <label className="label">Confirm New Password</label>
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
                    Update
                </button>

            </form>
        </div>
    );
    }

    return (null);

};

export default UpdateTeamAdmin;