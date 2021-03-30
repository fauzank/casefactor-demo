import React, { useState, useEffect } from 'react';
// import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import LeftNavbar from '../left-navbar/left-navbar'
import { DataGrid, ColDef } from '@material-ui/data-grid';
// import * as Icon from '@material-ui/icons';
// import { InputAdornment, Popover, Paper, Checkbox, TablePagination, TableSortLabel } from '@material-ui/core';
// import { TextField, Dialog, DialogContent, DialogTitle, DialogActions, MenuItem } from '@material-ui/core';
import swal from 'sweetalert';
import * as queries from '../../graphql/queries';
// import * as mutations from '../../graphql/mutations';
import { API } from 'aws-amplify';

export default function ExtractTextPage() {


    const formatDateForDisplay = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return dt + '-' + month + '-' + year;
    };

    const params = useParams();
    const xid = params.xid;
    const [rows, setRows] = useState([]);
    const [entityRows, setEntityRows] = useState([]);
    const [respBody, setRespBody] = useState("");
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        getData();

    }, []);

    const getData = () => {
        let docType = localStorage.getItem("docType");
        let docUrl = localStorage.getItem("docUrl");
        console.log(docType, docUrl);
        if (docType !== undefined && docType === "Audio") {
            setPageTitle("Transcibe Audio Analysis");
            try {
                API.graphql({
                    query: queries.transcribeAudio,
                    variables: {
                        ExhibitId: xid,
                        DocumentURL: 'public/' + docUrl
                    }
                }).then((resp) => {
                    console.log(resp);
                    if(resp.data.transcribeAudio!==undefined && resp.data.transcribeAudio.Body!==undefined){
                        setRespBody(resp.data.transcribeAudio.Body); 
                    }
                    if (resp.data.transcribeAudio !== undefined && resp.data.transcribeAudio.KeyPhrases !== undefined && resp.data.transcribeAudio.KeyPhrases.length > 0) {
                        resp.data.transcribeAudio.KeyPhrases.forEach((element, index) => {
                            element['id'] = index;
                        });
                        setRows(resp.data.transcribeAudio.KeyPhrases);
                    }
                    if (resp.data.transcribeAudio !== undefined && resp.data.transcribeAudio.Entities !== undefined && resp.data.transcribeAudio.Entities.length > 0) {
                        resp.data.transcribeAudio.Entities.forEach((element, index) => {
                            element['id'] = index;
                        });
                        setEntityRows(resp.data.transcribeAudio.Entities);
                    }
                })
            } catch (err) { console.log(err) }

        } else if (docType !== undefined && (docType === "Legal Document" || docType === "Scanned Image")) {
            setPageTitle("Extracted Text Analysis");
            try {
                API.graphql({
                    query: queries.extractTextAnalysis,
                    variables: {
                        ExhibitId: xid,
                        DocumentURL: 'public/' + docUrl
                    }
                }).then((resp) => {
                    console.log(resp);
                    if(resp.data.extractTextAnalysis!==undefined && resp.data.extractTextAnalysis.Body!==undefined){
                        setRespBody(resp.data.extractTextAnalysis.Body); 
                    }
                    if (resp.data.extractTextAnalysis !== undefined && resp.data.extractTextAnalysis.KeyPhrases !== undefined && resp.data.extractTextAnalysis.KeyPhrases.length > 0) {
                        resp.data.extractTextAnalysis.KeyPhrases.forEach((element, index) => {
                            element['id'] = index;
                        });
                        setRows(resp.data.extractTextAnalysis.KeyPhrases);
                    }
                    if (resp.data.extractTextAnalysis !== undefined && resp.data.extractTextAnalysis.Entities !== undefined && resp.data.extractTextAnalysis.Entities.length > 0) {
                        resp.data.extractTextAnalysis.Entities.forEach((element, index) => {
                            element['id'] = index;
                        });
                        setEntityRows(resp.data.extractTextAnalysis.Entities);
                    }
                    //setRows(resp.data.getMovementsByExhibit.items)
                })
            } catch (err) { console.log(err) }
        } else {
            swal("Error", "Invalid file selected.", "error");
        }
    }



    const columns: ColDef[] = [
        { field: 'Text', headerName: 'Text', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Score', headerName: 'Score', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'BeginOffset', headerName: 'Begin Offset', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'EndOffset', headerName: 'End Offset', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) }
    ];

    const columnEntities: ColDef[] = [
        { field: 'Type', headerName: 'Type', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Text', headerName: 'Text', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Score', headerName: 'Score', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'BeginOffset', headerName: 'Begin Offset', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'EndOffset', headerName: 'End Offset', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) }
    ];

    return (
        <div className="App">
            <LeftNavbar pageTitle={pageTitle} />
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid card shadow p-3 bg-white rounded-1">
                        <div className="row">
                            <div className="col-12 text-right">
                                <button className="btn btn-danger" onClick={() => window.history.back()}>Back to Exhibit</button>
                            </div>
                        </div>
                        <div className="row">&nbsp;</div>
                        <div className="row">
                            <div className="col-12 text-justify">
                                <p>{respBody}</p>
                            </div>
                        </div>
                        <div className="row">&nbsp;</div>
                        <div style={{ height: 250, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} pageSize={5} />
                        </div>
                        <div className="row">&nbsp;</div>
                        <div style={{ height: 250, width: '100%' }}>
                            <DataGrid rows={entityRows} columns={columnEntities} pageSize={5} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}