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
import {
	Drawer,
	Table,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableBody,
	Paper,
	styled,
	tableCellClasses
} from '@mui/material';
import { ISiteUserInfo } from '@pnp/sp/site-users/types';
import RequestDetail from './requestDetail/RequestDetail';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { mockTable } from '../mock/mockTable';
import { IRequest } from './IServiceDesk';
import { PAGINATION } from '../common/constants';
import { inRange } from 'lodash';
SPComponentLoader.loadCss('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

const Pagination = ({
	Page,
	TotalRequest,
	setPage,
	sp
}: {
	Page: number;
	TotalRequest: number;
	setPage: (page: number) => void;
	sp: SPFI;
}): JSX.Element => {
	const [numberOfRequests, setTotalRequest] = useState<number>(10);
	const [pageDetail, setPageDetail] = useState<{
		FirstCurrentPageRequest: number;
		LastCurrentPageRequest: number;
		FirstPage: boolean;
		LastPage: boolean;
	}>({
		FirstCurrentPageRequest: 0,
		LastCurrentPageRequest: 0,
		FirstPage: true,
		LastPage: true
	});

	useEffect(() => {
		setPageDetail({
			FirstCurrentPageRequest: 1,
			LastCurrentPageRequest: TotalRequest < 16 ? TotalRequest : 15,
			FirstPage: true,
			LastPage: TotalRequest < 16 ? true : false
		});
	}, [TotalRequest]);

	const { FirstCurrentPageRequest, LastCurrentPageRequest, FirstPage, LastPage } = pageDetail;

	const changePage = (event: MouseEvent<HTMLElement>, pageAction: string): void => {
		event.preventDefault();
		// if (FirstPage) {
		// 	setPaginationDisabled({ ...paginationDisabled, FIRST_PAGE: true, LAST_PAGE: true });
		// }
		if (pageAction === PAGINATION.PREVIOUS_PAGE) {
			if (!FirstPage) {
				setPage(Page - 1);
				setPageDetail({
					...pageDetail,
					FirstCurrentPageRequest: Page - 1 === 1 ? 1 : (Page - 1) * 15 - 14,
					LastCurrentPageRequest:
						Page - 1 === Math.ceil(TotalRequest / 15) ? Page * 15 + (TotalRequest % 15) : Page * 15 - 15,
					FirstPage: Page - 1 === 1,
					LastPage: Page - 1 === Math.ceil(TotalRequest / 15)
				});
			}
		}
		if (pageAction === PAGINATION.NEXT_PAGE) {
			if (!LastPage) {
				setPage(Page + 1);
				setPageDetail({
					...pageDetail,
					FirstCurrentPageRequest: Page * 15 + 1,
					LastCurrentPageRequest:
						Page + 1 === Math.ceil(TotalRequest / 15) ? Page * 15 + (TotalRequest % 15) : Page * 15 + 15,
					FirstPage: false,
					LastPage: Page + 1 === Math.ceil(TotalRequest / 15)
				});
			}
		}
	};

	return (
		<div className={styles.pagination}>
			<div>{TotalRequest}</div>
			<div>
				<input
					type='number'
					onChange={(event: ChangeEvent<HTMLInputElement>) => setTotalRequest(parseInt(event.target.value))}
				/>
				<button
					onClick={(event: MouseEvent<HTMLElement>) => {
						event.preventDefault();
						mockTable(numberOfRequests, sp, 'Requests');
					}}>
					Submit
				</button>
			</div>
			<div>{FirstCurrentPageRequest + ' - ' + LastCurrentPageRequest + ' of ' + TotalRequest}</div>
			<button onClick={(event: MouseEvent<HTMLElement>) => changePage(event, PAGINATION.FIRST_PAGE)}>
				<Icon className={styles.paginationIcon} iconName='ChevronLeftEnd6' />
			</button>
			<button onClick={(event: MouseEvent<HTMLElement>) => changePage(event, PAGINATION.PREVIOUS_PAGE)}>
				<Icon className={styles.paginationIcon} iconName='ChevronLeftSmall' />
			</button>
			<div className={styles.pageNumber}>{Page}</div>
			<button onClick={(event: MouseEvent<HTMLElement>) => changePage(event, PAGINATION.NEXT_PAGE)}>
				<Icon className={styles.paginationIcon} iconName='ChevronRightSmall' />
			</button>
			<button onClick={(event: MouseEvent<HTMLElement>) => changePage(event, PAGINATION.LAST_PAGE)}>
				<Icon className={styles.paginationIcon} iconName='ChevronRightEnd6' />
			</button>
		</div>
	);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: '#ffd740',
		fontFamily: 'Montserrat, "Montserrat", sans-serif',
		fontSize: 14,
		fontWeight: 700,
		color: theme.palette.common.black
	},
	[`&.${tableCellClasses.body}`]: {
		fontFamily: 'Montserrat, "Montserrat", sans-serif',
		fontSize: 13
	}
}));

const RequestTableRow = ({ request, sp }: { request: IRequest; sp: SPFI }): JSX.Element => {
	const [requestDetailDrawer, setRequestDetailDrawer] = useState<boolean>(false);
	const [attachedFiles, setAttachedFiles] = useState<IAttachmentInfo[]>([]);

	useEffect(() => {
		if (request.Attachments) {
			sp.web.lists
				.getByTitle('Requests')
				.items.getById(request.Id)
				.attachmentFiles()
				.then((response) => {
					setAttachedFiles(response);
				})
				.catch((error: Error) => console.error(error.message));
		}
	}, []);

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
			<TableRow>
				<StyledTableCell align='right' width={200}>
					{request.HBN}
				</StyledTableCell>
				<StyledTableCell align='right' width={200}>
					{request.HSN}
				</StyledTableCell>
				<StyledTableCell align='right' width={200}>
					{request.Category}
				</StyledTableCell>
				<StyledTableCell align='right' width={240}>
					{request.SubCategory}
				</StyledTableCell>
				<StyledTableCell align='right' width={400}>
					{request.Description}
				</StyledTableCell>
				<StyledTableCell align='right' width={80}>
					{request.Priority}
				</StyledTableCell>
				<StyledTableCell align='right' width={120}>
					{request.AssignedTo}
				</StyledTableCell>
				<StyledTableCell align='right' width={120}>
					{request.SubmittedBy}
				</StyledTableCell>
				<StyledTableCell align='right' width={160}>
					{request.CreatedTime}
				</StyledTableCell>
				<StyledTableCell align='right' width={120}>
					{request.Status}
				</StyledTableCell>
				<StyledTableCell align='right' width={100}>
					{request.CompletedBy}
				</StyledTableCell>
				<StyledTableCell align='right' width={160}>
					{request.CompletedTime}
				</StyledTableCell>
				<StyledTableCell align='right' width={240}>
					{request.Attachments && attachedFiles.length > 0 && (
						<a
							href={`https://usdtl.sharepoint.com/${attachedFiles[0].ServerRelativeUrl}`}
							target='_blank'
							rel='noreferrer'>
							{attachedFiles[0].FileName.length > 50
								? attachedFiles[0].FileName.slice(0, 50) + '...'
								: attachedFiles[0].FileName}
						</a>
					)}
				</StyledTableCell>
				<StyledTableCell align='right'>{request.Comment}</StyledTableCell>
				<StyledTableCell
					align='center'
					width={50}
					sx={{ textAlign: 'center', cursor: 'pointer' }}
					onClick={openRequestDetailDrawer}>
					<div>
						<i className='fa fa-ellipsis-v' aria-hidden='true' />
					</div>
				</StyledTableCell>
			</TableRow>
		</Fragment>
	);
};

const ServiceDesk = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [newRequestDrawer, setNewRequestDrawer] = useState<boolean>(false);
	const [requests, setRequests] = useState<IRequest[]>([]);
	const [currentUser, setCurrentUser] = useState<ISiteUserInfo | null>(null);
	const [page, setPage] = useState<number>(0);
	const [totalRequest, setTotalRequests] = useState<number>(0);

	useEffect(() => {
		sp.web.lists
			.getByTitle('Requests')
			.items.top(5000)()
			.then((response: IRequest[]) => {
				setPage(1);
				setTotalRequests(response.length);
				setRequests(response);
			})
			.catch((error: Error) => console.error(error.message));

		sp.web
			.currentUser()
			.then((response) => {
				setCurrentUser(response);
				return currentUser;
			})
			.catch((error: Error) => console.error(error.message));
	}, []);

	const openNewRequestDrawer = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		setNewRequestDrawer(true);
	};

	const closeNewRequestDrawer = (event: MouseEvent<HTMLElement>): void => {
		event.preventDefault();
		setNewRequestDrawer(false);
	};

	const searchRequests = (event: ChangeEvent<HTMLInputElement>): void => {
		sp.web.lists
			.getByTitle('Requests')
			.items.top(5000)()
			.then((response: IRequest[]) => {
				const keyword = event.target.value;
				const keys = response[0] && Object.keys(response[0]);
				const filteredRequests: IRequest[] = response.filter((request) =>
					keys.some(
						(key: keyof IRequest) => String(request[key]).toLowerCase().indexOf(keyword.toLowerCase()) > -1
					)
				);
				setPage(1);
				setTotalRequests(filteredRequests.length);
				setRequests(filteredRequests);
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
					<input onChange={searchRequests} />
				</div>
				<div style={{ color: 'red' }}>TESTING IN PROGRESS!!!</div>
				<button type='button' onClick={openNewRequestDrawer}>
					NEW REQUEST
				</button>
			</div>
			<div className={styles.bodyContainer}>
				<div className={styles.requests}>
					{requests.length > 0 ? (
						<TableContainer component={Paper}>
							<Table stickyHeader size='small'>
								<TableHead>
									<TableRow sx={{ height: 45 }}>
										<StyledTableCell align='right'>HBN</StyledTableCell>
										<StyledTableCell align='right'>HSN</StyledTableCell>
										<StyledTableCell align='right'>Category</StyledTableCell>
										<StyledTableCell align='right'>Sub Category</StyledTableCell>
										<StyledTableCell align='right'>Description</StyledTableCell>
										<StyledTableCell align='right'>Priority</StyledTableCell>
										<StyledTableCell align='right'>Assigned To</StyledTableCell>
										<StyledTableCell align='right'>Submitted By</StyledTableCell>
										<StyledTableCell align='right'>Created Time</StyledTableCell>
										<StyledTableCell align='right'>Status</StyledTableCell>
										<StyledTableCell align='right'>Completed By</StyledTableCell>
										<StyledTableCell align='right'>Completed Time</StyledTableCell>
										<StyledTableCell align='right'>Attachment</StyledTableCell>
										<StyledTableCell align='right'>Comment</StyledTableCell>
										<StyledTableCell align='center'>More</StyledTableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{requests
										.sort((requestA, requestB) => requestB.Id - requestA.Id)
										.filter((request, index) => inRange(index, page - 1, page - 1 + 15))
										.map((request, index) => (
											<RequestTableRow key={index} request={request} sp={sp} />
										))}
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<div>There are no request for you</div>
					)}
				</div>
				{requests.length > 0 && (
					<Pagination Page={page} TotalRequest={totalRequest} setPage={setPage} sp={sp} />
				)}
			</div>
		</div>
	);
};

export default ServiceDesk;
