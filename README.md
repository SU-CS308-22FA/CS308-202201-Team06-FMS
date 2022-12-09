# Financial Management System (FMS)

## Table of Contents
- **[Description](#Desc)**

- **For Users:**
    - [Current Deploy](#Dep)
    - [Local Install & Run](#Ins)
    - [Report Bugs](#BugRep)
    - [Known Bugs](#BugKnw)

- **For Developers:**
    - [Source Code](#Dev)
    - [Directory & Branch Layout](#Dir)
    - [Local Build & Deploy](#DepLoc)

## <a name="Desc"></a>Description
Financial Management System is a pilot application to answer the need of tracking team budgets by the Turkish Football Federation. It hopes to provide a user-friendly interface where system admins can track current Financial Fair-Play limits set forth by the federation with ease. 

## <a name="Dep"></a>Current Deploy
Find the current working copy by following **[this link](https://finms.onrender.com/)**.

## <a name="Ins"></a>Local Install & Run
Please refer to the [Local Build & Deploy](#Dev) section and use the **main** branch for local installation of the software. 

## <a name="BugRep"></a>Report Bugs
- Use the [Issues](https://github.com/SU-CS308-22FA/CS308-202201-Team06-FMS/issues) tab for bug reports. Please specify which bug concerns which sprint if you can pinpoint the issue.
- If the issue is **unrecoverable**, make sure to use the **Highly Important** label.

## <a name="BugKnw"></a>Known Bugs
- File preview modal does not load the pdf before activating itself. The previous pdf flashes before new one is opened.
- When server is busy, login becomes unresponsive.
- On Windows, the local deploy for backend will not work as the uvloop package is not yet available for Windows.

## <a name="Dev"></a>Source Code 
- Both the backend and the frontend source code are available in this repository. Just clone it to get started. 
## <a name="Dir"></a>Directory & Branch Layout
### backend
- Includes all the files used in the FastAPI backend. All filenames are self-explanatory.
- The `supportdocuments` folder should not be touched to ensure synchronization. It is used by the backend to store files.
### frontend
#### public
- This is the root directory of the serviced frontend.
#### src 
- components: Includes all the react components for the app.
- context: Includes the client and admin contexts used within the app.
### Branching
#### main
- The serviced branch.
#### dev
- The development branch. Should be cloned and then checked out to a new feature branch
#### feature & task branches
- Identified by the keyword. Are deleted after the corresponding feature is pushed to dev.

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
