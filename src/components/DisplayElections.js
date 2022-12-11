import ElectionsTable from "./electionsTable";

const DisplayElections = (props) => {
    let elections = props;
    let tables = []
    if ('ERROR' in elections) {
        return (
            <h1>
                An Error Occurred!
            </h1>
        )
    }
    {Object.keys(elections).forEach(key => {
        tables.push(<div>
            <h1>
                {key}
            </h1>
            <ElectionsTable tableData={elections[key]}/>
        </div>)
    })
    }
    return (
        <div>
            {tables}
        </div>
    )
}
export default DisplayElections;