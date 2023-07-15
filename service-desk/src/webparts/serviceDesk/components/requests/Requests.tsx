import * as React from 'react';
import { Fragment, MouseEvent } from 'react';
import styles from './Requests.module.scss';
import { useEffect, useState } from 'react';
import { SPFI } from '@pnp/sp';
import { IAttachmentInfo } from '@pnp/sp/attachments';
import { Drawer } from '@mui/material';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import RequestDetail from '../requestDetail/RequestDetail';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { IRequest } from '../IServiceDeskProps';

const TableBody = ({ request, sp }: { request: IRequest; sp: SPFI }): JSX.Element => {
	const [requestDetailDrawer, setRequestDetailDrawer] = useState<boolean>(false);

	const getAttachedFile = async (item: IRequest): Promise<IAttachmentInfo> => {
		const attachedFile: IAttachmentInfo = await item.attachmentFiles.getByName('file.txt')();
		return attachedFile;
	};

	const closeRequestDetailDrawer = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		setRequestDetailDrawer(false);
	};

	const openRequestDetailDrawer = (): void => {
		setRequestDetailDrawer(true);
	};

	return (
		<Fragment>
			<Drawer open={requestDetailDrawer} anchor='right'>
				<RequestDetail sp={sp} request={request} closeRequestDetailDrawer={closeRequestDetailDrawer} />
			</Drawer>
			<tr>
				<td>{request.Category}</td>
				<td>{request.SubCategory}</td>
				<td>{request.Description}</td>
				<td>{request.Priority}</td>
				<td>{request.AssignedTo}</td>
				<td>{request.SubmittedBy}</td>
				<td>{request.CreatedTime}</td>
				<td>{request.CompletedBy}</td>
				<td>{request.CompletedTime}</td>
				<td>{request.Attachment && getAttachedFile(request)}</td>
				<td className={styles.more} onClick={openRequestDetailDrawer}>
					<i className='fa fa-ellipsis-v' aria-hidden='true' />
				</td>
			</tr>
		</Fragment>
	);
};

const Requests = ({ sp, keyword }: { sp: SPFI; keyword: string }): JSX.Element => {
	// const [requests, setRequests] = useState<IRequest[]>([]);
	const [pagedRequests, setPagesRequests] = useState<IRequest[]>([]);
	// const [pagedRequests, setPagedRequests] = useState<{ hasNext: boolean; results: IRequest[] }>({
	// 	hasNext: false,
	// 	results: []
	// });
	const [currentUser, setCurrentUser] = useState<ISiteUserInfo | null>(null);
	const [totalPage, setTotalPage] = useState<number>(0);
	const [page, setPage] = useState<number>(0);

	useEffect(() => {
		if (keyword) {
			sp.web.lists
				.getByTitle('Requests')
				.items.top((page + 1) * 100)()
				.then((response) => {
					setTotalPage(response.length);
					setPagesRequests(response.splice(page * 100, response.length - 1));
				})
				.catch((error: Error) => console.error(error.message));
		} else {
			sp.web.lists
				.getByTitle('Requests')
				.items.filter('Category eq' + keyword)
				.top((page + 1) * 100)()
				.then((response) => {
					setTotalPage(response.length);
					setPagesRequests(response.splice(page * 100, response.length - 1));
				})
				.catch((error: Error) => console.error(error.message));
		}

		sp.web
			.currentUser()
			.then((response) => setCurrentUser(response))
			.then(() => console.log(currentUser))
			.catch((error: Error) => console.error(error.message));
	}, []);

	const changePage = (): void => {
		setPage(1);
	};

	return (
		<div className={styles.container}>
			<div className={styles.requests}>
				{pagedRequests.length > 0 ? (
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
							<th className={styles.iconHeader}>More</th>
						</tr>
						{pagedRequests.map((request, index) => (
							<TableBody key={index} request={request} sp={sp} />
						))}
					</table>
				) : (
					<div>There are no request for you</div>
				)}
			</div>
			<div className={styles.pagination}>
				<div>{page + 1 + ' - ' + (page + 99) + ' of ' + totalPage}</div>
				<Icon iconName='ChevronLeftEnd6' />
				<Icon iconName='ChevronLeftSmall' onClick={changePage} />
				<div className={page + ' ' + styles.pageNumber}>{page + 1}</div>
				<Icon iconName='ChevronRightSmall' />
				<Icon iconName='ChevronRightEnd6' />
			</div>
		</div>
	);
};

export default Requests;
