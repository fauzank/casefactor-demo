import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router";
import LeftNavbar from '../left-navbar/left-navbar'
import { DataGrid, ColDef, CellParams } from '@material-ui/data-grid';
import * as Icon from '@material-ui/icons';
import { InputAdornment, Popover, Paper } from '@material-ui/core';
import { TextField, Dialog, DialogContent, DialogTitle, DialogActions, MenuItem } from '@material-ui/core';
import swal from 'sweetalert';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';


export default function Case() {

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

    const leadInvestRef = useRef();
    const history = useHistory();

    const [rows, setRows] = useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [searchInvestigator, setSearchInvestigator] = React.useState("");
    const [personName, setPersonName] = React.useState("");
    const [leadInvestList, setLeadInvestList] = React.useState([]);
    const [personListForDd, setPersonListForDd] = React.useState([]);
    const [leadInvestigatorResult, setLeadInvestigatorResult] = React.useState([]);
    const [searchPopupAnchorEl, setSearchPopupAnchorEl] = React.useState(null);
    const [searchPopupOpen, setSearchPopupOpen] = React.useState(false);
    

    useEffect(() => {
        try {
            API.graphql({
                query: queries.getPersonList,
                variables: {
                    // PersonId: "Jdxk0KNMxm9DuZvSlqfv5v"
                }
            }).then((resp) => {
                console.log(resp);
                setLeadInvestList(resp.data.getPersonList.items);
                setPersonListForDd(resp.data.getPersonList.items);
                if (resp.data.getPersonList.items!==undefined && resp.data.getPersonList.items.length>0) {
                    setPersonName(resp.data.getPersonList.items[0].id);
                    getCasesListByPerson();
                }

                // setRows(resp.data.getCasesByPerson.items);
            })
        } catch (err) { console.log(err) }

    }, []);

    const getCasesListByPerson = () => {
        console.log(personName);
        try {
            API.graphql({
                query: queries.getCasesByPerson,
                variables: {
                    PersonId: personName
                }
            }).then((resp) => {
                console.log(resp);
                setRows(resp.data.getCasesByPerson.items);
            })
        } catch (err) { console.log(err) }
    }

    const [state, setState] = React.useState({
        CaseDate: "",
        LeadInvestigator: "",
        CaseTitle: "",
        Description: "",
        Location: "",
        IncidentType: "",
        CaseClosed: "No"
    });

    const createNewRecord = (event) => {
        setState({
            caseId: "",
            CaseDate: "",
            LeadInvestigator: "",
            CaseTitle: "",
            Description: "",
            Location: "",
            IncidentType: "",
            CaseClosed: "No"
        });
        setSearchInvestigator("");
        setShowForm(true);
    }

    const saveCaseData = () => {
        let invest = state.LeadInvestigator;
        if (invest === undefined || invest.length < 0) {
            let searchList = leadInvestList.filter(elem => elem.FullName === searchInvestigator);
            if (searchList !== undefined && searchList.length > 0) {
                invest = searchList[0].id;
            } else {
                swal("Error", "Select Lead Investigator", "error");
                return;
            }
        }

        console.log(invest);


        let data = {
            CaseDate: new Date(state.CaseDate),
            LeadInvestigator: invest,
            CaseTitle: state.CaseTitle,
            Description: state.Description,
            Location: state.Location,
            IncidentType: state.IncidentType,
            CaseClosed: state.CaseClosed === "No" ? false : true
        }
        console.log(data);
        if (state.caseId === undefined || state.caseId === '') {
            try {
                API.graphql(graphqlOperation(mutations.createCase, data)).then((resp) => {
                    console.log(resp);
                    setShowForm(false);
                    swal("Success", "Record Saved Successfully!", "success");
                    getCasesListByPerson();
                })
            } catch (err) { console.log(err) }
        } else {
            data['id'] = state.caseId;
            try {
                API.graphql(graphqlOperation(mutations.updateCase, data)).then((resp) => {
                    console.log(resp);
                    setShowForm(false);
                    swal("Success", "Record Updated Successfully!", "success");
                    getCasesListByPerson();
                })
            } catch (err) { console.log(err) }
        }
    }

    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }
    const handleSearchPersonChange = event => {
        setSearchInvestigator(event.target.value);
    }
    const handleCloseForm = event => setShowForm(false);

    const leadInvestSearchPopupClose = (event) => {
        event.preventDefault();
        setSearchPopupOpen(false);
    }
    const searchLeadInvestigatorClickHandler = (event) => {
        console.log(state);
        if (searchInvestigator === undefined || searchInvestigator === '') {
            swal("Error", "Enter value to search!", "error");
            return;
        }
        let node = leadInvestRef.current;
        setSearchPopupAnchorEl(node);
        setSearchPopupOpen(true);


        let searchList = leadInvestList.filter(elem => elem.FullName.includes(searchInvestigator));
        setLeadInvestigatorResult(searchList);

        // try {
        //     API.graphql({
        //         query: queries.searchVendorByName,
        //         variables: {
        //             BaseType: "VENDOR",
        //             VendorName: { 'beginsWith': this.state.VendorName }
        //         }
        //     }).then((resp) => {
        //         console.log(resp);
        //         let node = this.vendorRef.current;
        //         this.setState({ vendorSearchResult: resp.data.searchVendorByName.items, searchPopupOpen: true, vendorSearchPopupAnchorEl: node });
        //     })
        // } catch (err) { console.log(err) }
    }
    const leadSearchSelectionHandler = (row, e) => {
        e.preventDefault();
        console.log(row, e);
        setSearchInvestigator(row.FullName);
        setState({
            ...state,
            LeadInvestigator: row.id
        });
        setSearchPopupOpen(false);
        // this.setState({ VendorID: row.id, VendorName: row.VendorName, VendorCode: row.VendorCode, searchPopupOpen: false });
    }

    const columns: ColDef[] = [
        { field: 'CaseTitle', headerName: 'Case Title', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Description', headerName: 'Description', flex: 2, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Location', headerName: 'Location', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },,
        { field: 'IncidentType', headerName: 'Incident Type', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'CaseClosed', headerName: 'Case Closed', flex: 0.6, renderCell: (params: GridCellParams) => (<>{params.value === true ? "Yes" : "No"}</>) },
        { field: 'CaseDate', headerName: 'Case Date', flex: 0.6, renderCell: (params: GridCellParams) => (formatDateForDisplay(new Date(params.value))) },
        {
            field: "",
            headerName: "Action",
            flex: 0.5,
            disableClickEventBubbling: true,
            renderCell: (params: CellParams) => {
                const onClick = () => {
                    console.log(params.getValue("id"));
                    history.push('/exhibit/' + params.getValue("id"))
                };
                const editClick = () => {
                    let searchList = leadInvestList.filter(elem => elem.id === params.row.LeadInvestigator);
                    console.log(params.row.LeadInvestigator, searchList, leadInvestList);
                    if (searchList !== undefined && searchList.length > 0) {
                        console.log(searchList[0].id);
                        setState({
                            ...state,
                            LeadInvestigator: searchList[0].id
                        });
                        setSearchInvestigator(searchList[0].FullName)
                    }
                    setShowForm(true);
                    setState({
                        caseId: params.row.id,
                        CaseDate: formatDateForTextField(new Date(params.getValue("CaseDate"))),
                        CaseTitle: params.row.CaseTitle,
                        Description: params.row.Description,
                        Location: params.row.Location,
                        IncidentType: params.row.IncidentType,
                        CaseClosed: params.row.CaseClosed === true ? "Yes" : "No",
                    });

                    // const api: GridApi = params.api;
                    // const fields = api
                    //     .getAllColumns()
                    //     .map((c) => c.field)
                    //     .filter((c) => c !== "__check__" && !!c);
                    // const thisRow = {};

                    // fields.forEach((f) => {
                    //     thisRow[f] = params.getValue(f);
                    // });
                    // setShowForm(true);
                    // setState({
                    //     CaseDate: formatDateForTextField(thisRow.CaseDate),
                    //     CaseTitle: thisRow.CaseTitle,
                    //     Description: thisRow.Description,
                    //     Location: thisRow.Location,
                    //     IncidentType: thisRow.IncidentType,
                    //     CaseClosed: thisRow.CaseClosed === true?"Yes":"No",
                    // });
                    // console.log(thisRow);
                    // return alert(JSON.stringify(thisRow, null, 4));
                };

                return <div>
                    <button className="btn btn-primary btn-sm p-1" onClick={(editClick)}>
                        <Icon.Edit fontSize="small" />
                    </button>
                    &nbsp;
                    <button className="btn btn-success btn-sm p-1" onClick={onClick}>
                        <Icon.FileCopy fontSize="small" />
                    </button>
                </div>;
            }
        }
    ];


    return (
        <div className="App">
            <LeftNavbar pageTitle="Case List" />
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid card shadow p-3 bg-white rounded-1">
                        <div className="row">
                            <div className="col-8">
                                <button className="btn btn-primary" onClick={createNewRecord}>Create New Case</button>
                            </div>
                            <div className="col-3">
                                <TextField
                                    select
                                    className="form-control"
                                    label="Case By Person"
                                    value={personName}
                                    onChange={(e)=> setPersonName(e.target.value)}
                                    size="small"
                                    variant="outlined"
                                    placeholder="Case By Person"
                                >
                                    {personListForDd.map((opti) => (
                                        <MenuItem key={opti.id} value={opti.id}>{opti.FullName}</MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div className="col-1">
                                <button className="btn btn-primary" onClick={getCasesListByPerson}>Search</button>
                            </div>
                        </div>
                        <div className="row">&nbsp;</div>
                        <div style={{ height: 500, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} pageSize={5} />
                        </div>
                        <div>
                            <Dialog open={showForm} maxWidth="md" fullWidth onClose={handleCloseForm} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title"><div className="text-primary">Edit Case</div></DialogTitle>
                                <DialogContent dividers>
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <TextField
                                                    error={state.CaseDate === "" || state.CaseDate === undefined}
                                                    className="form-control"
                                                    type="date" label="Case Date *"
                                                    value={state.CaseDate}
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    name="CaseDate"
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <TextField
                                                    error={state.CaseTitle === "" || state.CaseTitle === undefined}
                                                    className="form-control"
                                                    type="text" label="Case Title *"
                                                    value={state.CaseTitle}
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    name="CaseTitle"
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <TextField
                                                    error={state.Location === "" || state.Location === undefined}
                                                    className="form-control"
                                                    type="text" label="Location *"
                                                    value={state.Location}
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    name="Location"
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-group">
                                                <TextField
                                                    error={state.Description === "" || state.Description === undefined}
                                                    className=""
                                                    type="text" label="Description *"
                                                    value={state.Description}
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    size="small"
                                                    multiline
                                                    rowsMax={3}
                                                    fullWidth
                                                    name="Description"
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <TextField
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment>
                                                                <button onClick={searchLeadInvestigatorClickHandler} className="btn btn-sm btn-primary"><Icon.Search /></button>
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                    label="Lead Investigator"
                                                    className="form-control"
                                                    name="searchInvestigator"
                                                    placeholder="Lead Investigator"
                                                    ref={leadInvestRef}
                                                    onChange={handleSearchPersonChange}
                                                    value={searchInvestigator}
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                />
                                                <Popover
                                                    id="vendorSearchPopup"
                                                    open={searchPopupOpen}
                                                    anchorEl={searchPopupAnchorEl}
                                                    onClose={leadInvestSearchPopupClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <div component={Paper} className="p-1">
                                                        {leadInvestigatorResult.map((row, i) => (
                                                            <div className="m-1" key={i}><a href={"#" + i} onClick={(e) => leadSearchSelectionHandler(row, e)}>{row.FullName}</a></div>
                                                        ))}
                                                    </div>

                                                </Popover>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <TextField
                                                    select
                                                    name="IncidentType"
                                                    className="form-control"
                                                    label="Incident Type"
                                                    value={state.IncidentType}
                                                    onChange={handleChange}
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="Incident Type"
                                                >
                                                    {["Aggravated assault", "Assault", "Burglary", "Trespassing", "Domestic violence", "Cyber Crime", "Drug Possession", "Electronic Vandalism", "Sabotage", "Embezzlement", "Felony", "Fraud", "Hate crime", "Murder"].map((opti) => (
                                                        <MenuItem key={opti} value={opti}>{opti}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <TextField
                                                    select
                                                    name="CaseClosed"
                                                    className="form-control"
                                                    label="Case Closed"
                                                    value={state.CaseClosed}
                                                    onChange={handleChange}
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="Case Closed"
                                                >
                                                    {["Yes", "No"].map((opti) => (
                                                        <MenuItem key={opti} value={opti}>{opti}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <button className="btn btn-danger" onClick={handleCloseForm}>Cancel</button>
                                    <button className="btn btn-success" onClick={saveCaseData}>Save</button>
                                </DialogActions>
                            </Dialog>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}