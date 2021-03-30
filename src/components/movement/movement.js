import React, { useState, useEffect } from 'react';
// import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import LeftNavbar from '../left-navbar/left-navbar'
import { DataGrid, ColDef } from '@material-ui/data-grid';
// import * as Icon from '@material-ui/icons';
// import { InputAdornment, Popover, Paper, Checkbox, TablePagination, TableSortLabel } from '@material-ui/core';
// import { TextField, Dialog, DialogContent, DialogTitle, DialogActions, MenuItem } from '@material-ui/core';
// import swal from 'sweetalert';
import * as queries from '../../graphql/queries';
// import * as mutations from '../../graphql/mutations';
import { API } from 'aws-amplify';

export default function MovementComp() {


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
    const eid = params.exid;
    const [rows, setRows] = useState([]);

    useEffect(() => {
        try {
            API.graphql({
                query: queries.getMovementsByExhibit,
                variables: {
                    ExhibitId: eid
                }
            }).then((resp) => {
                console.log(resp);
                setRows(resp.data.getMovementsByExhibit.items)
            })
        } catch (err) { console.log(err) }
    }, []);
    const columns: ColDef[] = [
        { field: 'IssueDate', headerName: 'Issue Date', flex: 1, valueFormatter: (params: ValueFormatterParams) => formatDateForDisplay(new Date(params.value)) },
        { field: 'IssuedToName', headerName: 'Assigned To', flex: 1 }
    ];

    return (
        <div className="App">
            <LeftNavbar pageTitle="Movement Details" />
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid card shadow p-3 bg-white rounded-1">
                    <div className="row">
                            <div className="col-12 text-right">
                                <button className="btn btn-danger" onClick={()=> window.history.back()}>Back to Exhibit</button>
                            </div>
                        </div>
                        <div className="row">&nbsp;</div>
                        <div style={{ height: 450, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} pageSize={5} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}