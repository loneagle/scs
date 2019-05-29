import React from 'react';
import NetworkGraph from "../NetworkGraph/NetworkGraph";

const Generator = (props) => {
    const uniqueArr = [];
    const nodesArr = [];

    return (
        <div>
            <div className="inputBasicGenerateData">
                <span>Вхідні дані</span>
                <div>
                    <span>Мінімальна вага</span>
                    <input
                        type="text"
                        id="minEdgeWeight"
                    />
                </div>
                <div>
                    <span>Максимальна вага</span>
                    <input
                        type="text"
                        id="maxEdgeWeight"
                    />
                </div>
                <div>
                    <span>Кількість вершин графу</span>
                    <input
                        type="text"
                        id="edgesNumber"
                    />
                </div>
                <div>
                    <span>Зв'язність графу</span>
                    <input
                        type="text"
                        id="correlationNumber"
                    />
                </div>
                <div>
                    <span>Мінімальна вага дуг</span>
                    <input
                        type="text"
                        id="minNodeWeight"
                    />
                </div>
                <div>
                    <span>Максимальна вага дуг</span>
                    <input
                        type="text"
                        id="maxNodeWeight"
                    />
                </div>
            </div>
            <h2>Згенерований граф</h2>
            <div className="network">
                <NetworkGraph
                    data={{uniqueArr, nodesArr}}
                />
            </div>
        </div>
    );
};

export default Generator;