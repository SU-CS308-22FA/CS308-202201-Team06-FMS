import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";
import { useState, useEffect } from "react";

const AdminItemTable = ({loggedInAdmin}) => {
    const [adminToken] = useContext(AdminContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [itemList, setItemList] = useState([]);
    const [childLoading, setChildLoading] = useState(false);

    const getItems = async () => {
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


    if (loggedInAdmin) {
    return (

        <>

            <ErrorMessage message={errorMessage} />
            {!childLoading ? (
                <table className="table is-fullwidth">
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
                            <tr>
                                <td>{item.team_name}</td>
                                <td>{item.item_name}</td>
                                <td>{item.amount}</td>
                                <td>{item.support_docs}</td>
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

export default AdminItemTable;