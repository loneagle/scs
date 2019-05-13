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
        this.setState({ dataGraph: e })
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
        const newData = {
            name: document.getElementById('name').value || "nonamed",
            dataTask: this.state.dataTask,
            dataGraph: this.state.dataGraph,
        };

        return newData;
    };

    clear = () => {
        Array.prototype.forEach.call(document.getElementsByTagName('input'), el => el.value = '');
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
                        />
                    )}
                    exact
                />
            </Router>
        );
    }
}

export default App;
