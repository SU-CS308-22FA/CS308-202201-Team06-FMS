// Error message component
//
// @zgr2788
import React from "react";

const ErrorMessage = ({message}) => (
    <p className="has-text-weight-bold has-text-danger">{message}</p>
);

export default ErrorMessage;