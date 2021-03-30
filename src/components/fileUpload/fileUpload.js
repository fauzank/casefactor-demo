import React, { Component } from 'react';
import { TextField, CircularProgress, Button, Table, TableBody, TableRow, TableCell, TableHead } from '@material-ui/core';
import * as Icon from '@material-ui/icons';
import swal from 'sweetalert';
import { Storage } from 'aws-amplify';
export default class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.folderName+"/");
    this.state = {
      loading: false,
      fileList: []
    };
  }
  componentDidMount() {
    console.log(this.props.folderName+"/");
    if (this.props.displayList) {
      this.updateListData();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.folderName+"/");
    if (this.props.displayList) {
      this.updateListData();
    }
  }

  updateListData = () => {
    console.log(this.props.folderName+"/");
    let fileData = [];
    this.setState({ fileList: fileData });
    console.log(fileData);
    Storage.list(this.props.folderName + '/')
      .then(result => {
        console.log(result)
        for(var i=0;i<result.length;i++){
          let key = result[i].key;
          Storage.get(key).then((res)=>{
            let fileName = key.split('/');
            fileData.push({"key":key,"fileName":fileName[fileName.length-1], "signedUrl": res});
            this.setState({ fileList: fileData });
          });
        }
      })
      .catch(err => console.log(err));
  }

  fileChangeHandler(event) {
    let fileSelected = event.target.files[0];
    let fileType = fileSelected.name.substr(fileSelected.name.length - 4);
    console.log(fileSelected);
    if (this.props.fileType === fileType || this.props.fileType === ".all") {
      this.setState({ jobOrderFile: fileSelected });
    } else {
      swal("Error", this.props.fileType+" file should be selected.", "error");
    }
  }

  deleteFile = (row) => {
    console.log(row.key);

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        Storage.remove(row.key)
          .then(result => {
            console.log(result)
            swal("Success", "File Deleted Successfully.", "success");
            this.updateListData();
          })
          .catch(err => {
            console.log(err)
            swal("Error", "Failed to delete file", "error");
          });
      }
    });
  }

  fileUploadHandler(event) {
    console.log(this.state.jobOrderFile);
    if (this.state.jobOrderFile === undefined) {
      swal("Error", this.props.fileType+" file should be selected.", "error");
    } else {
      this.setState({ loading: true });
      let fileName = this.props.folderName + "/" + this.state.jobOrderFile.name;
      console.log(fileName);
      Storage.put(fileName, this.state.jobOrderFile).then(result => {
        console.log(result.key)
        this.props.passChildData(result.key);
        swal("Success", "File Saved Successfully", "success");
        this.setState({ loading: false, inputKey: Date.now() });
        this.updateListData();
      }).catch(err => {
        swal("Error", "Failed to save File", "error");
        console.log(err);
        this.setState({ loading: false });
      });
    }
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-10">
            <TextField
              id="jobOrderFile"
              name="jobOrderFile"
              className="form-control"
              type="file"
              key={this.state.inputKey}
              InputLabelProps={{ shrink: true }}
              label="Select File"
              onChange={this.fileChangeHandler.bind(this)}
              size="small"
            />
          </div>
          <div className="col-2">
            <div>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.loading}
                onClick={this.fileUploadHandler.bind(this)}
              >
                <Icon.CloudUpload />
              </Button>
              {this.state.loading && <CircularProgress size={24} className="circularLoading" />}
            </div>
          </div>
        </div>
        <div>
          <div className="row">&nbsp;</div>
        </div>
        {this.props.displayList && this.state.fileList &&
          <div>
            <div className="row">
              <div className="col-12">
                <Table className="w-100">
                  <TableHead>
                    <TableRow style={{ background: "#3f51b5" }}>
                      <TableCell>File</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.fileList.map((row) => (
                      <TableRow key={row.key}>
                        <TableCell component="th" scope="row">
                          {row.fileName}
                        </TableCell>
                        <TableCell>
                          <a href={row.signedUrl} rel="noreferrer" target="_blank"><Icon.Description /></a>&nbsp;
                            <button className="btn btn-sm btn-danger" onClick={this.deleteFile.bind(this, row)}><Icon.Delete fontSize="small" /></button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        }
      </div>

    );
  }
}