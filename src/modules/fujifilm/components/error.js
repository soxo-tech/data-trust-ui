
/**
 * Function to add error boundary
 * Using this component, If any functionality breaks, the application will not break
 */
import React from 'react';


class ErrorBoundary extends React.Component {
          constructor(props) {
                    super(props);
                    this.state = { hasError: false };
          }

          componentDidCatch(error, info) {
                    // Display fallback UI
                    this.setState({ hasError: true });
                    // You can also log the error to an error reporting service
                    // logErrorToMyService(error, info);
          }

          render() {
                    if (this.state.hasError) {
                              // You can render any custom fallback UI
                              return <p>The module you are trying to access is having some issue. Please do continue with the other modules while we work on this.</p>;
                    }
                    return this.props.children;
          }
}


export default ErrorBoundary