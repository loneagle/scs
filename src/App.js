import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header/Header';
import Graph from './Graph/Graph';
import CompSys from './CompSys/CompSys';
import Queues from './Queues/Queues';
import Generator from "./Generator/Generator";

class App extends Component {
    state = {
        fileReader: new FileReader(),
        dataGraph: [],
        dataTask: [],
        error: false,
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
        let edgesArr = [];

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
                        from: el.from,
                        to: to,
                    })
                ) : (
                    edgesArr.push({
                        from: el.from,
                        to: to,
                        label: el.weight
                    })
                );
            });
        });

        const uniqueId = [];
        const uniqueArr = [];
        let i = 0;

        nodesArr.forEach((el) => {
            if (ks) {
                if (uniqueId.indexOf(el.id) === -1) {
                    uniqueId.push(el.id);
                    uniqueArr.push({
                        id: i++,
                        label: el.label
                    });
                }
            }
            else {
                if (uniqueId.indexOf(el.id) === -1 && el.edgeweight) {
                    uniqueArr.push({
                        id: i++,
                        label: `${el.edgeweight}/${el.label}`,
                    });
                    uniqueId.push(el.id);
                }
            }
        });

        const newEdgesArr = [];
        edgesArr.forEach((edge) => {
            let Index = 0,
                Jndex = 0;
            uniqueArr.forEach((el) => {
                if (edge.from === el.label.split('/').pop()) Index = el.id;
                if (edge.to === el.label.split('/').pop()) Jndex = el.id;
            });

            newEdgesArr.push({from: Index, to: Jndex, label: edge.label})
        });

        edgesArr = newEdgesArr;

        return { uniqueArr, edgesArr, ks };
    };

    transformToMatrix = (data) => {
        const matrix = [];
        const { uniqueArr = [], edgesArr = [], ks } = data;

        uniqueArr.forEach((q,index) => {
            matrix.push([]);
            q.index = index;
            uniqueArr.forEach(() => {
                matrix[index].push(0);
            });
        });

        edgesArr.forEach((edge) => {
            matrix[edge.from][edge.to] = 1;
            if (ks) {
                matrix[edge.to][edge.from] = 1;
            }
        });

        return matrix;
    };

    getPathes(matrix) {
        const pathes = [];

        for (let i = 0; i < matrix.length; i++) {
            pathes.push(getShortestPath(matrix, i));
        }
        return pathes;

        function getShortestPath(ajacencyMatrix, startNode) {
            const pathWeight = [];
            for (let i = 0; i < ajacencyMatrix.length; i++) {
                pathWeight[i] = Infinity;
            }
            pathWeight[startNode] = 0;

            const queue = [startNode];
            let currentNode;

            while (queue.length !== 0) {
                currentNode = queue.shift();

                const currentConnected = ajacencyMatrix[currentNode];
                const neighborIndexes = [];
                let index = currentConnected.indexOf(1);
                while (index !== -1) {
                    neighborIndexes.push(index);
                    index = currentConnected.indexOf(1, index + 1);
                }

                for (let j = 0; j < neighborIndexes.length; j++) {
                    if (pathWeight[neighborIndexes[j]] === Infinity) {
                        pathWeight[neighborIndexes[j]] = pathWeight[currentNode] + 1;
                        queue.push(neighborIndexes[j]);
                    }
                }
            }
            return pathWeight;
        }
    }

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

    getCycle = (data) => {
        const { edgesArr: nodesArr , uniqueArr } = data;

        if (nodesArr.length === 0 || uniqueArr.length === 0) {
            return true;
        }

        const nodeById = new Map();
        const stackByNode = new Map();
        const visitedByNode = new Map();
        for (const node of uniqueArr) {
            nodeById.set(node.id, node);
            stackByNode.set(node, false);
            visitedByNode.set(node, false);
        }

        const isCyclic = (node, visited, stack) => {
            if (!visited.get(node)) {
                visited.set(node, true);
                stack.set(node, true);

                const connectedIds = [];
                nodesArr.forEach(el => { if (el.from === node.id) connectedIds.push(el.to) });

                for (const id of connectedIds) {
                    const childNode = nodeById.get(id);
                    if (!visited.get(childNode) && isCyclic(childNode, visited, stack)) {
                        return true;
                    } else if (stack.get(childNode)) {
                        return true;
                    }
                }
            }

            stack.set(node, false);

            return false;
        };

        for (const node of nodesArr) {
            const nodeObj = uniqueArr.filter((el) => (el.id === node.from))[0];

            if (isCyclic(nodeObj, visitedByNode, stackByNode)) {
                return false;
            }
        }

        return true;
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
                            getPathes={this.getPathes}
                            transformToMatrix={this.transformToMatrix}
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
                            getPathes={this.getPathes}
                            transformToMatrix={this.transformToMatrix}
                            getCycle={this.getCycle}
                        />
                    )}
                    exact
                />
                <Route
                    path="/modeling"
                    component={() => (
                        <Queues
                            dataTask={this.state.dataTask}
                            dataGraph={this.state.dataGraph}
                            error={this.state.error}
                            transformToMatrix={this.transformToMatrix}
                            generateData={this.generateData}
                            getPathes={this.getPathes}
                        />
                    )}
                    exact
                />
                <Route
                    path="/generation"
                    component={() => (
                        <Generator
                            transformToMatrix={this.transformToMatrix}
                            generateData={this.generateData}
                            getPathes={this.getPathes}
                            getCycle={this.getCycle}
                            setData={this.setDataTask}
                            data={this.state.dataTask}
                        />
                    )}
                    exact
                />
            </Router>
        );
    }
}

export default App;
