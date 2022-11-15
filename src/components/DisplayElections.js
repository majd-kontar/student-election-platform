import Table from "./Table";

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
    return (
        <div>
            {Object.keys(elections).forEach(key => {
                tables.push(<div>
                    <h1>
                        {key}
                    </h1>
                    <Table tableData={elections[key]}/>
                </div>)
            })
            }
            {tables}
        </div>
    )
}
export default DisplayElections;