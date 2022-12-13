import React from "react";

const OptionGenerator = (props) => {
    return props.map((option, index) => (
        <option key={index} value={option}>
            {option}
        </option>));
}
export default OptionGenerator;