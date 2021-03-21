import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { postGallery, getUserGalleries } from "../../../actions/user";
import { logout } from "../../../actions/auth.action";
import Papa from "papaparse";

import FileUploadForm from "./file_upload_form";
import { Blankets } from "./snippets";
import { Stage } from "./stage";

import styles from "./index.module.css";

const DEFAULT_DESCRIPTION =
  "We will always find a way to share music. In lieu of the concert " +
  "hall, our musical performances today are expressed in ones and " +
  "zeroes, but they are none the less as human and as meaningful as " +
  "always.\n\nPlease enjoy this showcase of our school's music lab " +
  "compositions. Our students' creativity truly knows no bounds!";

class AddGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleValue: "",
      fileInputRef: React.createRef(),
      stagedGroups: [],
      blankTitleError: false,
      blankDescriptionError: false,
      descriptionValue: DEFAULT_DESCRIPTION,
      groupname: "",
    };
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
  }

  static getDerivedStateFromProps(props, state) {
    if (props.formRecover && state.button_pressed) {
      props.getUserGalleries(props.token);
      return {
        titleValue: props.formRecover.title,
        stagedGroups: props.formRecover.songData
          ? props.formRecover.songData
          : [],
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
  csvHandler = () => {
    let fileName = "";
    try {
      fileName = this.state.fileInputRef.current.files[0].name;
    } catch (e) {
      // no file has been selected
      return;
    }
    const ext = fileName.slice(fileName.length - 4);
    if (ext != ".csv") {
      this.state.fileInputRef.current.value = "";
      this.setState({
        warn: true,
      });
      return;
    }
    const config = {
      complete: (results) => {
        this.setState({
          verifyUpload: true,
          uploadedContent: results,
          groupname: fileName.slice(0, -4),
        });
      },
    };
    Papa.parse(this.state.fileInputRef.current.files[0], config);
  };

  // see <Add /> and <Verify />
  resetFormHandler = () => {
    this.state.fileInputRef.current.value = "";
    this.setState({
      warn: undefined,
      groupname: "",
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
    // Pull the default group name off and replace it with the user inputted
    // one
    const group_arr = [...verifiedArray.slice(1)];
    const group_name = this.state.groupname;
    const stage = [...group_arr, group_name];
    this.setState((prevState) => {
      if (prevState.stagedGroups) {
        return {
          stagedGroups: [...prevState.stagedGroups, stage],
          warn: undefined,
          groupname: undefined,
          verifyUpload: false,
        };
      } else {
        return {
          stagedGroups: [stage],
          warn: undefined,
          groupname: undefined,
          verifyUpload: false,
        };
      }
    });
  };
  // see <Stage />
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

  // see <Stage />
  titleInputHandler = (e) => {
    this.setState({ titleValue: e.target.value });
  };

  // see <Stage />
  descriptionInputHandler = (e) => {
    this.setState({
      descriptionValue: e.target.value,
    });
  };

  // fire POST_GALLERY action upon button press in <Stage />
  inputConfirmation = () => {
    if (
      this.state.titleValue.trim() === "" &&
      this.state.descriptionValue.trim() === ""
    ) {
      this.setState({
        blankTitleError: true,
        blankDescriptionError: true,
      });
      return;
    } else if (this.state.titleValue.trim() === "") {
      this.setState({
        blankTitleError: true,
      });
      return;
    } else if (this.state.descriptionValue.trim() === "") {
      this.setState({
        blankDescriptionError: true,
      });
      return;
    }
    this.props.postGallery(
      {
        title: this.state.titleValue,
        description: this.state.descriptionValue,
        songData: this.state.stagedGroups,
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
      titleValue: "",
      stagedGroups: [],
      descriptionValue: DEFAULT_DESCRIPTION,
    });
  };

  // dismiss "add title" dialogue
  dismissTitleBlank = () => {
    if (this.state.titleValue != "") {
      this.inputConfirmation();
      this.setState({ blankTitleError: false, blankDescriptionError: false });
    }
  };

  otherGroups = () => {
    let groups = [];
    for (let i = 0; i < this.state.stagedGroups.length; i++) {
      groups.push(this.state.stagedGroups[i].slice(-1)[0]);
    }
    return groups;
  };

  render() {
    // will occur after logout
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }

    // let blanket;
    let staged;

    // // As the user uploads additional groups, the staged groups are held in a
    // // list at the bottom of the page
    if (this.state.stagedGroups && this.state.stagedGroups.length > 0) {
      staged = (
        <Stage
          unStageGroupHandler={this.unStageGroupHandler}
          groups={this.state.stagedGroups}
          confirmCreate={this.inputConfirmation}
          titleInput={this.titleInputHandler}
          titleValue={this.state.titleValue}
          descriptionInput={this.descriptionInputHandler}
          descriptionValue={this.state.descriptionValue}
        />
      );
    }

    // // {blanket} is one of these things, else: nothing
    // if (this.state.verifyUpload) {
    //   blanket = (
    //     <Verify
    //       fileInputRef={this.state.fileInputRef}
    //       csv={this.state.uploadedContent}
    //       restart={this.resetFormHandler}
    //       groupName={this.state.groupname}
    //       groupNameChange={this.groupNameHandler}
    //       otherGroups={this.otherGroups()}
    //       validatedHandler={this.groupValidatedHandler}
    //       nameIndex={this.state.nameIndex}
    //       linkIndex={this.state.linkIndex}
    //       indexHandler={this.handleVerificationIndicies}
    //     />
    //   );
    // } else if (this.state.recover) {
    //   if (this.props.serverErrorMessage) {
    //     blanket = (
    //       <BadRequest
    //         onOk={this.recoveryRestageHandler}
    //         serverErrorMessage={this.props.serverErrorMessage}
    //       />
    //     );
    //   } else {
    //     blanket = <ServerError onOk={this.recoveryRestageHandler} />;
    //   }
    // } else if (this.state.requestMade) {
    //   blanket = (
    //     <GalPostSuccess
    //       slug={this.props.galleries.slice(-1)[0].slug}
    //       onOk={this.successHandler}
    //     />
    //   );
    // } else if (this.state.blankTitleError || this.state.blankDescriptionError) {
    //   blanket = "missing fileds component";
    // } else {
    //   blanket = null;
    // }

    return (
      <>
        <Blankets
          show={
            this.state.verifyUpload
              ? "verify"
              : this.state.recover
              ? "badRequest"
              : this.state.requestMade
              ? "galPostSuccess"
              : this.state.blankTitleError || this.state.blankDescriptionError
              ? "missingFields"
              : null
          }
          verifyProps={{
            fileInputRef: this.state.fileInputRef,
            csv: this.state.uploadedContent,
            restart: this.resetFormHandler,
            groupName: this.state.groupname,
            groupNameChange: this.groupNameHandler,
            otherGroups: this.otherGroups(),
            validatedHandler: this.groupValidatedHandler,
            nameIndex: this.state.nameIndex,
            linkIndex: this.state.linkIndex,
            indexHandler: this.handleVerificationIndicies,
          }}
          badRequestProps={{
            onOk: this.recoveryRestageHandler,
            serverErrorMessage: this.props.serverErrorMessage,
          }}
          missingFields={{
            blankTitleError: this.state.blankTitleError,
            blankDescriptionError: this.state.blankDescriptionError,
            titleValue: this.state.titleValue,
            descriptionValue: this.state.descriptionValue,
            titleInputHandler: this.titleInputHandler,
            descriptionInputHandler: this.descriptionInputHandler,
            dismissTitleBlank: this.dismissTitleBlank,
          }}
          serverErrorProps={{ onOk: this.recoveryRestageHandler }}
          galPostSuccessProps={{
            slug: this.props?.galleries?.slice(-1)[0]?.slug,
            onOk: this.successHandler,
          }}
        />
        <FileUploadForm
          firstGroupUploaded={this.state.stagedGroups.length === 1}
          fileInputRef={this.state.fileInputRef}
          clearFileHandler={this.resetFormHandler}
          groupname={this.state.groupname}
          groupNameChangeHandler={this.groupNameHandler}
          uploadRequest={this.csvHandler}
          warn={this.state.warn}
          uploadedContent={this.state.uploadedContent}
          staged={staged}
        />
        {staged}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postStatus: state.user.galleryPostStatus,
    formRecover: state.user.formPassthrough,
    serverErrorMessage: state.user.serverErrorMessage,
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
})(AddGallery);
