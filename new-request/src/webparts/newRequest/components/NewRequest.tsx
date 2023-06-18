import * as React from 'react';
import styles from './NewRequest.module.scss';
import { IRequest } from './INewRequestProps';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import '@pnp/sp/attachments';
import { useEffect } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ASSIGN_TO, CATEGORY, PRIORITY } from '../constants';
import { IItem } from '@pnp/sp/items';

// import * as moment from 'moment';

const NewRequest = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));
	const [subCategory, setSubCategory] = React.useState<string[]>([]);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch
	} = useForm<IRequest>();

	const onSubmit: SubmitHandler<IRequest> = (data) => {
		sp.web.lists
			.getByTitle('Requests')
			.items.add({ ...data })
			.then((response) => {
				const item: IItem = sp.web.lists.getByTitle('MyList').items.getById(response.data.Id);
				item.attachmentFiles
					.add('file2.txt', 'Here is my content')
					.then((response) => console.log(response))
					.catch((error: Error) => console.error(error.message));
			})
			.catch((error: Error) => console.error(error.message));
	};

	useEffect(() => {
		sp.web
			.currentUser()
			.then((currentUser) => setValue('RequesterEmail', currentUser.Email))
			.then(() => {
				const subscription = watch((value) => {
					setSubCategory(CATEGORY.filter((category) => category.CATEGORY === value.Category)[0].SUBCATEGORY);
				});
				return () => subscription.unsubscribe();
			})
			.catch((error: Error) => console.error(error.message));
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
							{subCategory.map((category: string, index: number) => (
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
