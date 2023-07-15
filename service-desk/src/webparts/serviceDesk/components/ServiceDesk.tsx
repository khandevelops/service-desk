// Todo: need to implement server side rendering for pagination and filtering

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
// import { mockTable } from '../mock/mockTable';
import { IRequest } from './IServiceDesk';
import { pagination } from '../common/constants';
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
	// const [numberOfRequests, setNumberOfRequests] = useState<number>(200);

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
			.items.top(5000)()
			.then((response) => {
				setTotalPage(response.length);
				console.log(response);
				setRequests(response.sort((requestA, requestB) => requestA.Id - requestB.Id).splice(page * 15, 15));
			})
			.catch((error: Error) => console.error(error.message));

		sp.web
			.currentUser()
			.then((response) => setCurrentUser(response))
			.then(() => console.log(currentUser))
			.catch((error: Error) => console.error(error.message));
	}, [page]);

	const changePage = (event: MouseEvent<HTMLElement>, pageAction: string): void => {
		event.preventDefault();
		if (pageAction === pagination.PREVIOUS_PAGE) {
			if (page - 1 > -1) {
				setPage(page - 1);
			}
		} else if (pageAction === pagination.NEXT_PAGE) {
			if (totalPage > (page + 1) * 15 - 30) {
				setPage(page + 1);
			}
		}
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
		sp.web.lists
			.getByTitle('Requests')
			.items.top(5000)()
			.then((requests) => {
				setTotalPage(requests.length);
				const keyword = event.target.value;
				const keys = requests[0] && Object.keys(requests[0]);
				setRequests(
					requests.filter((request) =>
						keys.some(
							(key: keyof IRequest) =>
								String(request[key]).toLowerCase().indexOf(keyword.toLowerCase()) > -1
						)
					)
				);
			})
			.catch((error: Error) => console.error(error.message));
	};

	return (
		<div className={styles.container}>
			<Drawer open={newRequestDrawer} anchor='right'>
				<NewRequest sp={sp} closeNewRequestDrawer={closeNewRequestDrawer} />
			</Drawer>
			<div className={styles.headerContainer}>
				<div className={styles.search}>
					<Icon iconName='Search' className={styles.icon} />
					<input type='search' onChange={searchTable} />
				</div>

				<button onClick={openNewRequestDrawer}>NEW REQUEST</button>
			</div>
			<div className={styles.bodyContainer}>
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
					{/* <div>
							<input
								type='number'
								onChange={(event: ChangeEvent<HTMLInputElement>) =>
									setNumberOfRequests(parseInt(event.target.value))
								}
							/>
							<button
								onClick={(event: MouseEvent<HTMLElement>) => {
									event.preventDefault();
									mockTable(numberOfRequests, sp, 'Requests');
								}}>
								Submit
							</button>
						</div> */}
					<div>
						{page * 15 +
							1 +
							' - ' +
							(totalPage - (page + 1) * 15 - 15 > -1 ? (page + 1) * 15 : totalPage) +
							' of ' +
							totalPage}{' '}
						page
					</div>
					<button
						onClick={(event: MouseEvent<HTMLElement>) => changePage(event, pagination.FIRST_PAGE)}
						disabled={false}>
						<Icon className={styles.paginationIcon} iconName='ChevronLeftEnd6' />
					</button>
					<button
						onClick={(event: MouseEvent<HTMLElement>) => changePage(event, pagination.PREVIOUS_PAGE)}
						disabled={false}>
						<Icon className={styles.paginationIcon} iconName='ChevronLeftSmall' />
					</button>
					<div className={page + ' ' + styles.pageNumber}>{page + 1}</div>
					<button
						onClick={(event: MouseEvent<HTMLElement>) => changePage(event, pagination.NEXT_PAGE)}
						disabled={false}>
						<Icon className={styles.paginationIcon} iconName='ChevronRightSmall' />
					</button>
					<button
						onClick={(event: MouseEvent<HTMLElement>) => changePage(event, pagination.LAST_PAGE)}
						disabled={false}>
						<Icon className={styles.paginationIcon} iconName='ChevronRightEnd6' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default ServiceDesk;
