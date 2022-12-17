import React, {Fragment} from "react";

const OptionGenerator = (props) => {
    let opts = props.options
    return (
        <Fragment>
            <option value="">Choose an option</option>
            {opts.map((option) => (
                <option value={option}>
                    {option}
                </option>
            ))}</Fragment>)
        ;
}
export default OptionGenerator;