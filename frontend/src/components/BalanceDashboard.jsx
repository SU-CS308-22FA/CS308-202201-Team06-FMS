import 'bootstrap/dist/css/bootstrap.css';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import React from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import SuccessMessage from "./SuccessMessage";
import { AdminContext } from "../context/AdminContext";
import { useContext } from "react";
import { useState, useEffect } from "react";
//import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js/auto';

import Chart from 'chart.js/auto';
import { Pie , Bar} from 'react-chartjs-2';
//ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Bar);


const BalanceDashboard = ({loggedInAdmin}) => {

    const [adminToken] = useContext(AdminContext);
    const [errorMessage, setErrorMessage] = useState("");
    const [teamsList, setTeamsList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [childLoading, setChildLoading] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [itemName, setItemName] = useState("");
    const [totalBalance, setTotalBalance] = useState(0);
    const [allocated, setAlloc] = useState(0);
    const [remaining, setRem] = useState(0);
    const [chartData, setChartData] = useState({});
    const [haveData, setHaveData] = useState(false);
    const [chartData2, setChartData2] = useState({});


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
            let iallocated = 0;
            let iremaining = 0;
            teamsList.map((team) => {
            
                iallocated += team.budget_alloc;
                iremaining += team.budget_rem;
            })
            setAlloc(iallocated);
            setRem(iremaining);
            setTotalBalance(allocated + remaining);
            setChartData({
                labels: teamsList.map((team) => team.name),
                datasets: [
                    {
                        label: "Team allocated ",
                        data: teamsList.map((team) => (team.budget_alloc + team.budget_rem)),
                        borderColor: "black",
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                          ],
                        
                        borderWidth: 2,
                    }
                ]
            });
            setChartData2({
                labels: teamsList.map((team) => team.name),
                datasets: [
                    {
                        label: "Allocated Resource ",
                        data: teamsList.map((team) => (team.budget_alloc)),
                        borderColor: "black",
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                          ],
                          borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                          ],
                        
                        borderWidth: 2,
                    }
                ]
            });

            setHaveData(true);
            //console.log(data);
        }
    };

    useEffect(() => {
        setChildLoading(true);
        setTimeout(() => {
            if (getTeams.length) return
            getTeams();
            setChildLoading(false);
        }, 200)
    }, [teamsList]);

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
            data.reverse();
            setItemList(data);
        }
    };

    useEffect(() => {
        setChildLoading(true);
        setTimeout(() => {
            getItems();
            setChildLoading(false);
        }, 100)
    }, [itemList]);

return (
<div className="mb-3 card">
<div className="card-header-tab card-header">
<div className="card-header-title font-size-lg text-capitalize font-weight-normal">
<i className="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
Dashboard
</div>
</div>
<div className="no-gutters row">
<div className="col-sm-6 col-md-4 col-xl-4">
<div className="card no-shadow rm-border bg-transparent widget-chart text-left">
<div className="icon-wrapper rounded-circle">
<div className="icon-wrapper-bg opacity-10 bg-warning"></div>
<i class="bi bi-currency-dollar"></i></div>
<div className="widget-chart-content">
<div className="widget-subheading">Total Balance</div>
<div>{totalBalance}</div>
<div className="widget-description opacity-8 text-focus">
</div>
</div>
</div>
<div className="divider m-0 d-md-none d-sm-block"></div>
</div>
<div className="col-sm-6 col-md-4 col-xl-4">
<div className="card no-shadow rm-border bg-transparent widget-chart text-left">
<div className="icon-wrapper rounded-circle">
<div className="icon-wrapper-bg opacity-9 bg-danger"></div>
<i className="lnr-graduation-hat text-white"></i></div>
<div className="widget-chart-content">
<div className="widget-subheading">Allocated Budget</div>
<div>{allocated}</div>
</div>
</div>
<div className="divider m-0 d-md-none d-sm-block"></div>
</div>
<div className="col-sm-12 col-md-4 col-xl-4">
<div className="card no-shadow rm-border bg-transparent widget-chart text-left">
 <div className="icon-wrapper rounded-circle">
<div className="icon-wrapper-bg opacity-9 bg-success"></div>
<i className="lnr-apartment text-white"></i></div>
<div className="widget-chart-content">
<div className="widget-subheading">Remaining Budget</div>
<div>{remaining}</div>
</div>
</div>
</div>
</div>
<div className="text-center d-block p-3 card-footer row">
{    
 (teamsList.length > 0) ? <div class="container">
  <div class="row">
    <div class="col-sm">
    {
    haveData ?
    <div className='col-sm'><Pie data = {chartData} /></div>
    : <div>Loading...</div>
    }
    </div>
    <div class="col-sm">
    {
    haveData ?
    <div className='col-sm'><Bar data = {chartData2} options={{plugins: {legend: {display: false}}}} /></div>
    : <div>Loading...</div>
    }
    </div>
    <div class="col-sm">
    <div className='col-sm'>LAST ACTIVITIES
        <table>
            <thead>
                <tr>
                    <th>Team Name</th>
                    <th>Item Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {
                    itemList.slice(0,3).map((item) => (
                        <tr>
                            <td>{item.team_name}</td>
                            <td>{item.item_name}</td>
                            <td>{item.amount}</td>
                            <td>{moment(item.date_created).format("MMM Do YY")}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
    </div>
  </div>
</div>
: <div>No team registered</div>
}


</div>
</div>);
}

export default BalanceDashboard;