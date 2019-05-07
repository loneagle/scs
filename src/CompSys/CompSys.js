import React, { Component } from 'react';
import NetworkGraph from '../NetworkGraph/NetworkGraph';

class CompSys extends Component {
    state = {
        size: 2,
        data: [{ from:null,to:null, weight:null }],
        dataNet: {},
    };

    generateData = () => {
        const nodesArr = [];
        const edgesArr = [];

        for (let i = 0; i < this.state.size; i++) {
            nodesArr.push({
                id: i,
                label: (i + 1).toString(),
            });
        }

        this.state.data.forEach((el) =>
            edgesArr.push({
                from: el.from,
                to: el.to,
                weight: el.weight,
            })
        );

        this.setState({dataNet: { nodesArr, edgesArr }});
    };

    sysEl = () => (
        this.state.data.map((el, index) =>
            <div key={`sel${index}`}>
                <span>З</span>
                <input
                    type="number"
                    defaultValue={el.from}
                    min={0}
                    max={this.state.size}
                />
                <span>До</span>
                <input
                    type="number"
                    defaultValue={el.to}
                    min={0}
                    max={this.state.size}
                />
                <span>Вага зв'язку</span>
                <input
                    type="number"
                    defaultValue={el.weight}
                />
                <span
                    id={index}
                    onClick={this.delEdge}
                >Видалити</span>
            </div>
        )
    );

    delEdge = (e) => {
        const oldData = this.state.data;
        oldData.splice(e.target.id, 1);
        this.setState({data: oldData});
    };

    addEdge = () => {
        const oldData = this.state.data;
        oldData.push({ from:null,to:null, weight:null });
        this.setState({data: oldData});
    };

    render() {
        return (
            <div className="graph">
                <div className="inputData">
                    <h3>
                        Введення даних
                    </h3>
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
                            Кількість процесорів
                        </span>
                        <input
                            type='number'
                            onChange={e => this.setState({size: (e.target.value)})}
                            value={this.state.size}
                        />
                    </div>
                    <div>
                        {this.sysEl()}
                        <button
                            type="button"
                            onClick={this.addEdge}
                        >
                            Додати зв'язок
                        </button>
                    </div>
                </div>
                <div className="tableOperations">
                    <span>
                        <a href="/" id="save" onClick={() => this.saveFile(this.state.size)}>Зберегти</a>
                    </span>
                    <span>
                        Вивантажити
                        <input
                            type="file"
                            onChange={this.onSelectFile}
                        />
                    </span>
                    <span
                        className="clear"
                    >
                        Очистити
                    </span>
                </div>
                <h2 onClick={() => this.generateData()}>Згенерувати</h2>
                <div className="network">
                    <NetworkGraph
                        data={this.state.dataNet}
                    />
                </div>
            </div>
        );
    };
}

export default CompSys;