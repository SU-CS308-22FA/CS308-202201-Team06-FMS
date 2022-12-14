import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { TeamContext } from "../context/TeamContext";
import ErrorMessage from "./ErrorMessage";

const TableImportModal = ({ active, handleImport }) => {

    const [file, setFile] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName] = useContext(TeamContext);

    const cleanFormData = () => {
        setFile("");
    }

    const handleTableImport = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("File upload cannot be left empty!");
            return
        }
        const formData = new FormData();
        formData.append("file", file, file.name);

        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + teamToken,
            },

            body: formData
        };

        const response = await fetch("/api/teams/importtable/" + teamName + "/", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            cleanFormData();
            document.getElementById("fileUpload").value = "";
            handleImport();
        }
    }

    function handleChange(event) {
        setFile(event.target.files[0])
      }

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleImport}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        Import table for {teamName}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Excel Table</label>
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

                    <button className="button is-primary" onClick={handleTableImport}>Import</button>
                    <button className="button " onClick = {() => {document.getElementById("fileUpload").value = ""; setErrorMessage(null); handleImport()}}>Cancel</button>
                    <ErrorMessage message={errorMessage} />
                </footer>


            </div>
        </div>
    )
}

export default TableImportModal;