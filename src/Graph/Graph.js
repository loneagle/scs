import React, { useState } from 'react';
import NetworkGraph from '../NetworkGraph/NetworkGraph';

const Graph = (props) => {
    const [ size, setSize ] = useState(2);
    const [ data, setData ] = useState({});
    const {
        createTable,
        onSelectFile,
        saveFile,
        newData,
        clear,
    } = props;

    const generateData = () => {
        const nodesArr = [];
        const edgesArr = [];
        const matrix = newData(size);

        console.log(matrix);

        for (let i = 0; i < size; i++) {
            nodesArr.push({
                id: i,
                label: (i + 1).toString(),
            });
        }

        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                console.log(matrix.data[j][k]);
                if (matrix.data[j][k] !== '0' && matrix.data[j][k] !== '')
                    edgesArr.push({
                        from: j,
                        to: k
                    });
            }
        }

        setData({ nodesArr, edgesArr });
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
                    <div className="matType">
                    <span>
                        Матриця розмірністю
                    </span>
                        <input
                            type='number'
                            onChange={e => setSize(e.target.value)}
                            value={size}
                        />
                    </div>
                </div>
                <div className="tableOperations">
                    <span>
                        <a href="/" id="save" onClick={() => saveFile(size)}>Зберегти</a>
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
            {createTable(size)}
            <h2 onClick={() => generateData()}>Згенерувати</h2>
            <div className="network">
                <NetworkGraph
                    data={data}
                />
            </div>
        </div>
    );
};

export default Graph;