import React, { Component } from "react";
import Teacher from "./teacher";


/*
I am circumventing this component for now. The idea of changing the key prop of 
the child component to reset it will not work. I think the teacher component is
fairly robust, it just locks up if a very large file is sent. If anything, the
answer to error handling is probably to configure papaparse to throw errors, and
for the component itself to catch them and do something about it; not a parent
error boundary component.

For now, I will leave this here, and I can return to error handling in the teacher
component if it appears to be a problem later.
*/
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, teacherKey: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    //todo: dispatch error to log via redux/ajax
    console.log(error, errorInfo);
  }

  reset = () => {
    this.setState({
      hasError: false,
      teacherKey: Math.random().toString(),
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="description blanket">
          <h2>Oops!</h2>
          <p>
            Something went wrong; please give it another shot, and make sure
            that you're using a csv file!
          </p>
          <button onClick={() => this.reset()}>Ok</button>
        </div>
      );
    } else {
      return (
        <ErrorBoundary>
          <Teacher key={this.state.teacherKey} />{" "}
        </ErrorBoundary>
      );
    }
  }
}

export default ErrorBoundary;
