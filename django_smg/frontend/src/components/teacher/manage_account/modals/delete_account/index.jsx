import { connect } from "react-redux";

import { deleteAccount } from "Actions/auth.action";
import { DeleteAccount } from "./delete_account";

const mapStateToProps = (state) => {
  return {
    userId: state.auth.id,
  };
};

export default connect(mapStateToProps, { deleteAccount })(DeleteAccount);
