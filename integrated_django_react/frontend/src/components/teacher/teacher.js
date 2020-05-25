import React, { Component } from "react";
import Papa from "papaparse";
import styles from "./teacher.module.css";
import Add from "./add_gallery";
import Delete from "./delete_gallery";
import Verify from "./verify";

class Teacher extends Component {
  state = {
    file: "",
  };

  fileSelectHandler = (event) => {
    const file = event.target.value;
    const arr = file.split("\\");
    const full_name = arr[arr.length - 1];
    const filename = full_name.slice(0, full_name.length - 4);
    const file_extension = full_name.slice(
      full_name.length - 4,
      full_name.length
    );
    if (file_extension != ".csv") {
      this.setState({
        warn: true,
      });
      this.addBottom.scrollIntoView();
    } else {
      this.setState({
        data: event.target.files[0],
        file: file,
        filename: filename,
        file_extension: file_extension,
        groupname: filename,
        warn: false,
      });
    }
  };

  csvHandler = () => {
    const config = {
      complete: this.verifyCsv,
    };
    Papa.parse(this.state.data, config);
  };

  verifyCsv = (results, file) => {
    this.setState({
      verifyUpload: true,
      uploadedContent: results,
    });
  };

  goupNameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };

  clearFileHandler = () => {
    this.setState({
      file: "",
      warn: undefined,
      data: undefined,
      groupname: undefined,
    });
  };

  groupNameHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };

  inputConfirmation = () => {
    // fire axios request
  };

  redactVerification = () => {
    // modify state to back tf up
  };

  render() {
    if (this.state.verifyUpload) {
      //TODO: ADD ERROR BOUNDARY FOR BAD FILES
      var blanket = (
        <div className="blanket">
          <Verify
            csv={this.state.uploadedContent}
            onConfirm={this.inputConfirmation}
            onRedact={this.redactVerification}
          />
        </div>
      );
    }
    return (
      <div>
        <div>
          <h1 className={styles.h1}>Gallery Management Console</h1>
        </div>
        {blanket}
        <table>
          <tbody>
            <tr>
              <td valign="top" className="description">
                <Add
                  file_selected={this.fileSelectHandler}
                  file={this.state.file}
                  clearFileHandler={this.clearFileHandler}
                  groupname={this.state.groupname}
                  groupNameChangeHandler={this.groupNameHandler}
                  uploadRequest={this.csvHandler}
                  warn={this.state.warn}
                  verifyContent={this.state.verifyContent}
                  uploadedContent={this.state.uploadedContent}
                />
              </td>
              <td width="20"></td>
              <td valign="top" className="description">
                <Delete />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Teacher;
