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

type pageType = 'REQUESTS' | 'NEW_REQUEST' | 'REQUEST_DETAIL';

const ServiceDesk = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [activePage, setActivePage] = useState<pageType>('REQUESTS');
	return (
		<div className={styles.serviceDesk}>
			{activePage === 'REQUESTS' && (
				<div className={styles.requests}>
					<div className={styles.requestTable}>
						<Requests sp={sp} />
					</div>
					<div className={styles.buttonGroup}>
						<button onClick={() => setActivePage('NEW_REQUEST')}>NEW REQUEST</button>
					</div>
				</div>
			)}
			{activePage === 'NEW_REQUEST' && (
				<div className={styles.newRequest}>
					<div className={styles.newRequestForm}>
						<NewRequest sp={sp} />
					</div>
					<div className={styles.buttonGroup}>
						<button onClick={() => setActivePage('REQUESTS')}>Cancel</button>
					</div>
				</div>
			)}
			{activePage === 'REQUEST_DETAIL' && (
				<div className={styles.requestDetail}>
					<NewRequest sp={sp} />
				</div>
			)}
		</div>
	);
};

export default ServiceDesk;
