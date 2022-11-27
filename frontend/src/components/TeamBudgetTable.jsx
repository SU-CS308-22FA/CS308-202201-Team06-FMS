import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { TeamContext } from "../context/TeamContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import BudgetItemModal from "./BudgetItemModal";
import FileUploadModal from "./FileUploadModal";

const TeamBudgetTable = ({ loggedInTeam }) => {
    const [budgetItems, setBudgetItems] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [childLoading, setChildLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [activeUpload, setActiveUpload] = useState(false);
    const [itemName, setItemName] = useState(null);
    const [id, setId] = useState(null);
    const [file, setFile] = useState(null);
    const [selected, setSelected] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName, rem, setRem, alloc, setAlloc] = useContext(TeamContext);

    const handleDelete = async (item_name) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + teamToken,
            },
        };

        const response = await fetch(`/api/teams/deleteitem/` + teamName + "/" + item_name, requestOptions);

        if (!response.ok) {
            setErrorMessage("Failed to delete item");
        }
        else {
            setErrorMessage("");
        }

        getBudgetItems();
    }

    const handleUpdate = async (id) => {
        setId(id);
        setActiveModal(true);
    }

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
            setErrorMessage("Ooops, budget table could not be loaded! Refresh the page and try again.");
        }
        else {
            const data = await response.json();
            setBudgetItems(data);
            setChildLoading(true);
            setAlloc(null);
            setRem(null);
        }
    };


    useEffect(() => {
        getBudgetItems();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getBudgetItems();
        setId(null);
        setErrorMessage(null);
    }

    const handleUpload = () => {
        setActiveUpload(!activeUpload);
        getBudgetItems();
        setSelected(null);
    }



    return (

        <>
            <BudgetItemModal
                id={id}
                active={activeModal}
                handleModal={handleModal}
            />

            <FileUploadModal
                active={activeUpload}
                handleUpload={handleUpload}
                itemName={selected}
                uploadStatus={uploadStatus}
            />
            <h1 style={{ allign: "center", fontSize: 30 }}>Budget Table - {teamName} </h1>

            <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
                Create New Budget Item
            </button>

            <ErrorMessage message={errorMessage} />
            {childLoading ? (
                <table className="table is-fullwidth is-bordered is-striped is-narrow is-hoverable">
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
                            <tr key={budgetItem.id}>
                                <td>{budgetItem.item_name}</td>
                                <td>{budgetItem.amount}</td>
                                <td>{moment(budgetItem.date_created).format("MMM Do YY")}</td>
                                <td>{moment(budgetItem.date_last_updated).format("MMM Do YY")}</td>
                                <td>
                                    <button className="button mr-2 is-info is-light" onClick={() => handleUpdate(budgetItem.id)}>
                                        Update
                                    </button>
                                    <button className="button mr-2 is-danger is-light" onClick={() => handleDelete(budgetItem.item_name)}>
                                        Delete
                                    </button>
                                    {budgetItem.support_docs ? (
                                        <button className="button mr-2 is-success is-light" onClick={() => { setSelected(budgetItem.item_name); setUploadStatus("Update"); setActiveUpload(true) }}>
                                            Update Documents
                                        </button>
                                    ) : (
                                        <button className="button mr-2 is-warning is-light" onClick={() => { setSelected(budgetItem.item_name); setUploadStatus("Add"); setActiveUpload(true) }}>
                                            Add Documents
                                        </button>)

                                    }


                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (<p>Loading</p>)}

        </>
    );





}

export default TeamBudgetTable;