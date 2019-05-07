import React from 'react';
import { Network, Node, Edge } from 'react-vis-network';

const NetworkGraph = (props) => {
    const { data } = props;
    const { nodesArr, edgesArr } = data;
    if (nodesArr && edgesArr) {
        const nodes = nodesArr.map((i,index) =>
            <Node key={`n${index}`} id={index} label={`${index}`} />
        );

        const edges = edgesArr.map((i, index) =>
            <Edge key={`e${index}`} id={index} from={i.from} to={i.to}/>
        );


        return (
            <Network>
                {nodes}
                {edges}
            </Network>
        )
    }
    return <div>Нових даних поки немає</div>;
};

export default NetworkGraph;