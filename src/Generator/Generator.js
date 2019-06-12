import React, { useState } from 'react';
import NetworkGraph from "../NetworkGraph/NetworkGraph";

const Generator = (props) => {
    const {
        getCycle,
    } = props;

    const [ data, setData ] = useState({});

    const getValues = () => ({
        edgesNumber: Number(document.getElementById("edgesNumber").value),
        minEdgeWeight: Number(document.getElementById("minEdgeWeight").value),
        maxEdgeWeight: Number(document.getElementById("maxEdgeWeight").value),
        correlationNumber: Number(document.getElementById("correlationNumber").value),
        minNodeWeight: Number(document.getElementById("minNodeWeight").value),
        maxNodeWeight: Number(document.getElementById("maxNodeWeight").value)
    });

    const genEdgeWithWeight = (edgeCount, minEdgeWeight, maxEdgeWeight) => {
        const edgesArr = [];
        for (let i = 0; i< edgeCount; i++) {
            const weight = Math.floor(Math.random() * (+maxEdgeWeight - +minEdgeWeight + 1)) + +minEdgeWeight;
            edgesArr.push({id: i, edgesWeight: weight, label: `${weight}/${i+1}`});
        }

        return edgesArr;
    };

    const getResWeight = (edgesArr) => {
        let res = 0;
        edgesArr.forEach((el) => res+=el.edgesWeight);

        return res;
    };

    const setNewLink = (edgesArr) => {
        const startEdge = Math.floor(Math.random() * (edgesArr.length));
        const finishEdge = Math.floor(Math.random() * (edgesArr.length));

        return  { from: startEdge, to: finishEdge, label: `${Math.floor(Math.random() * (+getValues().maxNodeWeight - +getValues().minNodeWeight)) + +getValues().minNodeWeight}`};
    };

    const getSumOfLinkWeights = (sum, cor) => {
        console.log(((sum * (1 - cor)) / cor), sum);
        return (sum*(1 - cor))/cor;
    };

    const generation = () => {
        const uniqueArr = genEdgeWithWeight(getValues().edgesNumber, getValues().minEdgeWeight, getValues().maxEdgeWeight);
        let edgesArr = [];
        let sumNodes = getSumOfLinkWeights(getResWeight(uniqueArr), getValues().correlationNumber);
        let countErr = 0;
        while (sumNodes > 0) {
            const newLink = setNewLink(uniqueArr);
            let count = 0;

            edgesArr.forEach((el) => {
                if ((el.from === newLink.from) && (el.to === newLink.to))
                    count++;
            });
            if (newLink.from === newLink.to) count++;

            if (count === 0) {
                edgesArr.push(newLink);
                const data = {
                    uniqueArr: uniqueArr,
                    edgesArr: edgesArr,
                    ks: false,
                };
                console.log("beforeIF", edgesArr);
                if (countErr>1000) break;
                if (!getCycle(data) && (data.edgesArr.length > 0)) {
                    edgesArr.pop();
                    countErr++;
                } else {
                    sumNodes = sumNodes - (+newLink.label);
                    console.log(sumNodes);
                }
            }
        }
        setData({ uniqueArr, edgesArr});
    };


    return (
        <div className="generator">
            <table>
                
            </table>
            <div className="inputBasicGenerateData">
                <h2>Вхідні дані</h2>
                <div>
                    <span>Мінімальна вага</span>
                    <input
                        type="number"
                        id="minEdgeWeight"
                    />
                </div>
                <div>
                    <span>Максимальна вага</span>
                    <input
                        type="number"
                        id="maxEdgeWeight"
                    />
                </div>
                <div>
                    <span>Кількість вершин графу</span>
                    <input
                        type="number"
                        id="edgesNumber"
                    />
                </div>
                <div>
                    <span>Кореляція</span>
                    <input
                        type="number"
                        id="correlationNumber"
                    />
                </div>
                <div>
                    <span>Мінімальна вага дуг</span>
                    <input
                        type="number"
                        id="minNodeWeight"
                    />
                </div>
                <div>
                    <span>Максимальна вага дуг</span>
                    <input
                        type="number"
                        id="maxNodeWeight"
                    />
                </div>
            </div>
            <h2 onClick={() => generation()}>Генерація</h2>
            <h2>Згенерований граф</h2>
            <div className="network">
                <NetworkGraph
                    data={data}
                />
            </div>
        </div>
    );
};

export default Generator;