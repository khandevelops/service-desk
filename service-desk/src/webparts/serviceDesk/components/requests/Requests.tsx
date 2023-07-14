import * as React from 'react';
import styles from './Requests.module.scss';
import { IRequest } from './IRequest';
import { useEffect, useState } from 'react';
import { SPFI } from '@pnp/sp';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IAttachmentInfo } from '@pnp/sp/attachments';
import { Drawer } from '@mui/material';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import RequestDetail from '../requestDetail/RequestDetail';

const Requests = ({ sp }: { sp: SPFI }): JSX.Element => {
	const [requests, setRequests] = useState<IRequest[]>([]);
	const [requestDetail, setRequestDetail] = useState<IRequest | null>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [currentUser, setCurrentUser] = useState<ISiteUserInfo | null>(null);

	useEffect(() => {
		sp.web.lists
			.getByTitle('Requests')
			.items()
			.then((response) => setRequests(response))
			.catch((error: Error) => console.error(error.message));
		sp.web
			.currentUser()
			.then((response) => setCurrentUser(response))
			.then(() => console.log(currentUser))
			.catch((error: Error) => console.error(error.message));
	}, []);

	const getAttachedFile = async (item: IRequest): Promise<IAttachmentInfo> => {
		const attachedFile: IAttachmentInfo = await item.attachmentFiles.getByName('file.txt')();
		return attachedFile;
	};

	const handleMoreClick = (request: IRequest): void => {
		setOpen(true);
		setRequestDetail(request);
	};

	const handleCancel = (): void => {
		setOpen(false);
	};

	return (
		<div className={styles.requests}>
			<Drawer open={open} anchor='right' onClose={() => setOpen(false)}>
				<RequestDetail sp={sp} requestDetail={requestDetail} handleCancel={handleCancel} />
			</Drawer>
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
								<button>
									<Icon iconName='MoreVertical' onClick={() => handleMoreClick(request)} />
								</button>
							</td>
						</tr>
					))}
				</table>
			) : (
				<div>There are no request for you</div>
			)}
		</div>
	);
};

export default Requests;
