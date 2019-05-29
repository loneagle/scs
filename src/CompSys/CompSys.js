import React  from 'react';
import NetworkGraph from '../NetworkGraph/NetworkGraph';

const CompSys = (props) => {
    const {
        onSelectFile,
        saveFile,
        clear,
        data,
        setData,
        generateData,
        transformToMatrix
} = props;

    const sysEl = (data) => (
        data && data.map((el, index) =>
            <tr key={index}
            >
                <td>
                    <input
                        type="number"
                        value={el.from}
                        onChange={changeData}
                        min={1}
                        name='from'
                        data-from={index}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        value={el.to}
                        min={1}
                        onChange={changeData}
                        data-to={index}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={el.weight}
                        min={1}
                        onChange={changeData}
                        data-weight={index}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={el.edgeweight}
                        min={1}
                        onChange={changeData}
                        data-edgeweight={index}
                    />
                </td>
                <td>
                    <span
                        id={index}
                        onClick={delEdge}
                    >
                        X
                    </span>
                </td>
            </tr>
        )
    );

    const addEdge = () => {
        data.push({});

        setData(data);
    };

    const delEdge = (e) => {
        data.splice(e.target.id, 1);

        setData(data);
    };

    const changeData = (e) => {
        if (e.target.dataset.from) {
            data[e.target.dataset.from].from = e.target.value;
        }
        if (e.target.dataset.to) {
            data[e.target.dataset.to].to = e.target.value;
        }
        if (e.target.dataset.weight) {
            data[e.target.dataset.weight].weight = e.target.value;
        }
        if (e.target.dataset.edgeweight) {
            data[e.target.dataset.edgeweight].edgeweight = e.target.value;
        }

        setData(data);
    };

    function getCycle(data) {
        const { uniqueArr } = data;
        const matrix = transformToMatrix(data);
        const dfsArr = [...uniqueArr];
        const dfs = (id) => { // самая важная функция: обход орграфа и поиск цикла
            dfsArr.forEach((i) => {
                if (i.id === id) {
                    i.ind = true;
                }
            });

            for (let j = 0; j < dfsArr.length; ++j) { // побежали обходить потомков вершины i
                if (matrix[id][j] === 0) continue; // нет ребра i->j
                let findByidEl = dfsArr.filter((el) => el.id === j);
                if ( !findByidEl[0].ind) { // в вершине j мы еще ни разу не были
                    if ( !dfs( j ) ) // обходим вершину j (и всех ее потомков)
                        return false; // где-то в процессе обхода потомков вершины j нашли цикл (слышен крик из глубины) (как нашли смотри на пару строк ниже)
                    dfsArr.forEach((i) => { // еще раз помечаем вершину, но теперь все ее потомки обойдены и здесь нам делать нечего (обратный обход)
                        if (i.id === j) {
                            i.check = true;
                        }
                    });
                }
                // слеующая строка самая главная, ради нее всё и затевалось, ради нее делались все пометки в векторах pre и post
                else if ( !dfsArr.filter((el) => el.id === j)[0].check ) // в вершине j мы уже были (т.к. pre[ j ] == true), но обошли не всех ее потомков - это и есть условие цикла (это сложно понять, но это так)
                    return false; // кричим из глубины рекурсии, что цикл найден
            }
            return true; // крика не было, всё тихо, т.е. true
        };

        const isDAG = () => { // функция проверки на то, является ли орграф DAG-графом, т.е. орграфом, не содержащим циклов
            for ( let i = 0; i < uniqueArr.length; i++ ) // этот for и следующий за ним if нужны для несвязных графов; если граф связный то можно обойтись только вызовом dfs( 0 )
            {
                if ( !dfsArr.filter((el) => el.id === i)[0].check ) // описал выше
                    if ( !dfs( i ) ) // запуск проверки орграфа на циклы
                        return false; // был найден цикл
            }
            return true; // как мы не мучили орграф, но так и не смогли найти цикл
        };

        return isDAG();
    }

    return (
        <div className="graph">
            <div className="graph-data">
                <div className="inputData">
                    <span>
                        Введення даних
                    </span>
                    <div className="fileName">
                        <span>Назва файлу</span>
                        <input
                            type="text"
                            id="name"
                            defaultValue="file"
                        />
                    </div>
                </div>
                <div className="tableOperations">
                    <span>
                        <a href="/" id="save" onClick={() => saveFile(data.length)}>Зберегти</a>
                    </span>
                    <input
                        type="file"
                        onChange={onSelectFile}
                    />
                    <span
                        onClick={clear}
                        className="clear"
                    >
                        Очистити
                    </span>
                </div>
            </div>
            <button onClick={() => { if (!getCycle(generateData(data,false))) alert('Є цикл')} }>Перевірити</button>
            <table>
                <thead>
                <tr>
                    <th>
                        <span>З</span>
                    </th>
                    <th>
                        <span>До</span>
                    </th>
                    <th>
                        <span>Вага з'єднання</span>
                    </th>
                    <th>
                        <span>Вага ядра</span>
                    </th>
                    <th>
                        <span>Видалити</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {sysEl(data)}
                <tr>
                    <td
                        colSpan={3}
                        onClick={addEdge}
                    >
                        Додати
                    </td>
                </tr>
                </tbody>
            </table>
            <h2>Згенерований граф</h2>
            <div className="network">
                <NetworkGraph
                    data={generateData(data,false)}
                />
            </div>
        </div>
    );
};

export default CompSys;