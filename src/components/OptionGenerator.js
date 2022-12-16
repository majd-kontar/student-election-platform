import React from "react";

const OptionGenerator = (props) => {
    let opts = props.options
    return (
        opts.map((option) => (
            <option value={option}>
                {option}
            </option>
        )))
        ;
}
export default OptionGenerator;