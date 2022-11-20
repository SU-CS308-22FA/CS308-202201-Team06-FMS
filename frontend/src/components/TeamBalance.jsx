import React from "react";
import { TeamContext } from "../context/TeamContext";
import { useContext } from "react";
import { useState, useEffect } from "react";


const TeamBalance = ({ loggedInTeam }) => {
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName, rem, setRem, alloc, setAlloc] = useContext(TeamContext);

    if (teamLogin)
        return (
            <div className="rows">
                <div className=""> Allocated : {alloc} </div>
                <div className=""> Remaining : {rem}  </div>
                
              
            

            </div>

        );

    return (null);

}

export default TeamBalance;
