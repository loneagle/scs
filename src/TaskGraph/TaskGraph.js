import React  from 'react';
import NetworkGraph from '../NetworkGraph/NetworkGraph';

const TaskGraph = (props) => {
    const {
        onSelectFile,
        saveFile,
        clear,
        data,
        setData,
        generateData,
        getCycle,
} = props;

    const sysEl = (data) => (
        data && data.map((el, index) =>
            <tr key={index}
            >
                <td>
                    <input
                        type="number"
                        value={el.from}
                        onChange={changeData}
                        min={1}
                        name='from'
                        data-from={index}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        value={el.to}
                        min={1}
                        onChange={changeData}
                        data-to={index}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={el.weight}
                        min={1}
                        onChange={changeData}
                        data-weight={index}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={el.edgeweight}
                        min={1}
                        onChange={changeData}
                        data-edgeweight={index}
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
        if (e.target.dataset.weight) {
            data[e.target.dataset.weight].weight = e.target.value;
        }
        if (e.target.dataset.edgeweight) {
            data[e.target.dataset.edgeweight].edgeweight = e.target.value;
        }

        setData(data);
    };

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
            <button onClick={() => { if (!getCycle(generateData(data,false))) alert('Є цикл')} }>Перевірити</button>
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
                        <span>Вага з'єднання</span>
                    </th>
                    <th>
                        <span>Вага ядра</span>
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
            <h2>Згенерований граф</h2>
            <div className="network">
                <NetworkGraph
                    data={generateData(data,false)}
                />
            </div>
        </div>
    );
};

export default TaskGraph;