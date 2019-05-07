import React, { useState } from 'react';
import NetworkGraph from '../NetworkGraph/NetworkGraph';

const CompSys = (props) => {
    const {
        onSelectFile,
        saveFile,
        clear,
        data,
        setData,
    } = props;

    const sysEl = (data) => (
        data && data.map((el, index) =>
            <tr key={index}
                onChange={changeData}
            >
                <td>
                    <input
                        type="number"
                        defaultValue={el.from ? el.from : 1}
                        min={1}
                        max={data.length}
                        name='from'
                        data-from={index}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        defaultValue={el.to}
                        min={1}
                        max={data.length}
                        data-to={index}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        defaultValue={el.weight}
                        min={1}
                        data-weight={index}
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

        setData(data);
    };

    const generateData = () => {
        const nodesArr = [];
        const edgesArr = [];

        data.forEach((el) => {
            (el.from || el.from === 0) && nodesArr.push({
                id: el.from,
                label: el.from,
            });

            el.to && el.to.trim().split(',').forEach((to) => {
                nodesArr.push({
                    id: to,
                    label: to,
                });
                edgesArr.push({
                    from: parseInt(el.from, 10) - 1,
                    to: parseInt(to, 10) - 1,
                    label: el.weight
                });
            });
        });

        const uniqueId = [];
        const uniqueArr = [];

        nodesArr.forEach((el) => {
            if (uniqueId.indexOf(el.id) === -1) {
                uniqueId.push(el.id);
                uniqueArr.push({
                    id: parseInt(el.id - 1, 10),
                    label: (parseInt(el.label,10)).toString()
                });
            }
        });

        return { uniqueArr, edgesArr };
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
                        <span>Вага</span>
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
                    data={generateData()}
                />
            </div>
        </div>
    );
};

export default CompSys;