import './Charts.css'
import {Chart} from "react-google-charts";


const ResultsChart = (props) => {
    let data = [['Votes', 'Total Votes']]
    for (let val of props.data) {
        if (val['Name']) {
            data.push([val['Name'], val['Value']])
        }
    }
    console.log(data)
    const options = {
        title: props.title,
        is3D: true,
    };
    return (
        <Chart
            className='chart'
            chartType="PieChart"
            data={data}
            options={options}
            width={"100%"}
            height={"400px"}
        />
    )
}
export default ResultsChart;
