import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { TeamContext } from "../context/TeamContext";
import ErrorMessage from "./ErrorMessage";
import handleUpdate from "./TeamBudgetTable";

const BudgetItemModal = ({ itemname, active, handleModal }) => {
    const [itemName, setItemName] = useState(itemname);
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
            const response = await fetch(`/api/teams/getspecificitem` + itemName, requestOptions);

            if (!response.ok) {
                setErrorMessage("Could not get the item");
            } else {
                const data = await response.json;
                setItemName(data.item_name);
                setAmount(data.amount);
            }


        }

        if (itemName) {
            getBudgetItem();
        }
    }, [itemName, teamToken]);

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
                amount: amount
            })
        };
        const response = await fetch(`/api/teams/updateitem` + itemName, requestOptions);

        if (!response.ok) {
            setErrorMessage("Update error");
        } else {
            cleanFormData();
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
                                    type="number"
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

                    {(itemname !== itemName) || (itemName === "") ? (
                        <button className="button is-primary" onClick={handleCreateBudgetItem}>Create</button>

                    ) : (
                        <button className="button is-info" onClick={handleUpdateBudgetItem}>Update</button>


                    )}
                    < button className="button " onClick={handleModal}>Cancel</button>
                    <ErrorMessage message={errorMessage} />
                </footer>


            </div>
        </div >
    )
}

export default BudgetItemModal;