import React from 'react';

import Header from './Header';

const Layout: React.FC = ({ children }) => (
	<div className="grid">
		<Header title={'artLAB'} />
		<p>Register art events all over the world, and locate the ones you want.</p>

		{children}
	</div>
)

export default Layout;