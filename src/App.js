import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header/Header';
import Graph from './Graph/Graph';
import CompSys from './CompSys/CompSys';

class App extends Component {
    state = {
        fileReader: new FileReader(),
        dataGraph: [],
        dataTask: [],
        size: 2,
    };

    setDataGraph = (e) => {
        this.setState({ dataGraph: e })
    };

    setDataTask = (e) => {
        this.setState({ dataTask: e })
    };

    onSelectFile = e => {
        const file = e.target.files[0];
        let { fileReader } = this.state;
        fileReader.onloadend = this.fileRead;
        this.setState({fileReader: fileReader});
        this.state.fileReader.readAsText(file);
    };

    fileRead = () => {
        const content = this.state.fileReader.result;
        const loadData = JSON.parse(content);
        document.getElementById('name').value = loadData.name;
        this.setState({
            dataGraph: loadData.dataGraph,
            dataTask: loadData.dataTask
        });
    };

    saveFile = (size) => {
        const blob = new Blob([JSON.stringify(this.newData(size))], { type: 'text/plain' });
        const anchor = document.getElementById("save");

        anchor.download = `${this.newData(size).name}.json`;
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    };

    newData = () => {
        return {
            name: document.getElementById('name').value || "nonamed",
            dataTask: this.state.dataTask,
            dataGraph: this.state.dataGraph,
        };
    };

    generateData = (data, ks) => {
        const nodesArr = [];
        const edgesArr = [];

        data.forEach((el) => {
            (el.from || el.from === 0) && nodesArr.push({
                id: el.from,
                label: el.from,
                edgeweight: el.edgeweight,
            });

            el.to && el.to.trim().split(',').forEach((to) => {
                nodesArr.push({
                    id: to,
                    label: to,
                });
                (ks) ? (
                    edgesArr.push({
                        from: parseInt(el.from, 10) - 1,
                        to: parseInt(to, 10) - 1,
                    })
                ) : (
                    edgesArr.push({
                        from: parseInt(el.from, 10) - 1,
                        to: parseInt(to, 10) - 1,
                        label: el.weight
                    })
                );
            });
        });

        const uniqueId = [];
        const uniqueArr = [];

        nodesArr.forEach((el) => {
            if (ks) {
                if (uniqueId.indexOf(el.id) === -1) {
                    uniqueId.push(el.id);
                    uniqueArr.push({
                        id: parseInt(el.id - 1, 10),
                        label: el.label
                    });
                }
            }
            else {
                if (uniqueId.indexOf(el.id) === -1 && el.edgeweight) {
                    uniqueArr.push({
                        id: parseInt(el.id - 1, 10),
                        label: `${el.edgeweight}/${el.label}`,
                    });
                }
            }
        });

        return { uniqueArr, edgesArr, ks };
    };

    clear = () => {
        Array.prototype.forEach.call(document.getElementsByTagName('input'), el => el.value = '');
        const tbody = document.querySelector("tbody");
        let lastChild = tbody.firstElementChild;
        while (tbody.childNodes.length > 2) {
            tbody.removeChild(lastChild);
            lastChild = tbody.firstElementChild;
        }
        this.setState({dataGraph: [{}], dataTask: [{}]});
    };

    render() {
        return (
            <Router>
                <Header />
                <Route
                    path="/graph"
                    component={() => (
                        <Graph
                            clear={this.clear}
                            onSelectFile={this.onSelectFile}
                            saveFile={this.saveFile}
                            data={this.state.dataGraph}
                            setData={this.setDataGraph}
                            generateData={this.generateData}
                        />
                    )}
                    exact
                />
                <Route
                    path="/comsys"
                    component={() => (
                        <CompSys
                            clear={this.clear}
                            onSelectFile={this.onSelectFile}
                            saveFile={this.saveFile}
                            data={this.state.dataTask}
                            setData={this.setDataTask}
                            generateData={this.generateData}
                        />
                    )}
                    exact
                />
            </Router>
        );
    }
}

export default App;
