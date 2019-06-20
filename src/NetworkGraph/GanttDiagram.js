import React from 'react';
import Timeline from 'react-visjs-timeline';

const GanttDiagram = (props) => {
    const { processors, label, loadTasks} = props;

    const options = {
        width: '100%',
        height: '300px',
    };

    const { uniqueArr: groups } = processors;

    console.log(loadTasks, groups);

    const items = [];
    loadTasks.forEach((proc, id) => {
        proc.forEach((task, tId) => {
            let start, end;
            switch (task.startTime.toString().length) {
                case 1:
                    start = `000${task.startTime}-01-01`;
                    break;
                case 2:
                    start = `00${task.startTime}-01-01`;
                    break;
                case 3:
                    start = `0${task.startTime}-01-01`;
                    break;
                default:
                    console.log("nostarttime");
            }

            switch (task.endTime.toString().length) {
                case 1:
                    end = `000${task.endTime}-01-01`;
                    break;
                case 2:
                    end = `00${task.endTime}-01-01`;
                    break;
                case 3:
                    end = `0${task.endTime}-01-01`;
                    break;
                default:
                    console.log("noendtime");
            }
            items.push({id: parseInt(`1${id}000${tId}`, 10), content: task.label, group: proc.id, start: start, end: end});
        });
    });

    // const items = [
    //     {id: 1, content: 'item 1', group: 1, start: '2013-01-01', end: '2014-01-01'},
    //     {id: 2, content: 'item 2', group: 2, start: '2013-01-01', end: '2015-01-01'},
    //     {id: 3, content: 'item 3', group: 0, start: '2013-01-01', end: '2016-01-01'},
    //     {id: 4, content: 'item 4', group: 3, start: '2013-01-01', end: '2017-01-01'},
    // ];

    items.push(
        {id: 1011, content: '4 to 5', group: 0, start: '0006-01-01', end: '0011-01-01'},
        {id: 1012, content: '1 to 5', group: 0, start: '0003-01-01', end: '0006-01-01'},
        {id: 1013, content: '4 to 5', group: 1, start: '0011-01-01', end: '0016-01-01'},
        {id: 1014, content: '1 to 5', group: 1, start: '0016-01-01', end: '0019-01-01'},
        {id: 1017, content: '3 to 5', group: 3, start: '0007-01-01', end: '0009-01-01'},
    );


    return (
        <div>
            <h2>Алгоритм {label}</h2>
            <Timeline
                options={options}
                items={items}
                groups={groups}
            />
        </div>
    );
};

export default GanttDiagram;