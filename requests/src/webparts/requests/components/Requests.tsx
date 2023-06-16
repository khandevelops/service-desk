import * as React from 'react';
import styles from './Requests.module.scss';
import { ICurrentUser, IRequest } from './IRequestsProps';
import { useEffect, useState } from 'react';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import { WebPartContext } from '@microsoft/sp-webpart-base';

const Requests = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [requests, setRequests] = useState<IRequest[]>([]);
	const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);

	useEffect(() => {
		sp.web.lists
			.getByTitle('Requests')
			.items()
			.then((response) => setRequests(response))
			.catch((error: Error) => console.error(error.message));
		sp.web
			.currentUser()
			.then((currentUser) => setCurrentUser(currentUser))
			.catch((error: Error) => console.error(error.message));
	}, []);

	return (
		<div className={styles.requests}>
			{requests.some((request) => request.CreatedBy === currentUser.Title) ? (
				<table>
					<tr>
						<th>Subject</th>
						<th>Priority</th>
						<th>Category</th>
						<th>Sub Category</th>
						<th>Assign To</th>
						<th>Due Date</th>
						<th>Description</th>
					</tr>
					{requests
						.filter((request) => request.CreatedBy === currentUser.Title)
						.map((request, index) => (
							<tr key={index}>
								<td>{request.Subject}</td>
								<td>{request.Priority}</td>
								<td>{request.Category}</td>
								<td>{request.SubCategory}</td>
								<td>{request.AssignTo}</td>
								<td>{request.DueDate}</td>
								<td>{request.Description}</td>
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
