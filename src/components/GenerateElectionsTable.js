import ElectionsTable from "./ElectionsTable";

const GenerateElectionsTable = (props) => {
    let elections = props;
    let tables = []
    {
        Object.keys(elections).forEach(key => {
                (key === '0') ?
                    tables.push(
                        <h1 className='Error'>
                            An Error Occurred!
                        </h1>
                    ) :
                    tables.push(<div>
                        <h1>
                            {key}
                        </h1>
                        <ElectionsTable tableData={elections[key]}/>
                    </div>)
            }
        )
    }
    return (
        <div>
            {tables}
        </div>
    )
}
export default GenerateElectionsTable;