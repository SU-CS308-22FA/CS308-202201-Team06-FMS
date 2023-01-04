import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { TeamContext } from "../context/TeamContext";
import ErrorMessage from "./ErrorMessage";

const FileUploadModal = ({ active, handleUpload, itemName, uploadStatus }) => {

    const [file, setFile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName] = useContext(TeamContext);

    const cleanFormData = () => {
        setFile("");
    }

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("File upload cannot be left empty!");
            return
        }
        const formData = new FormData();
        formData.append("file", file, file.name);
        
        console.log(file.name)
        console.log(file.type)

        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + teamToken,
            },

            body: formData
        };

        const response = await fetch("/api/teams/docs/" + teamName + "/" + itemName + "/", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            cleanFormData();
            document.getElementById("fileUpload").value = "";
            handleUpload();
        }
    }

    function handleChange(event) {
        setFile(event.target.files[0])
      }

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleUpload}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {uploadStatus} documents for {itemName}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Documents</label>
                            <div className="control">
                                <input
                                    id="fileUpload"
                                    type="file"
                                    placeholder="Choose files..."
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">

                    <button className="button is-primary" onClick={handleFileUpload}>Upload</button>
                    <button className="button " onClick = {() => {document.getElementById("fileUpload").value = ""; setErrorMessage(null); handleUpload()}}>Cancel</button>
                    <ErrorMessage message={errorMessage} />
                </footer>


            </div>
        </div>
    )
}

export default FileUploadModal;