import { SPFI } from '@pnp/sp';
import * as React from 'react';
import { MouseEvent, useEffect } from 'react';
import styles from './RequestDetail.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IRequest } from '../IServiceDeskProps';
// import { useEffect } from 'react';

const RequestDetail = ({
	sp,
	request,
	closeRequestDetailDrawer
}: {
	sp: SPFI;
	request: IRequest;
	closeRequestDetailDrawer: { (event: MouseEvent<HTMLElement>): void };
}): JSX.Element => {
	useEffect(() => {
		console.log(request);
	}, []);
	const { register, handleSubmit } = useForm<IRequest>();

	const onSubmit: SubmitHandler<IRequest> = (request: IRequest) => {
		sp.web.lists
			.getByTitle('Requests')
			.items.getById(request.id)
			.update({
				...request,
				Comment: request.Comment,
				Complete: true
			})
			.then()
			.catch((error: Error) => console.error(error.message));
	};
	return (
		<form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
			<div>
				<div className={styles.textArea}>
					<label>Comment</label>
					<textarea rows={5} {...register('Comment')} name='Comment' />
				</div>
			</div>
			<div className={styles.buttonGroup}>
				<button type='submit'>Complete</button>
				<button onClick={closeRequestDetailDrawer}>Cancel</button>
			</div>
		</form>
	);
};

export default RequestDetail;
