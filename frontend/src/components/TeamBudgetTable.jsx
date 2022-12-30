import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { TeamContext } from "../context/TeamContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import BudgetItemModal from "./BudgetItemModal";
import FileUploadModal from "./FileUploadModal";
import TableImportModal from "./TableImportModal";

const TeamBudgetTable = ({ loggedInTeam }) => {
    const [budgetItems, setBudgetItems] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [childLoading, setChildLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [activeUpload, setActiveUpload] = useState(false);
    const [activeImport, setActiveImport] = useState(false);
    const [itemName, setItemName] = useState(null);
    const [id, setId] = useState(null);
    const [file, setFile] = useState(null);
    const [selected, setSelected] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName, rem, setRem, alloc, setAlloc] = useContext(TeamContext);
    const [filteredItems, setFilteredItems] = useState(budgetItems);

    const handleSearchChange = (event) => {
        // Get the search query from the input element
        const searchQuery = event.target.value;

        // Filter the table data based on the search query
        const filteredItems = budgetItems.filter((budgetItem) =>
            budgetItem.item_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Update the state with the filtered data
        setFilteredItems(filteredItems);
    };


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
            setFilteredItems(data);
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

    const handleImport = () => {
        setActiveImport(!activeImport);
        getBudgetItems();
    }

    const handleDownload = async (itemName) => {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + teamToken
            },
        };

        const response = await fetch("/api/teams/getdocs/" + teamName + "/" + itemName, requestOptions);

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.detail);
        }
        else {
            setSuccessMessage("Downloading data for " + itemName + "...")

            const disposition = response.headers.get('Content-Disposition');
            var filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
            if (filename.toLowerCase().startsWith("utf-8''"))
                filename = decodeURIComponent(filename.replace("utf-8''", ''));
            else
                filename = filename.replace(/['"]/g, '');

            response.arrayBuffer().then(function (buffer) {
                const url = window.URL.createObjectURL(new Blob([buffer]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename); //or any other extension
                document.body.appendChild(link);
                link.click();
            });

        }
    }



    useEffect(() => {
        setTimeout(() => {
            setErrorMessage("");
            setSuccessMessage("");
        }, 3000)
    }, [errorMessage, successMessage]
    )

    const VerifyMessage = ({ isVerified }) => {
        if (isVerified) {
            return <p className="has-text-weight-bold has-text-success">Verified</p>
        }

        return <p className="has-text-weight-bold has-text-warning-dark">Pending</p>
    }

    const handleExport = async (teamName) => {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + teamToken
            },
        };

        const response = await fetch("/api/teams/exporttable/" + teamName , requestOptions);

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.detail);
        }
        else {
            setSuccessMessage("Exporting table...")

            const disposition = response.headers.get('Content-Disposition');
            var filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
            if (filename.toLowerCase().startsWith("utf-8''"))
                filename = decodeURIComponent(filename.replace("utf-8''", ''));
            else
                filename = filename.replace(/['"]/g, '');

            response.arrayBuffer().then(function (buffer) {
                const url = window.URL.createObjectURL(new Blob([buffer]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", filename); 
                document.body.appendChild(link);
                link.click();
            });

        }
    }


    const handlePrivate = async(teamName, id) => {
        const requestOptions = {
            method: "PUT",    
            headers: {
                Authorization: "Bearer " + teamToken
            },
        };

        const response = await fetch("/api/teams/setprivate/" + teamName + "/" + id, requestOptions);

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.detail);
        }

        getBudgetItems();
    }

    const DownloadButton = ({teamName}) => {
        return <button className="button mr-2 is-success is-pulled-right" onClick={() => {handleExport(teamName)}}>Export Table</button>
    }
    
    const ImportButton = ({teamName}) => {
        return <button className="button mr-2 is-info is-pulled-right" onClick={() => {handleImport(teamName)}}>Import Table</button>
    }


    const PrivateButton = ({teamName, isPriv, id}) => {
        if (isPriv){
            return  <button className="button mr-2 is-link" onClick={() => {handlePrivate(teamName, id)}}>Set Public</button>
        }

        return <button className="button mr-2 is-link" onClick={() => {handlePrivate(teamName, id)}}>Set Private</button>
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

            <TableImportModal
                active={activeImport}
                handleImport={handleImport}
            />
            
            <div className="columns">
                <div className="column">
                    <h1 style={{ align: "center", fontSize: 30 }}>Budget Table - {teamName} </h1>
                </div>
                <div className="column">
                    {errorMessage ? (<ErrorMessage message={errorMessage} />) : (<SuccessMessage message={successMessage} />)}
                </div>
                <div className="column"><ImportButton teamName={teamName}/></div>
                <div className="column"><DownloadButton teamName={teamName}/></div>
            </div>

            <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
                Create New Budget Item
            </button>

            {childLoading ? (
                <div>
                    <input type="text" placeholder="Search..." onChange={handleSearchChange} />

                    <table className="table is-fullwidth is-narrow is-bordered is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Amount</th>
                                <th>Date Created</th>
                                <th>Date Last Updated</th>
                                <th>Verification Status</th>
                                <th>Actions</th>
                                <th>Visibility</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((budgetItem) => (
                                <tr key={budgetItem.id}>
                                    <td>{budgetItem.item_name}</td>
                                    <td>{budgetItem.amount}</td>
                                    <td>{moment(budgetItem.date_created).format("MMM Do YY")}</td>
                                    <td>{moment(budgetItem.date_last_updated).format("MMM Do YY")}</td>
                                    <td>
                                        {!budgetItem.doc_rejected ? (<VerifyMessage isVerified={budgetItem.doc_verified} />) : (<p className="has-text-weight-bold has-text-danger-dark">Rejected</p>)}
                                    </td>
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

                                        {budgetItem.support_docs ? (
                                            <button className="button mr-2 is-info is-light" onClick={() => { handleDownload(budgetItem.item_name) }}>
                                                Download Documents
                                            </button>
                                        ) : (
                                            <br></br>
                                        )
                                        }
                                    </td>
                                    <td>
                                    {!budgetItem.is_private || budgetItem.doc_verified || budgetItem.doc_rejected ? (
                                            <p className="has-text-weight-bold has-text-primary-dark">Public</p>
                                        ) : (
                                            <p className="has-text-weight-bold has-text-info-dark">Private</p>
                                        )
                                        }
                                    
                                        {budgetItem.doc_verified || budgetItem.doc_rejected ? (
                                            <br></br>
                                        ) : (
                                            <PrivateButton teamName={teamName} isPriv={budgetItem.is_private} id={budgetItem.id}/>
                                        )
                                        }



                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (<p>Loading</p>)}

        </>
    );





}

export default TeamBudgetTable;