import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1>
          Something went wrong: <br></br>
          {this.state.error.message}
          <br></br>
          Try reloading the page
        </h1>
      );
    }
    return this.props.children;
  }
}
