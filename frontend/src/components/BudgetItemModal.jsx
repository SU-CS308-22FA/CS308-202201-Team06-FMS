import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { TeamContext } from "../context/TeamContext";
import ErrorMessage from "./ErrorMessage";


const BudgetItemModal = ({ id, active, handleModal }) => {
    const [itemName, setItemName] = useState("");
    const [amount, setAmount] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName] = useContext(TeamContext);

    const cleanFormData = () => {
        setItemName("");
        setAmount("");
    }


    useEffect(() => {
        const getBudgetItem = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + teamToken,
                },
            };
            const response = await fetch(`/api/teams/getspecificitembyid/` + teamName + `/` + id, requestOptions);

            if (!response.ok) {
                setErrorMessage("Could not get the item!");
            } else {
                const data = await response.json;
                setItemName(data.item_name);
                setAmount(data.amount);
            }


        }

        if (id) {
            getBudgetItem();
        }
    }, [id, teamToken]);

    const handleCreateBudgetItem = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + teamToken,
            },
            body: JSON.stringify({
                item_name: itemName,
                amount: amount,
                team_name: teamName
            })

        };

        const response = await fetch("/api/teams/createitem", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            cleanFormData();
            setErrorMessage(null);
            handleModal();
        }
    }


    const handleUpdateBudgetItem = async (e) => {
        e.preventDefault();
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + teamToken,
            },
            body: JSON.stringify({
                item_name: itemName,
                amount: amount
            })
        };
        const response = await fetch(`/api/teams/updateitembyid/` + teamName + `/` + id, requestOptions);

        if (!response.ok) {
            setErrorMessage("Item names must be unique!");
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
                        {id ? "Update Item" : "Create Budget Item"}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>

                        <div className="field">
                            <label className="label">Item Name</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter the Item Name"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Amount</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter the Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">

                    {id ? (
                        <button className="button is-info" onClick={handleUpdateBudgetItem}>Update</button>
                    ) : (
                        <button className="button is-primary" onClick={handleCreateBudgetItem}>Create</button>

                    )}
                    < button className="button " onClick={() => {setErrorMessage(null);handleModal();}}>Cancel</button>
                    <ErrorMessage message={errorMessage} />
                </footer>


            </div>
        </div>
    )
}

export default BudgetItemModal;