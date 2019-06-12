import React, {useState} from 'react';
import NetworkGraph from "../NetworkGraph/NetworkGraph";
import GanttDiagram from "../NetworkGraph/GanttDiagram";

const Planning = (props) => {
    const {
        dataTask,
        dataProc,
        dataQueues,
        generateData,
    } = props;

    const [ data, setData ] = useState({});

    const { q4, q16 } = dataQueues;
    if (!dataTask.length || !dataProc.length || dataQueues.length)
        return <h1>Не все заповнено</h1>;

    return (
        <div className="planning">
            <h2>Граф системи</h2>
            <div className="network">
                <NetworkGraph
                    data={generateData(dataProc,true)}
                />
            </div>
            <h2>Граф задачі</h2>
            <div className="network">
                <NetworkGraph
                    data={generateData(dataTask,false)}
                />
            </div>
            <div>
                <h1>Варіанти</h1>
                <h2>4 варіант</h2>
                <table>
                    <thead>
                    <tr>
                        <th>Ядро з вагою</th>
                        <th>Критичний шлях</th>
                        <th>Зв'язність</th>
                    </tr>
                    </thead>
                    <tbody>
                    {q4.map((el) => (
                        <tr key={el.index}>
                            <td>{el.index}</td>
                            <td>{el.max}</td>
                            <td>{el.linking}</td>
                        </tr>))}
                    </tbody>
                </table>
                <h2>16 варіант</h2>
                <ul>
                    {q16.map((el) => (<li key={el.index}>{el.index} - {el.max}</li>))}
                </ul>
            </div>
            <h2>Діаграма Ганта</h2>
            <GanttDiagram
                data={data}
            />
        </div>
    );
};

export default Planning;