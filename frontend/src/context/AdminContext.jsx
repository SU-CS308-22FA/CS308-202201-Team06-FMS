// React context for admins
//
// @zgr2788

import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("AdminToken"))

    useEffect(() => {
        const fetchAdmin = async () => {
            
            // Get options
            const requestOptions = {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            
            // Get response
            const response = await fetch("/api/admins/me", requestOptions);

            if (!response.ok){
                setToken(null);
            }
            
            localStorage.setItem("AdminToken", token);
        };

        fetchAdmin();

    }, [token]);

    return (
        <AdminContext.Provider value = {[token, setToken]}>
            {props.children}
        </AdminContext.Provider>
    )
};

