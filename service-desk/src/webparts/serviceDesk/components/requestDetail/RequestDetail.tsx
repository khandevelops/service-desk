import { SPFI } from '@pnp/sp';
import * as React from 'react';
import { IRequest } from '../requests/IRequest';
import styles from './RequestDetail.module.scss';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { useEffect } from 'react';

const RequestDetail = ({
	sp,
	requestDetail,
	handleCancel
}: {
	sp: SPFI;
	requestDetail: IRequest;
	handleCancel: { (): void };
}): JSX.Element => {
	const { register, handleSubmit } = useForm<IRequest>();

	const onSubmit: SubmitHandler<IRequest> = (request: IRequest) => {
		sp.web.lists
			.getByTitle('Requests')
			.items.getById(requestDetail.id)
			.update({
				...requestDetail,
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
				<button onClick={handleCancel}>Cancel</button>
			</div>
		</form>
	);
};

export default RequestDetail;
