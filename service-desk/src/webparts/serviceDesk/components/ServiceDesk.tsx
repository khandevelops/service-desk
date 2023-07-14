import * as React from 'react';
import styles from './ServiceDesk.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import NewRequest from './newRequest/NewRequest';
import Requests from './requests/Requests';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';
import { useState } from 'react';
import { Button, Drawer } from '@mui/material';

const ServiceDesk = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className={styles.container}>
			<Drawer open={open} anchor='right' onClose={() => setOpen(false)}>
				<NewRequest sp={sp} />
			</Drawer>
			<div className={styles.headerContainer}>
				<input type='search' />
				<Button variant='text' size='large' sx={{ backgroundColor: '#fff', color: '#2f3643' }}>
					NEW REQUEST
				</Button>

				{/* <Button
					onClick={() => setOpen(true)}
					variant='contained'
					size='large'
					sx={{ backgroundColor: '#1347a4' }}>
					Click
				</Button> */}
			</div>
			<div className={styles.bodyContainer}>
				<Requests sp={sp} />
			</div>
		</div>
	);
};

export default ServiceDesk;
