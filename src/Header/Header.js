import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <Link to="/graph">
                Граф
            </Link>
            <Link to="/comsys">
                Граф КС
            </Link>
            <Link to="modeling">
                Моделювання
            </Link>
            <Link to="/statistics">
                Статистика
            </Link>
            <Link to="/help">
                Допомога
            </Link>
            <Link to="/">
                Вихід
            </Link>
        </header>
    );
};

export default Header;
