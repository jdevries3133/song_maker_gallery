import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { postGallery, getUserGalleries } from "../../actions/user";
import { logout } from "../../actions/auth.action";
import Papa from "papaparse";

import Add from "./add_gallery/add_gallery";
import YourGalleries from "./your_galleries/your_galleries";
import GalPostSuccess from "./add_gallery/gal_post_success";
import MobileOptimizedView from "./mobile_optimized";
import ServerError from "../generics/server_error";
import Staged from "./add_gallery/staged";
import Verify from "./add_gallery/verify";

import styles from "./teacher.module.css";

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      titleValue: "",
      stagedGroups: [],
      blankTitleError: false,
      descriptionValue:
        "We will always find a way to share music. In lieu of the concert hall, our musical performances today are expressed in ones and zeroes, but they are none the less as human and as meaningful as always.\n\nPlease enjoy this showcase of our school's music lab compositions. Our students' creativity truly knows no bounds!",
      width: window.innerWidth,
    };
    this.setWidth = this.setWidth.bind(this);
  }

  // resize event listener callback function
  setWidth() {
    this.setState({ width: window.innerWidth });
  }

  // get user's galleries, available for view or deletion
  componentDidMount() {
    document.title = this.props.title;
    // initial fetch of user's galleries
    if (this.props) {
      if (this.props.token) {
        this.props.getUserGalleries(this.props.token);
      }
    }
    // resize listener for responsive styling
    window.addEventListener("resize", this.setWidth);
  }

  // remove event listener
  componentWillUnmount() {
    window.removeEventListener("resize", this.setWidth);
  }

  static getDerivedStateFromProps(props, state) {
    // issue: if the post request fails, even if the second attempt passes, it will
    // tell the user that it failed. This isn't a huge deal, because the user can
    // just try again, but it's annoying, and then the user will have to delete the
    // duplicate post.
    if (props.formRecover && state.button_pressed) {
      props.getUserGalleries(props.token);
      return {
        titleValue: props.formRecover.title,
        stagedGroups: props.formRecover.api_obj,
        descriptionValue: props.formRecover.description,
        recover: true,
        button_pressed: false,
      };
    } else if (props.requestMade && state.button_pressed) {
      return {
        requestMade: props.requestMade,
        button_pressed: false,
      };
    } else {
      return null;
    }
  }

  // see <Add />
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

  // see <Add />
  csvHandler = () => {
    const config = {
      complete: (results, file) => {
        this.setState({
          verifyUpload: true,
          uploadedContent: results,
        });
      },
    };
    Papa.parse(this.state.data, config);
  };

  // see <Add /> and <Verify />
  resetFormHandler = () => {
    this.setState({
      file: "",
      warn: undefined,
      data: undefined,
      groupname: undefined,
      verifyUpload: false,
    });
  };
  // see <Add /> and <Verify />
  groupNameHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };
  // see <Verify />
  groupValidatedHandler = (verifiedArray) => {
    const group_arr = [...verifiedArray.slice(1)];
    const group_name = this.state.groupname;
    const stage = [...group_arr, group_name];
    this.setState((prevState) => {
      if (prevState.stagedGroups) {
        return {
          stagedGroups: [...prevState.stagedGroups, stage],
          file: "",
          warn: undefined,
          data: undefined,
          groupname: undefined,
          verifyUpload: false,
        };
      } else {
        return {
          stagedGroups: [stage],
          file: "",
          warn: undefined,
          data: undefined,
          groupname: undefined,
          verifyUpload: false,
        };
      }
    });
  };
  // see <Staged />
  unStageGroupHandler = (group_to_delete) => {
    const groups = [...this.state.stagedGroups];
    if (groups.length <= 1) {
      this.setState({ stagedGroups: [] });
      return;
    }
    const updated_groups = groups.filter((group) => {
      if (group.slice(-1) != group_to_delete) {
        return group;
      }
    });
    this.setState({
      stagedGroups: updated_groups,
    });
  };
  // see <Verify />
  handleVerificationIndicies = (value, flag) => {
    if (flag === "name") {
      this.setState({
        nameIndex: value,
      });
    } else if (flag === "link") {
      this.setState({ linkIndex: value });
    } else {
      console.warn("invalid index flag");
    }
  };

  // see <Staged />
  titleInputHandler = (e) => {
    this.setState({ titleValue: e.target.value });
  };

  // see <Staged />
  descriptionInputHandler = (e) => {
    this.setState({
      descriptionValue: e.target.value,
    });
  };

  // fire POST_GALLERY action upon button press in <Staged />
  inputConfirmation = () => {
    if (this.state.titleValue === "") {
      this.setState({
        blankTitleError: true,
      });
      return;
    }
    this.props.postGallery(
      {
        title: this.state.titleValue,
        description: this.state.descriptionValue,
        api_obj: this.state.stagedGroups,
      },
      this.props.token
    );
    this.setState({ button_pressed: true });
  };
  // after "ok" press in <ServerError />
  recoveryRestageHandler = () => {
    this.setState({
      recover: false,
      requestMade: false,
    });
  };

  // reset "add gallery" form after all is good.
  successHandler = () => {
    this.setState({
      recover: false,
      requestMade: false,
      file: "",
      titleValue: "",
      stagedGroups: [],
      descriptionValue:
        "We will always find a way to share music. In lieu of the concert hall, our musical performances today are expressed in ones and zeroes, but they are none the less as human and as meaningful as always.\n\nPlease enjoy this showcase of our school's music lab compositions. Our students' creativity truly knows no bounds",
    });
  };

  // dismiss "add title" dialogue
  dismissTitleBlank = () => {
    if (this.state.titleValue != "") {
      this.inputConfirmation();
      this.setState({ blankTitleError: false });
    }
  };

  render() {
    // will occur after logout
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }

    let blanket;
    let staged;
    // Verify component allows user to validate csv data after upload.
    if (this.state.verifyUpload) {
      blanket = (
        <Verify
          csv={this.state.uploadedContent}
          onRedact={this.redactVerification}
          restart={this.resetFormHandler}
          groupname={this.state.groupname}
          groupNameChange={this.groupNameHandler}
          validatedHandler={this.groupValidatedHandler}
          nameIndex={this.state.nameIndex}
          linkIndex={this.state.linkIndex}
          indexHandler={this.handleVerificationIndicies}
        />
      );
    }

    // As the user uploads additional groups, the staged groups are held in a
    // list at the bottom of the page
    if (this.state.stagedGroups.length > 0) {
      staged = (
        <Staged
          unStageGroupHandler={this.unStageGroupHandler}
          groups={this.state.stagedGroups}
          previewGallery={this.inputConfirmation}
          titleInput={this.titleInputHandler}
          titleValue={this.state.titleValue}
          descriptionInput={this.descriptionInputHandler}
          descriptionValue={this.state.descriptionValue}
          onConfirm={this.inputConfirmation}
          peskyButton={this.props.requestMade}
        />
      );
    }

    // {blanket} is one of these things, else: nothing
    if (this.state.verifyUpload) {
      blanket = (
        <Verify
          csv={this.state.uploadedContent}
          onRedact={this.redactVerification}
          restart={this.resetFormHandler}
          groupname={this.state.groupname}
          groupNameChange={this.groupNameHandler}
          validatedHandler={this.groupValidatedHandler}
          nameIndex={this.state.nameIndex}
          linkIndex={this.state.linkIndex}
          indexHandler={this.handleVerificationIndicies}
        />
      );
    } else if (this.state.recover) {
      blanket = <ServerError onOk={this.recoveryRestageHandler} />;
    } else if (this.state.requestMade) {
      blanket = (
        <GalPostSuccess
          url={this.props.galleries.slice(-1)[0].url_extension}
          onOk={this.successHandler}
        />
      );
    } else if (this.state.blankTitleError) {
      return (
        <div className="description blanket">
          <h2>Please enter a title for your gallery.</h2>
          <br />
          <input onChange={(e) => this.titleInputHandler(e)} />
          <br />
          {this.state.titleValue ? (
            <button onClick={() => this.dismissTitleBlank()}>Ok</button>
          ) : null}
        </div>
      );
    } else {
      blanket = null;
    }

    return (
      <div>
        <h1 className={styles.h1}>Gallery Management Console</h1>
        <button
          className={styles.logout}
          onClick={() => {
            this.props.logout(this.props.token);
          }}
        >
          Log Out
        </button>
        {blanket}
        {this.state.width < 621 ? (
          <MobileOptimizedView
            file_selected={this.fileSelectHandler}
            file={this.state.file}
            clearFileHandler={this.resetFormHandler}
            groupname={this.state.groupname}
            groupNameChangeHandler={this.groupNameHandler}
            uploadRequest={this.csvHandler}
            warn={this.state.warn}
            verifyContent={this.state.verifyContent}
            uploadedContent={this.state.uploadedContent}
            staged={staged}
          />
        ) : (
          <table className={styles.table}>
            <tbody>
              <tr style={{ display: "inline" }}>
                <td width="55%" valign="top" className={styles.narrow_desc}>
                  <Add
                    file_selected={this.fileSelectHandler}
                    file={this.state.file}
                    clearFileHandler={this.resetFormHandler}
                    groupname={this.state.groupname}
                    groupNameChangeHandler={this.groupNameHandler}
                    uploadRequest={this.csvHandler}
                    warn={this.state.warn}
                    verifyContent={this.state.verifyContent}
                    uploadedContent={this.state.uploadedContent}
                  />
                  {staged}
                </td>
                <td width="13%"></td>
                <td width="35%" valign="top" className={styles.narrow_desc}>
                  <YourGalleries />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postStatus: state.user.galleryPostStatus,
    formRecover: state.user.formPassthrough,
    galleries: state.user.galleries,
    requestMade: state.user.postRequestMade,
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated,
  };
};

export default connect(mapStateToProps, {
  postGallery,
  getUserGalleries,
  logout,
})(Teacher);
