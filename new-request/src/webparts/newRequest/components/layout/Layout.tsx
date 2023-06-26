import * as React from 'react';
import Requests from '../requests/Requests';

const Layout = (): JSX.Element => {
	return (
		<div>
			<Requests />
			<button>New Service Request</button>
		</div>
	);
};

export default Layout;
