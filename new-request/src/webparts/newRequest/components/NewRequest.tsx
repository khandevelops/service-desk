import * as React from 'react';
import styles from './NewRequest.module.scss';
import { IRequest } from './INewRequestProps';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';
import { useEffect, useState } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ASSIGN_TO, CATEGORY, PRIORITY } from '../constants';
import { IItemAddResult } from '@pnp/sp/items';
// import { IItem } from '@pnp/sp/items';

// import * as moment from 'moment';

const NewRequest = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [subCategory, setSubCategory] = useState<string[]>([]);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm<IRequest>();
	const watchCategory = watch('Category');

	const onSubmit: SubmitHandler<IRequest> = (addRequestRequest: IRequest) => {
		sp.web.lists
			.getByTitle('Requests')
			.items.add({
				Subject: addRequestRequest.Subject,
				Priority: addRequestRequest.Priority,
				Category: addRequestRequest.Category,
				SubCategory: addRequestRequest.SubCategory,
				AssignTo: addRequestRequest.AssignTo,
				DueDate: addRequestRequest.DueDate,
				Description: addRequestRequest.Description,
				RequesterEmail: addRequestRequest.RequesterEmail
			})
			.then((addRequestResponse: IItemAddResult) => {
				addRequestRequest.Attached[0]
					.arrayBuffer()
					.then((buffer) => {
						sp.web.lists
							.getByTitle('Requests')
							.items.getById(addRequestResponse.data.Id)
							.attachmentFiles.add(addRequestRequest.Attached[0].name, buffer)
							.then()
							.catch((error: Error) => console.error(error.message));
					})
					.catch((error: Error) => console.error(error.message));
			})
			.catch((error: Error) => console.error(error.message));
	};

	useEffect(() => {
		sp.web
			.currentUser()
			.then((currentUser) => setValue('RequesterEmail', currentUser.Email))
			.catch((error: Error) => console.error(error.message));
		const subscription = watch((value) => {
			setSubCategory(
				CATEGORY.filter((category) => category.CATEGORY === value.Category).length > 0 &&
					CATEGORY.filter((category) => category.CATEGORY === value.Category)[0].SUBCATEGORY
			);
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	return (
		<div className={styles.newRequestContainer}>
			<form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.formGroup}>
					<div className={styles.inputContainer}>
						<label>Subject</label>
						<input {...register('Subject', { required: true })} name='Subject' />
						{errors.Subject && <span className={styles.errorMessage}>This field is required</span>}
					</div>
					<div className={styles.inputContainer}>
						<label>Priority</label>
						<div className={styles.select}>
							<select {...register('Priority')} name='Priority'>
								{PRIORITY.map((priority, index) => (
									<option key={index} value={priority} selected={priority === 'HIGH' ? false : true}>
										{priority}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className={styles.inputContainer}>
						<label>Category</label>
						<select {...register('Category')} name='Category'>
							<option value='null' selected disabled>
								Select Category
							</option>
							{CATEGORY.map((category: { CATEGORY: string; SUBCATEGORY: string[] }, index: number) => (
								<option key={index} value={category.CATEGORY}>
									{category.CATEGORY}
								</option>
							))}
						</select>
					</div>
					<div className={styles.inputContainer}>
						<label>Sub Category</label>
						<select {...register('SubCategory')} name='SubCategory' disabled={subCategory.length === 0}>
							<option value='null' selected disabled>
								{subCategory.length === 0 ? '' : 'Select Sub Category'}
							</option>
							{watchCategory &&
								subCategory.length > 0 &&
								subCategory.map((category: string, index: number) => (
									<option key={index} value={category}>
										{category}
									</option>
								))}
						</select>
					</div>
					<div className={styles.inputContainer}>
						<label>Assign To</label>
						<select {...register('AssignTo')} name='AssignTo'>
							<option value='null' selected disabled>
								Assign
							</option>
							{ASSIGN_TO.map((assignTo: string, index: number) => (
								<option key={index} value={assignTo}>
									{assignTo}
								</option>
							))}
						</select>
					</div>
					<div className={styles.inputContainer}>
						<label>Due Date</label>
						<input type='datetime-local' id='due-date' name='DueDate' {...register('AssignTo')} />
					</div>
				</div>
				<div className={styles.inputContainer}>
					<label>Description</label>
					<textarea rows={6} {...register('Description')} name='Description' />
				</div>
				<div>
					<input type='file' name='file' {...register('Attached')} />
				</div>
				<div className={styles.buttonGroup}>
					<button className={styles.button} type='submit'>
						Submit
					</button>
					<button className={styles.button}>Clear</button>
				</div>
			</form>
		</div>
	);
};

export default NewRequest;
