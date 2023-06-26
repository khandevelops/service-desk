import * as React from 'react';
import styles from './Requests.module.scss';
import { IRequest } from './IRequest';
import { useEffect, useState } from 'react';
import { SPFI } from '@pnp/sp';

const Requests = ({ sp }: { sp: SPFI }): JSX.Element => {
	const [requests, setRequests] = useState<IRequest[]>([]);
	// const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);

	useEffect(() => {
		sp.web.lists
			.getByTitle('Requests')
			.items()
			.then((response) => setRequests(response))
			.catch((error: Error) => console.error(error.message));
		// sp.web
		// 	.currentUser()
		// 	.then((response) => setCurrentUser(response))
		// 	.catch((error: Error) => console.error(error.message));
	}, []);

	return (
		<div className={styles.requests}>
			{requests.length > 0 ? (
				<table>
					<tr>
						<th>Subject</th>
						<th>Priority</th>
						<th>Category</th>
						<th>Sub Category</th>
						<th>Assigned To</th>
						<th>Description</th>
						<th>Submitted By</th>
						<th>Created Time</th>
						<th>Completed By</th>
						<th>Completed Time</th>
						<th>Attachment</th>
					</tr>
					{requests.map((request, index) => (
						<tr key={index}>
							<td>{request.Subject}</td>
							<td>{request.Priority}</td>
							<td>{request.Category}</td>
							<td>{request.SubCategory}</td>
							<td>{request.AssignTo}</td>
							<td>{request.Description}</td>
							<td>{request.CreatedBy}</td>
							<td>{request.CreatedOn}</td>
							<td>{request.CompletedBy}</td>
							<td>{request.CompletedTime}</td>
							<td>{request.Attachment}</td>
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
