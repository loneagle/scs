import React from 'react';
import NetworkGraph from '../NetworkGraph/NetworkGraph';

const SysGraph = (props) => {
    const {
        onSelectFile,
        saveFile,
        clear,
        data,
        setData,
        generateData,
        transformToMatrix,
        getPathes,
} = props;

    const sysEl = (data) => (
        data && data.map((el, index) =>
            <tr key={index}
                onChange={changeData}
            >
                <td>
                    <input
                        type="number"
                        defaultValue={el.from}
                        min={1}
                        name='from'
                        data-from={index}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        defaultValue={el.to}
                        min={1}
                        data-to={index}
                    />
                </td>
                <td>
                    <span
                        id={index}
                        onClick={delEdge}
                    >
                        X
                    </span>
                </td>
            </tr>
        )
    );

    const addEdge = () => {
        data.push({});

        setData(data);
    };

    const delEdge = (e) => {
        data.splice(e.target.id, 1);

        setData(data);
    };

    const changeData = (e) => {
        if (e.target.dataset.from) {
            data[e.target.dataset.from].from = e.target.value;
        }
        if (e.target.dataset.to) {
            data[e.target.dataset.to].to = e.target.value;
        }

        setData(data);
    };

    const checkLinkConnectionFull = (matrix) => {
        let count = true;
        matrix.forEach((row) => {
            row.forEach((el) => {
                if (el === Infinity) count = false;
            })
        });

        return count;
    };

    const checkLinkConnection = (data) => {
        const { uniqueArr, edgesArr } = data;
        uniqueArr.forEach((el) => {
            let count = 0;
            edgesArr.forEach((edge) => {
                if (edge.from === el.id) {
                    count++;
                }
                if (edge.to === el.id) {
                    count++;
                }
            });

            el.count = count;
        });

        return uniqueArr.filter(el => el.count === 0);
    };

    const netWorkData = generateData(data, true);
    const linkConn = checkLinkConnection(netWorkData);
    const linkConnFull = checkLinkConnectionFull(getPathes(transformToMatrix(netWorkData)));

    return (
        <div className="graph">
            <div className="graph-data">
                <div className="inputData">
                    <span>
                        Введення даних
                    </span>
                    <div className="fileName">
                        <span>Назва файлу</span>
                        <input
                            type="text"
                            id="name"
                            defaultValue="file"
                        />
                    </div>
                </div>
                <div className="tableOperations">
                    <span>
                        <a href="/" id="save" onClick={() => saveFile(data.length)}>Зберегти</a>
                    </span>
                    <input
                        type="file"
                        onChange={onSelectFile}
                    />
                    <span
                        onClick={clear}
                        className="clear"
                    >
                        Очистити
                    </span>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>
                            <span>З</span>
                        </th>
                        <th>
                            <span>До</span>
                        </th>
                        <th>
                            <span>Видалити</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sysEl(data)}
                    <tr>
                        <td
                            colSpan={3}
                            onClick={addEdge}
                        >
                            Додати
                        </td>
                    </tr>
                </tbody>
            </table>
            {!(linkConnFull) &&
                <div className="errors">
                    <span className="error-title">Помилка зв'язності процесорів</span>
                    <ul>
                        {linkConn.map(el => <li key={`unique-${el.id}`}>{el.label}</li>)}
                    </ul>
                </div>
            }
            <h2>Згенерований граф</h2>
            <div className="network">
                <NetworkGraph
                    data={netWorkData}
                />
            </div>
        </div>
    );
};

export default SysGraph;