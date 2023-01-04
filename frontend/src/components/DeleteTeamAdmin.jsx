// Team delete component
//
// @zgr2788

import React, { useState, useContext} from "react";
import { AdminContext } from "../context/AdminContext";

import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";

const DeleteTeamAdmin = ({loggedInAdmin}) => {
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [adminToken,] = useContext(AdminContext)

    const submitDelete = async (name) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + adminToken
            },
        };

        const response = await fetch('/api/admins/deleteteam/' + name + "/", requestOptions);

        if (!response.ok){
            setErrorMessage("Team not found in database!");
            setSuccessMessage("");

        } else {
            setSuccessMessage("Team deleted successfully!");
            setErrorMessage("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitDelete(name);
    }



    if (loggedInAdmin){
    return (
        <div className = "column">
            <form className = "box" onSubmit = {handleSubmit}>
                <h1 className = "title has-text-centered">Delete Existing Team</h1>
 
                <div className = "field">
                    <label className = "label">Team Name</label>
                    <div className="control">
                        <input 
                            type="text" 
                            placeholder = "Team Name" 
                            value = {name} 
                            onChange = { (n) => setName(n.target.value) }
                            className = "input"
                            required                        
                        />
                    </div>
                </div>

                <ErrorMessage message = {errorMessage} />
                <SuccessMessage message = {successMessage} />

                <br />

                <button className="button is-primary" type = "submit">
                    Delete
                </button>

            </form>
        </div>
    );
    }

    return (null);

};

export default DeleteTeamAdmin;