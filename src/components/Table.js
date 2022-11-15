const Table = (tableData) => {
    tableData = tableData['tableData'];
    let headers = []
    let data = []
    tableData.forEach((value) => {
        data.push(Object.values(value))
    })
    for (let key in tableData[0]) {
        headers.push(key);
    }
    return (
        <table className="table">
            <thead>
            <tr>
                {headers.map((header) => (
                    <th>
                        {header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>{data.map((values) => (
                <tr>
                    {values.map((value) => (
                        <td>
                            {value}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    )
}
export default Table;