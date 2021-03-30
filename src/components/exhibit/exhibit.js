import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import LeftNavbar from '../left-navbar/left-navbar'
import { DataGrid, ColDef, CellParams, GridApi } from '@material-ui/data-grid';
import * as Icon from '@material-ui/icons';
// import { InputAdornment, Popover, Paper, Checkbox, TablePagination, TableSortLabel } from '@material-ui/core';
import { TextField, Dialog, DialogContent, DialogTitle, DialogActions, MenuItem } from '@material-ui/core';
import swal from 'sweetalert';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import FileUploadComponent from '../fileUpload/fileUpload'

export default function Exhibit() {

    const history = useHistory();
    const params = useParams();
    const eid = params.eid;
    const [showForm, setShowForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [rows, setRows] = useState([]);
    const [personList, setPersonList] = useState([]);
    const [IssuedTo, setIssuedTo] = useState("");
    const [docUrl, setDocUrl] = useState("");
    const docTypeList = ["Physical", "Legal Document", "Audio", "Video", "Photo", "Scanned Image", "Transcript"]

    const [exhibitObj, setExhibitObj] = useState({
        ExhibitId: "",
        IssueDate: "",
        IssuedTo: "",
        IssuedToName: "",
    });
    const [state, setState] = useState({
        id: "",
        CaseId: eid,
        Name: "",
        Description: "",
        DocumentType: "Photo",
        BucketURL: "",
        Hash: "",
    });
    const createNewRecord = (event) => {
        setDocUrl("");
        setState({
            id: "",
            CaseId: eid,
            Name: "",
            Description: "",
            DocumentType: "Photo",
            BucketURL: "",
            Hash: "",
        });
        setShowForm(true);
    }
    const handleChange = event => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        });
    }
    const handleCloseForm = event => setShowForm(false);
    const handleCloseAssignForm = event => setShowAssignForm(false);
    const handleSaveAssignForm = event => {
        console.log(exhibitObj, IssuedTo);
        let issuedName = "";
        let searchList = personList.filter(elem => elem.id === IssuedTo);
        if (searchList !== undefined && searchList.length > 0) {
            issuedName = searchList[0].FullName;
        }

        if (issuedName === undefined || issuedName === "") {
            swal("Error", "Select Person to assign", "error");
            return;
        }
        let data = {
            ExhibitId: exhibitObj.ExhibitId,
            IssueDate: exhibitObj.IssueDate,
            IssuedTo: IssuedTo,
            IssuedToName: issuedName,
        }
        console.log(data);
        try {
            API.graphql(graphqlOperation(mutations.assignExhibit, data)).then((resp) => {
                console.log(resp);
                setShowAssignForm(false);
                swal("Success", "Record Assigned Successfully!", "success");
                getExhibitListByCase();
            })
        } catch (err) { console.log(err) }
    }

    const getExhibitListByCase = () => {
        try {
            API.graphql({
                query: queries.getExhibitsByCase,
                variables: {
                    CaseId: eid
                }
            }).then((resp) => {
                console.log(resp);
                setRows(resp.data.getExhibitsByCase.items)
                // setRows(resp.data.getCasesByPerson.items);
            })
        } catch (err) { console.log(err) }
    }


    const saveExhibitData = event => {
        // let invest = state.LeadInvestigator;
        // if (invest === undefined || invest.length < 0) {
        //     let searchList = leadInvestList.filter(elem => elem.FullName === searchInvestigator);
        //     if (searchList !== undefined && searchList.length > 0) {
        //         invest = searchList[0].id;
        //     } else {
        //         swal("Error", "Select Lead Investigator", "error");
        //         return;
        //     }
        // }

        // console.log(invest);
        console.log(docUrl);

        let data = {
            CaseId: eid,
            Name: state.Name,
            Description: state.Description,
            DocumentType: state.DocumentType,
            BucketURL: docUrl,
        }
        console.log(data);
        if (state.id === undefined || state.id === '') {
            try {
                API.graphql(graphqlOperation(mutations.createExhibit, data)).then((resp) => {
                    console.log(resp);
                    setShowForm(false);
                    swal("Success", "Record Saved Successfully!", "success");
                    getExhibitListByCase();
                })
            } catch (err) { console.log(err) }
        } else {
            data['id'] = state.id;
            try {
                API.graphql(graphqlOperation(mutations.updateExhibit, data)).then((resp) => {
                    console.log(resp);
                    setShowForm(false);
                    swal("Success", "Record Updated Successfully!", "success");
                    getExhibitListByCase();
                })
            } catch (err) { console.log(err) }
        }
    }
    const handlePersonChange = event => {
        setIssuedTo(event.target.value);
    }
    useEffect(() => {
        getExhibitListByCase();
        try {
            API.graphql({
                query: queries.getPersonList,
                variables: {
                    // PersonId: "Jdxk0KNMxm9DuZvSlqfv5v"
                }
            }).then((resp) => {
                console.log(resp);
                setPersonList(resp.data.getPersonList.items)
                // setRows(resp.data.getCasesByPerson.items);
            })
        } catch (err) { console.log(err) }
    }, []);
    const columns: ColDef[] = [
        { field: 'Name', headerName: 'Name', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Description', headerName: 'Description', flex: 2, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'DocumentType', headerName: 'Document Type', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'Hash', headerName: 'Hash', flex: 1 , renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        { field: 'BucketURL', headerName: 'URL', flex: 1, renderCell: (params: any) => (<div title={params.value} ><span>{params.value}</span></div>) },
        {
            field: "",
            headerName: "Action",
            flex: 1,
            disableClickEventBubbling: true,
            renderCell: (params: CellParams) => {
                const onClick = () => {
                    const api: GridApi = params.api;
                    const fields = api
                        .getAllColumns()
                        .map((c) => c.field)
                        .filter((c) => c !== "__check__" && !!c);
                    const thisRow = {};

                    fields.forEach((f) => {
                        thisRow[f] = params.getValue(f);
                    });

                    return alert(JSON.stringify(thisRow, null, 4));
                };
                const editClick = () => {
                    console.log(params.row);
                    setDocUrl(params.row.BucketURL);
                    setState({
                        id: params.row.id,
                        CaseId: params.row.CaseId,
                        Name: params.row.Name,
                        Description: params.row.Description,
                        DocumentType: params.row.DocumentType,
                        BucketURL: params.row.BucketURL,
                        Hash: params.row.Hash,
                    });
                    setShowForm(true);

                };
                const verifyDataClick = () => {
                    console.log(params.row);
                    try {
                        API.graphql({
                            query: queries.verifyExhibit,
                            variables: {
                                ExhibitId: params.row.id
                            }
                        }).then((resp) => {
                            console.log(resp);
                            if(resp.data.verifyExhibit!==undefined && resp.data.verifyExhibit === true){
                                swal("Success","Data verified successfully","success");
                            }else{
                                swal("Error","Data is not verified","error");
                            }
                            // setPersonList(resp.data.getPersonList.items)
                            // setRows(resp.data.getCasesByPerson.items);
                        })
                    } catch (err) { console.log(err) }

                };

                const docTranslateClick = () => {
                    localStorage.setItem("docUrl",params.row.BucketURL);
                    localStorage.setItem("docType",params.row.DocumentType);
                    history.push('/textpage/' + params.row.id)
                }
                const assignClick = () => {
                    console.log(params.row);
                    setExhibitObj({
                        ExhibitId: params.row.id,
                        IssueDate: new Date(),
                        IssuedTo: "",
                        IssuedToName: "",
                    });

                    setShowAssignForm(true);
                };
                if (params.row.DocumentType === "Physical") {
                    return <div>
                        <button className="btn btn-primary btn-sm p-1" title="Edit" onClick={(editClick)}>
                            <Icon.Edit fontSize="small" />
                        </button>
                    &nbsp;
                    <a href={"/#/movement/" + params.row.id} title="Movement" className="btn btn-success btn-sm p-1">
                            <Icon.Description fontSize="small" />
                        </a>
                    &nbsp;
                    <button className="btn btn-info btn-sm p-1" title="Assignment" onClick={assignClick}>
                            <Icon.AssignmentInd fontSize="small" />
                        </button>&nbsp;
                        <button className="btn btn-warning btn-sm p-1" title="Verify Data" onClick={(verifyDataClick)}>
                            <Icon.VerifiedUser fontSize="small" />
                        </button>
                    </div>;
                } else if(params.row.DocumentType === "Legal Document" || params.row.DocumentType === "Scanned Image") {
                    return <div>
                        <button className="btn btn-primary btn-sm p-1" title="Edit" onClick={(editClick)}>
                            <Icon.Edit fontSize="small" />
                        </button>&nbsp;
                        <button className="btn btn-danger btn-sm p-1 " title="Extract Text" onClick={(docTranslateClick)}>
                            <Icon.Assignment fontSize="small" />
                        </button>&nbsp;
                        <button className="btn btn-warning btn-sm p-1" title="Verify Data" onClick={(verifyDataClick)}>
                            <Icon.VerifiedUser fontSize="small" />
                        </button>
                    </div>;

                } else if(params.row.DocumentType === "Audio") {
                    
                    return <div>
                        <button className="btn btn-primary btn-sm p-1" title="Edit" onClick={(editClick)}>
                            <Icon.Edit fontSize="small" />
                        </button>&nbsp;
                        <button className="btn btn-secondary btn-sm p-1" title="Transcribe Audio" onClick={(docTranslateClick)}>
                            <Icon.Audiotrack fontSize="small" />
                        </button>&nbsp;
                        <button className="btn btn-warning btn-sm p-1" title="Verify Data" onClick={(verifyDataClick)}>
                            <Icon.VerifiedUser fontSize="small" />
                        </button>
                    </div>;
                } else {
                    return <div>
                        <button className="btn btn-primary btn-sm p-1" title="Edit" onClick={(editClick)}>
                            <Icon.Edit fontSize="small" />
                        </button>&nbsp;
                        <button className="btn btn-warning btn-sm p-1" title="Verify Data" onClick={(verifyDataClick)}>
                            <Icon.VerifiedUser fontSize="small" />
                        </button>
                    </div>;
                }
            }
        }
    ];

    return (
        <div className="App">
            <LeftNavbar pageTitle="Exhibit List" />
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid card shadow p-3 bg-white rounded-1">
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-primary" onClick={createNewRecord}>Create New Exhibit Record</button>
                            </div>
                            <div className="col-6 text-right">
                                &nbsp;<a className="btn btn-danger" href="/#/case">Back to Cases</a>
                            </div>
                        </div>
                        <div className="row">&nbsp;</div>
                        <div style={{ height: 450, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} pageSize={5} />
                        </div>
                        <div>
                            <Dialog open={showForm} maxWidth="md" fullWidth onClose={handleCloseForm} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title"><div className="text-primary">Exhibit Details</div></DialogTitle>
                                <DialogContent dividers>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="form-group">
                                                <TextField
                                                    error={state.Name === "" || state.Name === undefined}
                                                    className="form-control"
                                                    type="text" label="Exhibit Name *"
                                                    value={state.Name}
                                                    InputLabelProps={{ shrink: true }}
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    name="Name"
                                                    onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <TextField
                                                    select
                                                    fullWidth
                                                    name="DocumentType"
                                                    className="form-control"
                                                    label="Document Type *"
                                                    value={state.DocumentType}
                                                    InputLabelProps={{ shrink: true }}
                                                    onChange={handleChange}
                                                    size="small"
                                                    variant="outlined"
                                                >
                                                    {docTypeList.map((opti) => (
                                                        <MenuItem key={opti} value={opti}>{opti}</MenuItem>
                                                    ))}
                                                </TextField>
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
                                        {state.id &&
                                            <div className="col-12">
                                                <FileUploadComponent folderName={eid+"/"+state.id + "/"} displayList={false}  fileType=".all" passChildData={setDocUrl} />
                                            </div>
                                        }
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <button className="btn btn-danger" onClick={handleCloseForm}>Cancel</button>
                                    <button className="btn btn-success" onClick={saveExhibitData}>Save</button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        <div>
                            <Dialog open={showAssignForm} maxWidth="sm" fullWidth onClose={handleCloseAssignForm} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title"><div className="text-primary">Exhibit Assignment</div></DialogTitle>
                                <DialogContent dividers>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <TextField
                                                    select
                                                    name="IssuedTo"
                                                    className="form-control"
                                                    label="Assign To"
                                                    value={IssuedTo}
                                                    onChange={handlePersonChange}
                                                    size="small"
                                                    variant="outlined"
                                                    placeholder="Assign To"
                                                >
                                                    {personList.map((opti) => (
                                                        <MenuItem key={opti.id} value={opti.id}>{opti.FullName}</MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <button className="btn btn-danger" onClick={handleCloseAssignForm}>Cancel</button>
                                    <button className="btn btn-success" onClick={handleSaveAssignForm}>Assign</button>
                                </DialogActions>
                            </Dialog>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}