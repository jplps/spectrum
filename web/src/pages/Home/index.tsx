import React from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../components/Layout';

const Home = () => {
	return (
		<Layout>
			<main className="grid">
				<p>
					We believe that the most important form of expression with the reality
					by humans, is through the form of ART.
					<br />
					<br />
					The human application and physical expression of creativity through skills
					and imagination in order to produce objects, environments and experiences
					IS art.
					<br />
					<br />
					Our vision for the audio-visual events is that they can be displayed as
					ART LABORATORIES, comprehending all forms of human expression. Here you
					can find laboratories scattered all over the world!
				</p>

				<Link to="/register">Register</Link>
			</main>
		</Layout>
	)
}

export default Home;