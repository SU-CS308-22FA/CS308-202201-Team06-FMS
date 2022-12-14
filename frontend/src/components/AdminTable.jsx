import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import FilePreviewModal from "./FilePreviewModal";
import AdminTeamCreateModal from "./AdminTeamCreateModal";
import AdminTeamUpdateModal from "./AdminTeamUpdateModal";
import RegisterAdmin from "./RegisterAdmin";
import DeleteTeamAdmin from "./DeleteTeamAdmin";

const AdminTable = ({ loggedInAdmin }) => {
    const [adminToken] = useContext(AdminContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [teamsList, setTeamsList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [childLoading, setChildLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [activeAdminCreate, setActiveAdminCreate] = useState(false);
    const [activeCreate, setActiveCreate] = useState(false);
    const [activeUpdate, setActiveUpdate] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [itemName, setItemName] = useState("");

    const submitDelete = async (name) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + adminToken
            },
        };

        const response = await fetch('/api/admins/deleteteam/' + name + "/", requestOptions);

        if (!response.ok) {
            setErrorMessage("Team not found in database!");
            setSuccessMessage("");

        } else {
            setSuccessMessage("Team deleted successfully!");
            setErrorMessage("");
        }
        getTeams();
    };



    const getTeams = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + adminToken,
            },
        };

        const response = await fetch("/api/admins/getteams/", requestOptions);
        if (!response.ok) {
            setErrorMessage(response.status);
        }
        else {
            const data = await response.json();
            setTeamsList(data);
            console.log(data);
        }
    };

    useEffect(() => {
        setChildLoading(true);
        setTimeout(() => {
            getTeams();
            setChildLoading(false);
        }, 100)
    }, []);

    const getItems = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + adminToken,
            },
        };

        const response = await fetch("/api/admins/getallitems/", requestOptions);
        if (!response.ok) {
            setErrorMessage(response.status);
        }
        else {
            const data = await response.json();
            setItemList(data);
        }
    };

    useEffect(() => {
        setChildLoading(true);
        setTimeout(() => {
            getItems();
            setChildLoading(false);
        }, 100)
    }, []);

    const handleVerify = async (teamName, itemName) => {
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + adminToken
            },
        };

        const response = await fetch("/api/admins/verifydocs/" + teamName + "/" + itemName + "/", requestOptions);

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.detail);
        }

        getItems();
    }

    const handleReject = async (teamName, itemName) => {
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: "Bearer " + adminToken
            },
        };

        const response = await fetch("/api/admins/rejectdocs/" + teamName + "/" + itemName + "/", requestOptions);

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.detail);
        }

        getItems();
    }


    const handlePreview = async (itemName, teamName) => {
        setItemName(itemName);
        setTeamName(teamName);
        setActiveModal(true);
    }

    const handleModal = async () => {
        setActiveModal(!activeModal);
        setTeamName(null);
        setItemName(null);
    }

    const handleCreateAdminModal = async () => {
        setActiveAdminCreate(!activeAdminCreate);
        setErrorMessage(null);
    }

    const handleCreate = async () => {
        setActiveCreate(!activeCreate);
        setErrorMessage(null);
        getTeams();
    }



    const handleUpdate = async (teamName) => {
        setTeamName(teamName);
        setActiveUpdate(!activeUpdate);
        setErrorMessage(null);
        getTeams();
    }

    const handleDownload = async (itemName, teamName) => {
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + adminToken
            },
        };

        const response = await fetch("/api/admins/getdocs/" + teamName + "/" + itemName + "/", requestOptions);

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

    const NoDocMessage = ({ isRejected }) => {
        if (isRejected) {
            return null
        }

        return <p className="has-text-weight-bold has-text-warning-dark">No docs</p>
    }

    const VerifyButton = ({ itemName, teamName, isVerified }) => {
        if (isVerified) {
            return <button className="button mr-2 is-danger is-light" onClick={() => handleVerify(teamName, itemName)}>Revoke</button>
        }
        return <button className="button mr-2 is-success is-light" onClick={() => handleVerify(teamName, itemName)}>Verify</button>
    }

    const RejectButton = ({ itemName, teamName }) => {
        return <button className="button mr-2 is-danger" onClick={() => handleReject(teamName, itemName)}>Reject</button>
    }

    const PreviewButton = ({ itemName, teamName }) => {
        return <button className="button mr-2 is-info" onClick={() => { handlePreview(itemName, teamName) }}>Preview</button>
    }

    const DownloadButton = ({ itemName, teamName }) => {
        return <button className="button mr-2 is-success" onClick={() => { handleDownload(itemName, teamName) }}>Download</button>
    }

    const UpdateButton = ({ teamName }) => {
        return <button className="button mr-2 is-info is-light" onClick={() => { handleUpdate(teamName) }}>Update</button>
    }

    const DeleteButton = ({ teamName }) => {
        return <button className="button mr-2 is-info is-danger" onClick={() => { submitDelete(teamName) }}>Delete</button>

    }

    if (loggedInAdmin) {
        return (

            <>
                <FilePreviewModal
                    teamName={teamName}
                    itemName={itemName}
                    active={activeModal}
                    handleModal={handleModal}
                />

                <RegisterAdmin
                    loggedInAdmin={loggedInAdmin}
                    active={activeAdminCreate}
                    handleModal={handleCreateAdminModal}
                />

                <AdminTeamCreateModal
                    active={activeCreate}
                    handleModal={handleCreate}
                />


                <AdminTeamUpdateModal
                    name={teamName}
                    loggedInAdmin={loggedInAdmin}
                    active={activeUpdate}
                    handleModal={handleUpdate}
                />

                <ErrorMessage message={errorMessage} />
                {!childLoading ? (
                    <div className="rows">
                        <div className="columns">
                            <div className="column">

                                <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveCreate(true)}>
                                    Register Team
                                </button>

                                <table className="table table is-fullwidth is-bordered is-striped is-narrow is-hoverable">
                                    <thead>
                                        <tr>
                                            <th>Team Id</th>
                                            <th>Team Name</th>
                                            <th>Allocated Budget</th>
                                            <th>Remaining Budget</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamsList.map((team) => (
                                            <tr key={team.id}>
                                                <td>{team.id}</td>
                                                <td>{team.name}</td>
                                                <td>{team.budget_alloc}</td>
                                                <td>{team.budget_rem}</td>
                                                <td>
                                                    <UpdateButton teamName={team.name} />
                                                    <DeleteButton teamName={team.name} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="column">
                                <button className="button is-fullwidth mb-5 is-warning" onClick={() => setActiveAdminCreate(true)}>
                                    Register Admin
                                </button>
                                <table className="table is-fullwidth is-bordered is-striped is-narrow is-hoverable">
                                    <thead>
                                        <tr>
                                            <th>Team Name</th>
                                            <th>Item Name</th>
                                            <th>Amount</th>
                                            <th>Documents</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemList.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.team_name}</td>
                                                <td>{item.item_name}</td>
                                                <td>{item.amount}</td>
                                                <td>
                                                    {(item.support_docs && !item.doc_rejected) ? (
                                                        <VerifyButton
                                                            itemName={item.item_name}
                                                            teamName={item.team_name}
                                                            isVerified={item.doc_verified}
                                                        />) :

                                                        (<NoDocMessage isRejected={item.doc_rejected} />)
                                                    }
                                                    {(item.support_docs && !item.doc_rejected) ? (<RejectButton itemName={item.item_name} teamName={item.team_name} />) : (null)}
                                                    {(item.support_docs && !item.doc_rejected) ? (<DownloadButton itemName={item.item_name} teamName={item.team_name} />) : (null)}
                                                    {(item.support_docs && !item.doc_rejected) ? (<PreviewButton itemName={item.item_name} teamName={item.team_name} />) : (null)}
                                                    {(item.doc_rejected) ? (<p className="has-text-weight-bold has-text-danger">Rejected</p>) : (null)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                ) : (<p>Loading</p>)}

            </>
        );
    }

    return (null);


}

export default AdminTable;