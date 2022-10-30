import React from 'react';
import ReactDOM from 'react-dom/client';
import "bulma/css/bulma.min.css";
import App from './App';

import { AdminProvider } from './context/AdminContext';
import { TeamProvider } from './context/TeamContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AdminProvider>
    <TeamProvider>
        <App />
    </TeamProvider>
    </AdminProvider>
   
);
