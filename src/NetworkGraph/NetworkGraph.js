import React from 'react';
import { Network, Node, Edge } from 'react-vis-network';

const NetworkGraph = (props) => {
    const { data } = props;
    const { uniqueArr, edgesArr } = data;

    if (uniqueArr && edgesArr) {
        const nodes = uniqueArr.map((i,index) =>
            <Node key={`n${index}`} id={index} label={i.label} />
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