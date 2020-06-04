import React from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../components/Layout';

const Locate = () => {
	return (
		<Layout>
			<main className="grid">
				<Link to="/register">Register</Link>
			</main>
		</Layout>
	)
}

export default Locate;