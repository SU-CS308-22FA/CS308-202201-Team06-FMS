# Financial Management System (FMS)

## Table of Contents
- **[Description](#description)**

- **For Users:**
    - [Current Deploy](#current-deploy)
    - [Local Install & Run](#local-install--run)
    - [Report Bugs](#report-bugs)
    - [Known Bugs](#known-bugs)

- **For Developers:**
    - [Source Code](#source-code)
    - [Directory Layout](#directory--branch-layout)
    - [Local Build & Deploy](#local-build--deploy)

## <a name="Desc"></a>Description
Financial Management System is a pilot application to answer the need of tracking team budgets by the Turkish Football Federation. It hopes to provide a user-friendly interface where system admins can track current Financial Fair-Play limits set forth by the federation with ease. 

## <a name="Dep"></a>Current Deploy
Find the current working copy by following **[this link](https://finmsapp.netlify.app/)**.

## <a name="Ins"></a>Local Install & Run
Please refer to the [Local Build & Deploy](#local-build--deploy) section and use the **main** branch for local installation of the software. 

## <a name="BugRep"></a>Report Bugs
- Use the [Issues](https://github.com/SU-CS308-22FA/CS308-202201-Team06-FMS/issues) tab for bug reports. Please specify which bug concerns which sprint if you can pinpoint the issue.
- If the issue is **unrecoverable**, make sure to use the **Highly Important** label.
- Use the following template:
        
        Description
        ===========
        Describe the issue
        
        Reporter
        ===========
        Leave identifier for yourself, with contact info if you are not registered to the repo
        
        Status
        ===========
        Leave this field empty, it will be filled by the repo admins

## <a name="BugKnw"></a>Known Bugs
- File preview modal does not load the pdf before activating itself. The previous pdf flashes before new one is opened.
- When server is busy, login becomes unresponsive.
- On Windows, the local deploy for backend will not work as the uvloop package is not yet available for Windows.

## <a name="Dev"></a>Source Code 
- Both the backend and the frontend source code are available in this repository. Just clone it to get started. 

## <a name="Dir"></a>Directory Layout
  
    root 
    | .gitignore
    | README.md
    |__ backend
        | Procfile
        | __init__.py
        | database.py
        | main.py
        | models.py
        | requirements.txt
        | schemas.py
        | services.py
        | setup.sh 
        |__ docs
        |__ exporttables
        |__ supportfiles
    |__frontend
       | .gitginore
       | README.md
       | package-lock.json
       | package.json
       |__ public
           | index.html
           | manifest.json
           | robots.txt
       |__ src
           | App.jsx
           | faq-css.css
           | index.js
           | setupProxy.js
           |__ components
               | AdminTable.jsx
               | BalanceDashboard.jsx
               | BudgetItemModal.jsx
               | DeleteTeamAdmin.jsx
               | ErrorMessage.jsx
               | FilePreviewModal.jsx
               | FileUploadModal.jsx
               | FrequentlyAskedQs.jsx
               | Header.jsx
               | LoginAdmin.jsx
               | LoginTeam.jsx
               | RegisterTeamAdmin.jsx
               | SuccessMessage.jsx
               | TeamBalance.jsx
               | TeamBudgetTable.jsx
               | UpdateTeamAdmin.jsx
           |__ context
               | AdminContext.jsx
               | TeamContext.jsx

## <a name="DepLoc"></a>Local Build & Deploy
1. Clone the repo
2. If you want to use the software locally, checkout to the main branch. Otherwise, checkout to the dev branch.
3. Enter the **backend** directory.
4. Run the shell script `setup.sh` in the current shell using:

       . setup.sh

5. Run another terminal and enter the **frontend** directory.
6. Install the necessary packages using **npm** with:

       npm install

7. Start the application with:

       npm start
