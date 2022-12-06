import React from "react";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { AdminContext } from "../context/TeamContext";
import { ErrorMessage } from "../components/ErrorMessage";




const FilePreviewModal = ({teamName, itemName, active, handleModal}) => {
    const [file, setFile] = useState(null);
    const [admintoken, setAdminToken, adminLogin, setAdminLogin] = useContext(AdminContext);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const getPdf = async () => {
            const requestOptions = {
                method: "GET",    
                headers: {
                    Authorization: "Bearer " + adminToken
                },
            };
    
            const response = await fetch("/api/admins/getdocs/" + teamName + "/" + itemName, requestOptions);
    
            if (!response.ok) {
                const data = await response.json();
                setErrorMessage(data.detail);
            }
            else {
                setFile(response);
            }

        }}, []);

    const handleCreateBudgetItem = async (e) => {
        e.preventDefault();
        if (!itemName || !amount) {
            setErrorMessage("Inputs cannot be empty!")
            return
        }

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

        if (!itemName || !amount) {
            setErrorMessage("Inputs cannot be empty!")
            return
        }
        
        const requestOptions = {
            method: "PUT",
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
        console.log(itemName, amount, teamName)
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
                        Preview Pdf
                    </h1>
                </header>
                <section className="modal-card-body">
                        Pdf Displayed Here
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    < button className="button " onClick={() => {handleModal();}}>Close</button>
                    <ErrorMessage message={errorMessage} />
                </footer>
            </div>
        </div>
    )
}

export default FilePreviewModal;
