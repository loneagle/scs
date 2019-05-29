import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <Link to="/graph">
                Граф КС
            </Link>
            <Link to="/comsys">
                Граф задачі
            </Link>
            <Link to="/modeling">
                Черги
            </Link>
            <Link to="/generation">
                Генерація
            </Link>
            <Link to="/planning">
                Планувальник
            </Link>
        </header>
    );
};

export default Header;
