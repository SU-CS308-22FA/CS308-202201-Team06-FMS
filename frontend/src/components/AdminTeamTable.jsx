import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";
import { useState, useEffect } from "react";

const AdminTeamTable = ({loggedInAdmin}) => {
    const [adminToken] = useContext(AdminContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [teamsList, setTeamsList] = useState([]);
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


    if (loggedInAdmin) {
    return (

        <>

            <ErrorMessage message={errorMessage} />
            {!childLoading ? (
                <div className="rows">
                    <button className="button is-fullwidth mb-5 is-info" onClick={() => getTeams()}>
                        Refresh Info
                    </button>
                    <table className="table is-fullwidth">
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
                </div>
                
            ) : (<p>Loading</p>)}

        </>
    );
    }

    return (null);


}

export default AdminTeamTable;