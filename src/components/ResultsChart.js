import './Charts.css'
import {Chart} from "react-google-charts";


const ResultsChart = (props) => {
    const options = {
        title: props.title,
        is3D: true,
    };
    return (
        <Chart
            className='chart'
            chartType="PieChart"
            data={props.data}
            options={options}
            width={"100%"}
            height={"400px"}
        />
    )
}
export default ResultsChart;
