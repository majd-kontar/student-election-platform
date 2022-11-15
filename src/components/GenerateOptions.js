import React from "react";

const GenerateOptions = (props) => {
    let toReturn = props.map((option, index) => (
        <option key={index} value={option}>
            {option}
        </option>))
    return toReturn;
}
export default GenerateOptions;