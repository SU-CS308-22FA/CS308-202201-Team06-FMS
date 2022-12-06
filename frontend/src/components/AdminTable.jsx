import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";
import { useState, useEffect } from "react";

const AdminTable = ({ loggedInAdmin }) => {
    const [adminToken] = useContext(AdminContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [teamsList, setTeamsList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [childLoading, setChildLoading] = useState(false);


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

        const response = await fetch("/api/admins/verifydocs/" + teamName + "/" + itemName, requestOptions);

        if (!response.ok) {
            const data = await response.json();
            setErrorMessage(data.detail);
        }

        getItems();
    }

    const handleReject = async (teamName, itemName) => {
        console.log("lol")
    }

    const VerifyButton = ({itemName, teamName, isVerified}) => {
        if (isVerified){
            return <button className="button mr-2 is-danger is-light" onClick={() => handleVerify(teamName, itemName)}>Revoke</button> 
        }
        return <button className="button mr-2 is-success is-light" onClick={() => handleVerify(teamName, itemName)}>Verify</button> 
    }

    const RejectButton = ({itemName, teamName}) => {
        return <button className="button mr-2 is-danger" onClick={() => handleReject(teamName, itemName)}>Reject</button>
    }

    if (loggedInAdmin) {
        return (

            <>

                <ErrorMessage message={errorMessage} />
                {!childLoading ? (
                    <div className="rows">
                        <button className="button is-fullwidth mb-5 is-info" onClick={() => { getItems(); getTeams(); }}>
                            Refresh Info
                        </button>
                        <div className="columns">
                            <div className="column">
                                <table className="table table is-fullwidth is-bordered is-striped is-narrow is-hoverable">
                                    <thead>
                                        <tr>
                                            <th>Team Id</th>
                                            <th>Team Name</th>
                                            <th>Budget_Allocated</th>
                                            <th>Budget_Remaining</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamsList.map((team) => (
                                            <tr key={team.id}>
                                                <td>{team.id}</td>
                                                <td>{team.name}</td>
                                                <td>{team.budget_alloc}</td>
                                                <td>{team.budget_rem}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>                        <div className="column">
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
                                                    {(item.support_docs) ? (
                                                    <VerifyButton 
                                                        itemName={item.item_name} 
                                                        teamName={item.team_name}
                                                        isVerified={item.doc_verified}
                                                    />) : 
                                                    
                                                    (<p className = "has-text-weight-bold has-text-danger">No docs!</p>)
                                                    }
                                                    {(item.support_docs) ? (<RejectButton itemName={item.item_name} teamName={item.team_name}/>) : (<br></br>)}    
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