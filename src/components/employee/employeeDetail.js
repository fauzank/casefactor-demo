import LeftNavbar from '../left-navbar/left-navbar'
import { DataGrid, ColDef } from '@material-ui/data-grid';
import * as Icon from '@material-ui/icons';
import React, { useState } from 'react';
import { TextField, InputAdornment, MenuItem } from '@material-ui/core';
import swal from 'sweetalert';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

export default function EmployeeDetail() {

    const formatDateForTextField = (date) => {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return year + '-' + month + '-' + dt;
    }

    const [showHistory, setShowHistory] = useState(false);
    const [employeeId, setEmployeeId] = useState("");
    const [PersonId, setPersonId] = useState("");
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [DOB, setDOB] = useState(null);
    const [PhoneNo, setPhoneNo] = useState("");
    const [Email, setEmail] = useState("");
    const [GovId, setGovId] = useState("");
    const [GovIdType, setGovIdType] = useState("");
    const [Address, setAddress] = useState("");
    const [Role, setRole] = useState("");


    const [rows, setRows] = useState([]);

    function formatDateTime(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes;
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }
        return dt + '-' + month + '-' + year+ " " + strTime;
      }
     
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
    }
    // NQ-1542-2318
    const getHistoryData = () => {
        console.log(employeeId);
        console.log(PersonId);
        try {
            API.graphql({
                query: queries.getPersonHistory,
                variables: {
                    "PersonId": PersonId
                }
            }).then((resp) => {
                console.log(resp);
                setShowHistory(true);
                if (resp.data.getPersonHistory !== null && resp.data.getPersonHistory !== undefined) {
                    if(resp.data.getPersonHistory.items!==undefined && resp.data.getPersonHistory.items.length>0){
                        resp.data.getPersonHistory.items.forEach((element,index) => {
                            element["id"] = index;
                        });
                        console.log(resp.data.getPersonHistory.items);
                        setRows(resp.data.getPersonHistory.items)
                    }
                }
            })
        } catch (err) { console.log(err) }
    }

    const columns: ColDef[] = [
        { field: 'FirstName', headerName: 'First Name', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'LastName', headerName: 'Last Name', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'DOB', headerName: 'DOB', flex: 1, renderCell: (params: GridCellParams) => (<div title={formatDateForDisplay(new Date(params.value))} ><span>{formatDateForDisplay(new Date(params.value))}</span></div>) },
        { field: 'PhoneNo', headerName: 'PhoneNo', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Email', headerName: 'Email', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>)},
        { field: 'GovId', headerName: 'Gov Id', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'GovIdType', headerName: 'Gov Id Type', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Address', headerName: 'Address', flex: 2, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Role', headerName: 'Role', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'txTime', headerName: 'Date', flex: 2, renderCell: (params: GridCellParams) => (<div title={formatDateTime(new Date(params.value))} ><span>{formatDateTime(new Date(params.value))}</span></div>)  },
        { field: 'version', headerName: 'Version', flex: 1, renderCell: (params: any) =>  (<div title={params.value} ><span>{params.value}</span></div>) },
    ];

    const searchPersonData = () => {
        if (PersonId === undefined || PersonId === "") {
            swal("Error", "Enter Id to Search", "error");
            return
        }

        try {
            API.graphql({
                query: queries.getPerson,
                variables: {
                    "PersonId": PersonId
                }
            }).then((resp) => {
                console.log(resp);
                if (resp.data.getPerson !== undefined && resp.data.getPerson !== null) {
                    let row = resp.data.getPerson;
                    setEmployeeId(row.id);
                    setPersonId(row.PersonId);
                    setFirstName(row.FirstName);
                    setLastName(row.LastName);
                    setDOB(formatDateForTextField(new Date(row.DOB)));
                    setPhoneNo(row.PhoneNo);
                    setEmail(row.Email);
                    setGovId(row.GovId);
                    setGovIdType(row.GovIdType);
                    setAddress(row.Address);
                    setRole(row.Role);
                } else {
                    swal("Error", "Record Not Found", "error");
                    clearData();
                }
                //setLeadInvestList(resp.data.getPersonList.items)
                // setRows(resp.data.getCasesByPerson.items);
            })
        } catch (err) { console.log(err) }
    }



    const clearData = () => {
        setPersonId("");
        setFirstName("");
        setLastName("");
        setDOB("");
        setPhoneNo("");
        setEmail("");
        setGovId("");
        setGovIdType("");
        setAddress("");
        setRole("");
        setEmployeeId("");
        setShowHistory(false);
    }

    const saveEmployeeData = () => {
        let data = {
            PersonId, FirstName, LastName, DOB, PhoneNo, Email, GovId, GovIdType, Address, Role
        }
        data['DOB'] = new Date(data['DOB']);
        console.log(data);
        if (employeeId === undefined || employeeId === '') {
            try {
                API.graphql(graphqlOperation(mutations.createPerson, data)).then((resp) => {
                    console.log(resp);
                    clearData();
                    swal("Success", "Record Saved Successfully!", "success");
                })
            } catch (err) { console.log(err) }
        } else {
            data['id'] = employeeId;
            try {
                API.graphql(graphqlOperation(mutations.updatePerson, data)).then((resp) => {
                    console.log(resp);
                    clearData();
                    swal("Success", "Record Updated Successfully!", "success");
                })
            } catch (err) { console.log(err) }
        }
    }

    return (
        <div className="App">
            <LeftNavbar pageTitle="Employee Detail" />
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid card shadow p-3 bg-white rounded-1">
                        <div className="row">
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment>
                                                    <button onClick={searchPersonData} className="btn btn-sm btn-primary"><Icon.Search /></button> &nbsp;
                                                    <button onClick={clearData} className="btn btn-sm btn-secondary"><Icon.Clear /></button>
                                                </InputAdornment>
                                            )
                                        }}
                                        type="text" label="Employee Id *"
                                        value={PersonId}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="PersonId"
                                        placeholder="Employee Id"
                                        onChange={(e) => setPersonId(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        type="text" label="First Name *"
                                        value={FirstName}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="FirstName"
                                        placeholder="First Name"
                                        onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        type="text" label="Last Name *"
                                        value={LastName}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="LastName"
                                        placeholder="Last Name"
                                        onChange={(e) => setLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        type="date" label="DOB *"
                                        value={DOB}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="DOB"
                                        placeholder="DOB"
                                        onChange={(e) => setDOB(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        type="text" label="Phone *"
                                        value={PhoneNo}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="PhoneNo"
                                        placeholder="Phone No"
                                        onChange={(e) => setPhoneNo(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        type="text" label="Email *"
                                        value={Email}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="Email"
                                        placeholder="Email"
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        select label="Role *"
                                        value={Role}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="Role"
                                        placeholder="Role"
                                        onChange={(e) => setRole(e.target.value)} >
                                        {["Investigator", "Exhibit Officer", "Manager", "Forensic Officer"].map((opti) => (
                                            <MenuItem key={opti} value={opti}>{opti}</MenuItem>
                                        ))}

                                    </TextField>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        select label="Gov Id Type *"
                                        value={GovIdType}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="GovIdType"
                                        placeholder="Gov Id Type"
                                        onChange={(e) => setGovIdType(e.target.value)} >
                                        {["DriversLicense", "Passport", "GovtIdCard", "MilitaryId"].map((opti) => (
                                            <MenuItem key={opti} value={opti}>{opti}</MenuItem>
                                        ))}

                                    </TextField>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        type="text" label="Gov Id *"
                                        value={GovId}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="GovId"
                                        placeholder="Gov Id"
                                        onChange={(e) => setGovId(e.target.value)} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <TextField
                                        className="form-control"
                                        type="text" label="Address *"
                                        value={Address}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        name="Address"
                                        placeholder="Address"
                                        onChange={(e) => setAddress(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 text-center">
                                <button class="btn btn-primary" onClick={saveEmployeeData}>Save</button>&nbsp;
                                <button class="btn btn-danger">Delete</button>&nbsp;
                                <button class="btn btn-secondary" disabled={employeeId === undefined || employeeId === ""} onClick={getHistoryData}>History</button>
                            </div>
                        </div>
                        <div className="row">&nbsp;</div>
                        {showHistory &&
                            <div className="row">
                                <div className="col-12">
                                    <div style={{ height: 500, width: '100%' }}>
                                        <DataGrid rows={rows} columns={columns} pageSize={5} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
