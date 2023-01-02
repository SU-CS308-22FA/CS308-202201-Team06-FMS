import React from "react";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { TeamContext } from "../context/TeamContext";
import ErrorMessage from "./ErrorMessage";


const BudgetItemModal = ({ name, active, handleModal }) => {
    const [teamName, setTeamName] = useState("");
    const [teamMail, setTeamMail] = useState("");
    const [teamPass, setTeamPass] = useState("");
    const [budget, setBudget] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [adminToken] = useContext(AdminContext);

    const cleanFormData = () => {
        setTeamName("");
        setTeamMail("");
        setBudget("");
    }


    useEffect(() => {
        const getTeam = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + adminToken,
                },
            };
            const response = await fetch(`/api/admins/` + teamName, requestOptions);

            if (!response.ok) {
                setErrorMessage("Could not get the team!");
            } else {
                const data = await response.json();
                setTeamName(data.name);
                setTeamMail(data.email);
                setTeamPass("");
                setBudget(data.budget_total);
            }


        }

        if (name) {
            getTeam();
        }
    }, [name, adminToken]);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!teamName || !teamMail || !amount) {
            setErrorMessage("Inputs cannot be empty!")
            return
        }

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
            handleModal();
        }
    }

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        Create Budget Item
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>

                        <div className="field">
                            <label className="label">Team Name</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter the Team Name"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Budget</label>
                            <div className="control">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Enter the Budget"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-primary" onClick={handleCreateTeam}>Create</button>
                    < button className="button " onClick={() => {cleanFormData();setErrorMessage(null);handleModal();}}>Cancel</button>
                    <ErrorMessage message={errorMessage} />
                </footer>
            </div>
        </div>
    )
}

export default BudgetItemModal;
