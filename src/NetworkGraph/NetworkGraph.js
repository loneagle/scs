import React from 'react';
import Graph from 'vis-react';

const NetworkGraph = (props) => {
    const { data } = props;
    const { uniqueArr, edgesArr, ks } = data;

    if (uniqueArr && edgesArr) {
        const graph = {
            nodes: uniqueArr,
            edges: edgesArr
        };

        const options = {
            layout: {
                hierarchical: false
            },
            edges: {
                color: "#000000",
                arrows: {
                    to: { enabled: !ks }
                }
            },
        };

        return <Graph graph={graph} options={options} />;
    }

    return <div>Нових даних поки немає</div>;
};

export default NetworkGraph;