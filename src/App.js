import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './Header/Header';
import Graph from './Graph/Graph';
import CompSys from './CompSys/CompSys';

class App extends Component {
    state = {
        fileReader: new FileReader(),
        data: [],
        size: 2,
    };

    fileRead = () => {
        const content = this.state.fileReader.result;
        const loadData = JSON.parse(content);
        document.getElementById('name').value = loadData.name;
        document.getElementById('size').value = loadData.data.length;
        loadData.data.forEach((arr, i) => {
            arr.forEach((el,j) => {
                document.getElementById(`${i}--${j}`).value = el;
            });
        });
    };

    onSelectFile = e => {
        const file = e.target.files[0];
        let { fileReader } = this.state;
        fileReader.onloadend = this.fileRead;
        this.setState({fileReader: fileReader});
        this.state.fileReader.readAsText(file);
    };

    saveFile = (size) => {
        const blob = new Blob([JSON.stringify(this.newData(size))], { type: 'text/plain' });
        const anchor = document.getElementById("save");

        anchor.download = `${this.newData(size).name}.json`;
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    };

    newData = (size) => {
        const newData = { name: "", data: [] };

        for (let i=0; i<size; i++) {
            newData.data.push([]);
            for (let j=0; j<size; j++) {
                newData.data[i].push(document.getElementById(`${i}--${j}`).value)
            }
        }

        newData.name = document.getElementById('name').value;

        return newData;
    };

    clear = () => {
        for (let i=0; i<this.state.size; i++) {
            for (let j=0; j<this.state.size; j++) {
                document.getElementById(`${i}--${j}`).value = "0";
            }
        }
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
                            newData={this.newData}
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
                            newData={this.newData}
                        />
                    )}
                    exact
                />
            </Router>
        );
    }
}

export default App;
