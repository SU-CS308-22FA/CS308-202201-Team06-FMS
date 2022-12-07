import React from "react";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import ErrorMessage from "./ErrorMessage";
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin, ToolbarSlot, TransformToolbarSlot } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';




const FilePreviewModal = ({teamName, itemName, active, handleModal}) => {
    
    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
        ...slot,
        // These slots will be empty
        Open: () => <></>,
        Download: () => <></>,
        SwitchTheme: () => <></>,
        Print:() => <></>,
        SwitchScrollModeMenuItem:() => <></>,
        RotateBackwardMenuItem: () => <></>,
        RotateForwardMenuItem: () => <></>,
        ShowPropertiesMenuItem: () => <></>
    });

    const [filename, setFilename] = useState(null);
    const [buf, setBuf] = useState(null);
    const [adminToken, setAdminToken, adminLogin, setAdminLogin] = useContext(AdminContext);

    const getPdf = async () => {
        const requestOptions = {
            method: "GET",    
            headers: {
                Authorization: "Bearer " + adminToken
            },
        };

        const response = await fetch("/api/admins/getdocs/" + teamName + "/" + itemName, requestOptions);

        if (response.ok) {

            const disposition = response.headers.get('Content-Disposition');
            var filename = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
            if (filename.toLowerCase().startsWith("utf-8''"))
                setFilename(decodeURIComponent(filename.replace("utf-8''", '')));
            else
                setFilename(filename = filename.replace(/['"]/g, ''));

            response.arrayBuffer().then(function(buf) 
                {
                    var uint8View = new Uint8Array(buf);
                    setBuf(uint8View);
                }
            )
        }
    }

    useEffect(() => {        
        if (itemName && teamName) {
            getPdf();
        }
    }, [teamName, itemName, adminToken]);


    const PdfView = ({buf}) => {
        return <Viewer fileUrl={buf} plugins={[toolbarPluginInstance]}/>
    }

    if (!active || !buf){
        return null;
    }

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        Preview {filename}
                    </h1>
                </header>
                <section className="modal-card-body">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
                    <div
                        style={{
                            height: '100%',
                        }}
                    >
                                <div
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: '#eeeeee',
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                        display: 'flex',
                                        padding: '4px',
                                    }}
                                >
                                    <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                                </div>
                        <PdfView buf={buf} />
                    </div>
                </Worker>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    < button className="button " onClick={() => {handleModal();}}>Close</button>
                </footer>
            </div>
        </div>
    )
}

export default FilePreviewModal;
