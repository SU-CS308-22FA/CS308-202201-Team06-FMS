import React from "react";
import ErrorMessage from "./ErrorMessage";
import { AdminContext } from "../context/AdminContext";
import { useState, useContext } from "react";


const AdminTeamCreateModal = ({ active, handleModal }) => {
    const [teamName, setTeamName] = useState("");
    const [teamMail, setTeamMail] = useState("");
    const [teamPass, setTeamPass] = useState("");
    const [teamPassConfirm, setTeamPassConfirm] = useState("");
    const [budget, setBudget] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [adminToken] = useContext(AdminContext);
    const [buttonText, setButtonText] = useState("Create")

    const cleanFormData = () => {
        setTeamName("");
        setTeamMail("");
        setBudget("");
        setTeamPass("");
        setTeamPassConfirm("");
    }

    const handleCreateTeam = async (e) => {
        e.preventDefault();

        if (!teamName || !teamMail || !budget || !teamPass || !teamPassConfirm) {
            setErrorMessage("Inputs cannot be empty!");
            return
        }

        
        if (teamPass === teamPassConfirm && teamPass.length > 8) {
            ;
        } else {
            setErrorMessage("Ensure that the passwords are matching and longer than 8 characters.");
            return
        }
 
        if (isNaN(budget) || Number(budget) <= 0) {
            setErrorMessage("Invalid Budget Entry!");
            return
        }

        setButtonText("Processing...")

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + adminToken,
            },
            body: JSON.stringify({
                name: teamName,
                pass_hash: teamPass,
                budget_total: budget,
                email: teamMail 
            })

        };

        const response = await fetch("/api/admins/createteam", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            cleanFormData();
            setErrorMessage(null);
            setButtonText("Create");
            handleModal();
        }
    }

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        Register New Team
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                    <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={teamMail}
                            onChange={(e) => setTeamMail(e.target.value)}
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
                            value={teamName}
                            onChange={(n) => setTeamName(n.target.value)}
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
                            value={teamPass}
                            onChange={(p) => setTeamPass(p.target.value)}
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
                            value={teamPassConfirm}
                            onChange={(c) => setTeamPassConfirm(c.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>

                </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-primary" onClick={handleCreateTeam}>{buttonText}</button>
                    < button className="button " onClick={() => {cleanFormData();setErrorMessage(null);handleModal();}}>Cancel</button>
                    <ErrorMessage message={errorMessage} />
                </footer>
            </div>
        </div>
    )
}

export default AdminTeamCreateModal;
