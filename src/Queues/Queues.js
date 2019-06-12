import React from 'react';

const Queues = (props) => {
    const {
        dataTask,
        transformToMatrix,
        generateData,
        getPathes,
        setQueues,
    } = props;

    const matrix = transformToMatrix(generateData(dataTask));
    const pathes = getPathes(matrix);

    const parentsAndLasts = () => {
        const last = [],
            parents = [];
        matrix.forEach((row, index) => {
            if (row.every((cell) => cell === 0) === true) {
                last.push(index);
            }
        });
        for (let i = 0; i < matrix.length; i++) {
            let count = 0;
            for (let j=0; j < matrix.length; j++) {
                if (matrix[j][i] !== 0) {
                    count++;
                }
            }
            if (count === 0) {
                parents.push(i);
            }
        }
        return { parents, last };
    };

    const formQueue5 = (dataTask) => {
        const { last } = parentsAndLasts(dataTask);
        const { uniqueArr } = generateData(dataTask);

        const queue = [];
        pathes.forEach((row, i) => {
            let max = 0;
            let linking = 0;
            row.forEach((cell, j) => {
                if (last.includes(j) && (cell !== Infinity)) {
                    max = (max < cell) ? cell : max;
                }
                if (matrix[i][j] !== 0) {
                    linking++;
                }
                if (matrix[j][i] !== 0) {
                    linking++;
                }
            });
            queue.push({i, max, linking});
        });

        queue.sort(compareLink);
        queue.sort(compareMax);

        function compareLink( a, b ) {
            if ( a.linking > b.linking ){
                return -1;
            }
            if ( a.linking < b.linking ){
                return 1;
            }
            return 0;
        }
        function compareMax( a, b ) {
            if ( a.max > b.max ){
                return -1;
            }
            if ( a.max < b.max ){
                return 1;
            }
            return 0;
        }

        queue.forEach((el) => {
            el.index = uniqueArr[el.i].label;
        });

        return queue;
    };

    const formQueue16 = (dataTask) => {
        function paths({ graph = [], from, to }, path = []) {
            const linkedNodes = memoize(nodes.bind(null, graph));
            return explore(from, to);

            function explore(currNode, to, paths = []) {
                path.push(currNode);
                for (let linkedNode of linkedNodes(currNode)) {
                    if (linkedNode === to) {
                        let result = path.slice(); // copy values
                        result.push(to);
                        paths.push(result);
                        continue;
                    }
                    // do not re-explore edges
                    if (!hasEdgeBeenFollowedInPath({
                        edge: {
                            from: currNode,
                            to: linkedNode
                        },
                        path
                    })) {
                        explore(linkedNode, to, paths);
                    }
                }
                path.pop(); // sub-graph fully explored
                return paths;
            }
        }

        /**
         * Get all nodes linked
         * to from `node`.
         */
        function nodes(graph, node) {
            return graph.reduce((p, c) => {
                (c[0] === node) && p.push(c[1]);
                return p;
            }, []);
        }

        /**
         * Has an edge been followed
         * in the given path?
         */
        function hasEdgeBeenFollowedInPath({ edge, path }) {
            var indices = allIndices(path, edge.from);
            return indices.some(i => path[i + 1] === edge.to);
        }

        /**
         * Utility to get all indices of
         * values matching `val` in `arr`.
         */
        function allIndices(arr, val) {
            var indices = [],
                i;
            for (i = 0; i < arr.length; i++) {
                if (arr[i] === val) {
                    indices.push(i);
                }
            }
            return indices;
        }

        /**
         * Avoids recalculating linked
         * nodes.
         */
        function memoize(fn) {
            const cache = new Map();
            return function() {
                const key = JSON.stringify(arguments);
                let cached = cache.get(key);
                if (cached) {
                    return cached;
                }
                cached = fn.apply(this, arguments);
                cache.set(key, cached);
                return cached;
            };
        }

        const { edgesArr, uniqueArr } = generateData(dataTask);
        const { parents } = parentsAndLasts(dataTask);

        const graph = edgesArr.map((el) => [el.to, el.from]);
        const result  = [];

        for (let i = matrix.length - 1; i >= 0 ; i--) {
            let max = 0;
            parents.forEach((el) => {
                const pathsArr = paths({
                    graph,
                    from: i,
                    to: el
                });
                pathsArr.forEach((pel) => {
                    let sum = 0;
                    pel.forEach((pathItem)=> {
                        const fel = uniqueArr.filter((fel) => fel.id === pathItem);
                        sum += parseInt(fel[0].label.split('/')[0], 10);
                    });
                    max = max < sum ? sum : max;
                });
            });
            if (max !== 0)
                result.push({ i, max });
        }
        parents.forEach((el) => {
            const k = uniqueArr.filter((fel) => fel.id === el);
            const i = k[0].id;
            const max = parseInt(k[0].label.split('/')[0], 10);
            result.push({ i, max });
        });

        result.sort(compareSort);

        const newResult = result.map((el) => {
            let checkVal = uniqueArr.filter(uel => uel.id === el.i);
            if (checkVal.length) {
                el.index = checkVal[0].label;
            }
            return el;
        });

        function compareSort( a, b ) {
            if ( a.max > b.max ){
                return -1;
            }
            if ( a.max < b.max ){
                return 1;
            }
            return 0;
        }
        return newResult.reverse();
    };

    const q4 = formQueue5(dataTask);
    const q16 = formQueue16(dataTask);
    const save = (q4, q16) => {
        setQueues({ q4,q16 });
    };

    return (
        <div>
            <h1>Варіанти</h1>
            <h2>4 варіант</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Ядро з вагою</th>
                            <th>Критичний шлях</th>
                            <th>Зв'язність</th>
                        </tr>
                    </thead>
                    <tbody>
                    {q4.map((el) => (
                        <tr key={el.index}>
                            <td>{el.index}</td>
                            <td>{el.max}</td>
                            <td>{el.linking}</td>
                        </tr>))}
                    </tbody>
                </table>
            <h2>16 варіант</h2>
            <ul>
                {q16.map((el) => (<li key={el.index}>{el.index} - {el.max}</li>))}
            </ul>
            <button onClick={() => save(q4, q16)}>Зберегти для призначення</button>
        </div>
    );
};

export default Queues;