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
import RequestDetail from './requestDetail/RequestDetail';

const ServiceDesk = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [openNewRequestForm, setOpenNewRequestForm] = useState<boolean>(false);

	return (
		<div className={styles.serviceDesk}>
			<Drawer open={openNewRequestForm} onClose={() => setOpenNewRequestForm(false)}>
				<NewRequest sp={sp} />
			</Drawer>
			<div className={styles.requests}>
				<div className={styles.requestTable}>
					<Requests sp={sp} />
				</div>
				<div className={styles.buttonGroup}>
					<Button
						onClick={() => setOpenNewRequestForm(true)}
						variant='contained'
						size='large'
						sx={{ backgroundColor: '#1347a4' }}>
						Click
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ServiceDesk;
