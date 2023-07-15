import * as React from 'react';
import { MouseEvent, ChangeEvent, Fragment, useEffect, useState } from 'react';
import styles from './ServiceDesk.module.scss';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import NewRequest from './newRequest/NewRequest';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';
import '@pnp/sp/search';
import '@pnp/sp/items/get-all';
import { IAttachmentInfo } from '@pnp/sp/attachments';
import { Drawer } from '@mui/material';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import RequestDetail from './requestDetail/RequestDetail';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { IRequest } from './IServiceDeskProps';
SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

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

const ServiceDesk = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [newRequestDrawer, setNewRequestDrawer] = useState<boolean>(false);
	// const [pagedRequests, setPagedRequests] = useState<IRequest[]>([]);
	const [requests, setRequests] = useState<IRequest[]>([]);
	// const [pagedRequests, setPagedRequests] = useState<{ hasNext: boolean; results: IRequest[] }>({
	// 	hasNext: false,
	// 	results: []
	// });
	const [currentUser, setCurrentUser] = useState<ISiteUserInfo | null>(null);
	const [totalPage, setTotalPage] = useState<number>(0);
	const [page, setPage] = useState<number>(0);

	useEffect(() => {
		sp.web.lists
			.getByTitle('Requests')
			.items()
			.then((response) => {
				console.log(response);
				setTotalPage(response.length);
				setRequests(response);
			})
			.catch((error: Error) => console.error(error.message));

		sp.web
			.currentUser()
			.then((response) => setCurrentUser(response))
			.then(() => console.log(currentUser))
			.catch((error: Error) => console.error(error.message));
	}, []);

	const changePage = (): void => {
		setPage(1);
	};

	const openNewRequestDrawer = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		setNewRequestDrawer(true);
	};

	const closeNewRequestDrawer = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		setNewRequestDrawer(false);
	};

	const searchTable = (event: ChangeEvent<HTMLInputElement>): void => {
		console.log(event.target);
		if (event.target.value) {
			sp.web.lists
				.getByTitle('Requests')
				.items.filter(
					`substringof('${event.target.value}', Category) or 
						substringof('${event.target.value}', SubCategory) or
						substringof('${event.target.value}', Description) or
						substringof('${event.target.value}', Priority) or
						substringof('${event.target.value}', Assign) or
						substringof('${event.target.value}', Comment) or
						substringof('${event.target.value}', SubCategory) or
						substringof('${event.target.value}', SubCategory) or
					`
				)()
				.then((response) => {
					setTotalPage(response.length);
					setRequests(response);
				})
				.catch((error: Error) => console.error(error.message));
		}
	};

	return (
		<div className={styles.container}>
			<Drawer open={newRequestDrawer} anchor='right'>
				<NewRequest sp={sp} closeNewRequestDrawer={closeNewRequestDrawer} />
			</Drawer>
			<div className={styles.headerContainer}>
				<div className={styles.search}>
					<Icon iconName='SearchArt64' className={styles.icon} />
					<input type='search' onChange={searchTable} />
				</div>

				<button onClick={openNewRequestDrawer}>NEW REQUEST</button>
			</div>
			<div className={styles.bodyContainer}>
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
									<th className={styles.iconHeader}>More</th>
								</tr>
								{requests.map((request, index) => (
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
			</div>
		</div>
	);
};

export default ServiceDesk;
