import * as React from 'react';
import { MouseEvent } from 'react';
import styles from './Requests.module.scss';
import { IRequest } from './IRequests';
import { useEffect, useState } from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';
import { IAttachmentInfo } from '@pnp/sp/attachments';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';

const Requests = ({ context }: { context: WebPartContext }): JSX.Element => {
	const [requests, setRequests] = useState<IRequest[]>([]);
	const sp: SPFI = spfi().using(SPFx(context));
	const [currentUser, setCurrentUser] = useState<ISiteUserInfo | null>(null);

	useEffect(() => {
		sp.web.lists
			.getByTitle('Requests')
			.items()
			.then((response) => setRequests(response))
			.then(() => console.log(currentUser))
			.catch((error: Error) => console.error(error.message));
		sp.web
			.currentUser()
			.then((response) => setCurrentUser(response))
			.catch((error: Error) => console.error(error.message));
	}, []);

	const getAttachedFile = async (item: IRequest): Promise<IAttachmentInfo> => {
		const attachedFile: IAttachmentInfo = await item.attachmentFiles.getByName('file.txt')();
		return attachedFile;
	};

	return (
		<div className={styles.container}>
			<div className={styles.requests}>
				{requests.length > 0 ? (
					<table>
						<tr>
							<th>Category</th>
							<th>Sub Category</th>
							<th>Description</th>
							<th>Priority</th>
							<th>Assigned To</th>
							<th>Submitted By</th>
							<th>Created Time</th>
							<th>Completed By</th>
							<th>Completed Time</th>
							<th>Attachment</th>
							<th className={styles.icon}>More</th>
						</tr>
						{requests.map((request, index) => (
							<tr key={index}>
								<td>{request.Category}</td>
								<td>{request.SubCategory}</td>
								<td>{request.Description}</td>
								<td>{request.Priority}</td>
								<td>{request.AssignTo}</td>
								<td>{request.CreatedBy}</td>
								<td>{request.CreatedOn}</td>
								<td>{request.CompletedBy}</td>
								<td>{request.CompletedTime}</td>
								<td>{request.Attachment && getAttachedFile(request)}</td>
								<td className={styles.icon}>
									<a href='https://usdtl.sharepoint.com/ServiceDesk/Pages/RequestDetail.aspx'>
										<Icon iconName='MoreVertical' />
									</a>
								</td>
							</tr>
						))}
					</table>
				) : (
					<div>There are no request for you</div>
				)}
			</div>
			<div className={styles.buttonGroup}>
				<a href='https://usdtl.sharepoint.com/ServiceDesk/Pages/NewRequest.aspx'>
					<button onClick={(event: MouseEvent<HTMLElement>) => event.preventDefault()}>NEW REQUEST</button>
				</a>
			</div>
		</div>
	);
};

export default Requests;
