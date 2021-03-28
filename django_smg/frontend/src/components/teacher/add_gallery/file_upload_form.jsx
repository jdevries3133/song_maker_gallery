import React, { Fragment } from "react";
import PropTypes from "prop-types";

import styled, {
  P,
  H1 as DefaultH1,
  Button,
  Description as DefaultDescription,
} from "../../common/styles";

import { TemplateHelp } from "./snippets";
import { HowToVideo } from "./snippets";
import { Directions } from "./snippets";
import { DownloadTemplate } from "./snippets";
import { InvalidFiletype } from "./snippets";
import { Donate } from "../../gallery/donate/";

const Description = styled(DefaultDescription)`
  padding: 0;
  margin: 0;
`;

const H1 = styled(DefaultH1)`
  font-size: 34px;
`;

const Container = styled.div`
  text-align: center;
  border-radius: 20px;
  background-color: #c1de8c;
  margin: 10px;
  padding: 10px 0;
`;

const StyledFileInput = styled.input`
  margin: auto;
  display: block;
  font-size: 16px;
  padding: 0;
`;

const FileUploadForm = (props) => {
  return (
    <Description>
      <H1>Add Gallery</H1>
      <DownloadTemplate />
      <TemplateHelp />
      <HowToVideo />
      <Container>
        <div>
          <h3>Add a Gallery</h3>
          <Directions />
          <h4>Upload One Spreadsheet (.csv file) Per Group</h4>
          {props.firstGroupUploaded ? (
            <Fragment>
              <h3 data-testid="firstFileUploadedMsg">🎉Nice!🎊</h3>
              <p>
                You uploaded your first spreadsheet! Scroll down to see our
                staging area, or upload another spreadsheet!
              </p>
            </Fragment>
          ) : null}
          <StyledFileInput
            data-testid="csvFileInput"
            type="file"
            ref={props.fileInputRef}
          />
        </div>
        <div>
          <Button
            block
            data-testid="addSpreadsheetButton"
            onClick={() => props.uploadRequest()}
            color="limegreen"
          >
            Add Spreadsheet
          </Button>
          <Button
            block
            data-testid="clearFileButton"
            onClick={(e) => props.clearFileHandler(e)}
          >
            Clear File
          </Button>
        </div>
        {props.warn ? <InvalidFiletype /> : null}
      </Container>
      <div>
        <h3>Donate and Share!</h3>
        <P justify>
          Please do share this tool with your colleagues, and consider chipping
          in a few dollars to keep this site alive. We depend on your donations!
        </P>
        <Donate />
      </div>
    </Description>
  );
};

FileUploadForm.propTypes = {
  uploadRequest: PropTypes.func.isRequired,
  firstGroupUploaded: PropTypes.bool,
};

FileUploadForm.defaultProps = {
  firstGroupUploaded: false,
};

export default FileUploadForm;
