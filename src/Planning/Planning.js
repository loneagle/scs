import React, {useState} from 'react';
import NetworkGraph from "../NetworkGraph/NetworkGraph";
import GanttDiagram from "../NetworkGraph/GanttDiagram";

const Planning = (props) => {
    const {
        dataTask,
        dataProc,
        dataQueues,
        generateData,
        transformToMatrix,
    } = props;

    const [ data, setData ] = useState({});

    const { q4, q16 } = dataQueues;
    if (!dataTask.length || !dataProc.length || dataQueues.length || !q4 || !q16)
        return <h1>Не все заповнено</h1>;

    const proc = [];

    const getConnectifyProc = (dataProc) => {
        const matrix = transformToMatrix(generateData(dataProc, true));
        const loading = [];

        function compareLink( a, b ) {
            if ( a.connectify > b.connectify ){
                return -1;
            }
            if ( a.connectify < b.connectify ){
                return 1;
            }
            return 0;
        }

        matrix.forEach((row, id) => {
            row.connectify = 0;
            row.id = id;
            row.forEach((el) => {
                if (el !== 0) {
                    row.connectify++;
                }
            });

            loading.push([]);
        });

        matrix.sort(compareLink);

        return matrix;
    };

    const findParents = (dataTask, taskId) => {
        const { edgesArr } = generateData(dataTask, false);

        const arr = [];
        edgesArr.forEach((el) => {
            if (el.to === taskId) {
                arr.push(el.from);
            }
        });
        return arr;
    };

    const q4alg = (dataQueues, dataTask, dataProc) => {
        const { q4 } = dataQueues;
        const matrixProc = getConnectifyProc(dataProc, dataTask);
        const loadedTasks = [];
        const loadProc = [];

        for (let i = 0; i< matrixProc.length; i++) {
            loadProc.push([]);
            loadProc[i].id = i;
            loadProc[i].timeEnd = 0;
        }

        const startTime = 0;

        for (let el of q4) {
            if (findParents(dataTask, el.i).length === 0) {
                const obj = {
                    startTime: loadProc[getFreeProc(loadProc)].timeEnd,
                    endTime: loadProc[getFreeProc(loadProc)].timeEnd + +el.index.split('/')[0],
                    label: el.index.split('/')[1]
                };
                loadProc[getFreeProc(loadProc)].push(obj);
                loadProc[getFreeProc(loadProc)].timeEnd = loadProc[getFreeProc(loadProc)].timeEnd + parseInt(el.index.split('/')[0],10);
            } else {
                console.log(findParents(dataTask, el.i));
            }
        }
        return loadProc;
    };

    const getFreeProc = (loadProc) => {
        loadProc.sort(compareFree);

        function compareFree( a, b ) {
            if ( a.timeEnd < b.timeEnd ){
                return -1;
            }
            if ( a.timeEnd > b.timeEnd ){
                return 1;
            }
            return 0;
        }

        return loadProc[0].id;
    };

    const checkIsLoad = (loadProc) => {

    };

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
                label="4"
                processors={generateData(dataProc,true)}
                loadTasks={q4alg(dataQueues, dataTask, dataProc)}
            />
        </div>
    );
};

export default Planning;