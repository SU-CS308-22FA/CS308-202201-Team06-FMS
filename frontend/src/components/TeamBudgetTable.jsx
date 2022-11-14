import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { TeamContext } from "../context/TeamContext";
import { useContext } from "react";
import { useState, useEffect } from "react";

const TeamBudgetTable = ({ loggedInTeam }) => {
    const [teamToken,] = useContext(TeamContext);
    const [budgetItems, setBudgetItems] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [childLoading, setChildLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [itemName, setItemName] = useState(null);

    const getBudgetItems = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + teamToken,
            },
        };

        const response = await fetch("/api/teams/getitems", requestOptions);
        if (!response.ok) {
            setErrorMessage("Ooops, budget table could not be loaded! Contact the system admins for more detail.");
        }
        else {
            const data = await response.json();
            setBudgetItems(data);
        }
    };


    useEffect(() => {
            getBudgetItems();
            setChildLoading(false);
        }, 100)
    }, []);


    if (loggedInTeam) {
        return (

            <>
                <h1 style={{ allign: "center", fontSize: 30 }}>Team User Interface</h1>

                <button className="button is-fullwidth mb-5 is-primary">
                    Create New Budget Item
                </button>

                <ErrorMessage message={errorMessage} />
                {!childLoading ? (
                    <table className="table is-fullwidth">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Amount Name</th>
                                <th>Date Created</th>
                                <th>Date Last Updated</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {budgetItems.map((budgetItem) => (
                                <tr key={budgetItem.item_name}>
                                    <td>{budgetItem.item_name}</td>
                                    <td>{budgetItem.amount}</td>
                                    <td>{budgetItem.date_created}</td>
                                    <td>{budgetItem.date_last_updated}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (<p>Loading</p>)}

            </>
        );
    }

    return (null);


}

export default TeamBudgetTable;