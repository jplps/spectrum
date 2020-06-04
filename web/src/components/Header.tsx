import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
	title: string;
}

const Header: React.FC<HeaderProps> = props => (
	<Link to="/">
		<h1>{props.title}</h1>
	</Link>
)

export default Header;