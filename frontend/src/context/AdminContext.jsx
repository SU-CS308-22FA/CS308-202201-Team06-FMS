// React context for admins
//
// @zgr2788

import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("AdminToken"))
    const [login, setLogin] = useState(localStorage.getItem("AdminLogin"))

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

            if (response.ok){
                setLogin(true);
            }
            
            localStorage.setItem("AdminToken", token);
            localStorage.setItem("AdminLogin", login)
        };

        fetchAdmin();

    }, [token]);

    return (
        <AdminContext.Provider value = {[token, setToken, login, setLogin]}>
            {props.children}
        </AdminContext.Provider>
    )
};

