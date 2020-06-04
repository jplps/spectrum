import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC = ({ children }) => (
	<div className="grid">
		<Link to='/'>
			<img
				style={{
					width: '100%',
					height: 'auto'
				}}
				src="http://localhost:4000/assets/logo.png"
				alt="Spectrum Logo"
			/>
		</Link>
		<p>Register art events all over the world, and locate the ones you want.</p>

		{children}
	</div >
)

export default Layout;