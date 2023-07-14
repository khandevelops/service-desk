import * as React from 'react';
import styles from './NewRequest.module.scss';
import { IRequest } from './INewRequestProps';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ASSIGN, CATEGORY, PRIORITY } from '../../common/constants';
import { IItemAddResult } from '@pnp/sp/items';
import { SPFI } from '@pnp/sp';

const NewRequest = ({ sp }: { sp: SPFI }): JSX.Element => {
	const [subCategory, setSubCategory] = useState<string[]>([]);
	const { register, handleSubmit, setValue, watch, reset } = useForm<IRequest>();

	const watchCategory = watch('Category');

	const onSubmit: SubmitHandler<IRequest> = (addRequestRequest: IRequest) => {
		sp.web.lists
			.getByTitle('Requests')
			.items.add({
				Priority: addRequestRequest.Priority,
				Category: addRequestRequest.Category,
				SubCategory: addRequestRequest.SubCategory,
				Assign: addRequestRequest.Assign,
				DueDate: addRequestRequest.DueDate,
				Description: addRequestRequest.Description,
				RequesterEmail: addRequestRequest.RequesterEmail
			})
			.then((addRequestResponse: IItemAddResult) => {
				if (addRequestRequest.Attached.length > 0) {
					addRequestRequest.Attached[0]
						.arrayBuffer()
						.then((buffer) => {
							sp.web.lists
								.getByTitle('Requests')
								.items.getById(addRequestResponse.data.Id)
								.attachmentFiles.add(addRequestRequest.Attached[0].name, buffer)
								.then(() => reset())
								.catch((error: Error) => console.error(error.message));
						})
						.catch((error: Error) => console.error(error.message));
				} else {
					reset();
				}
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
				CATEGORY.filter((category) => category.CATEGORY === value.Category).length > 0
					? CATEGORY.filter((category) => category.CATEGORY === value.Category)[0].SUBCATEGORY
					: []
			);
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	return (
		<form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.inputContainer}>
				<div className={styles.select}>
					<label>Category</label>
					<select {...register('Category')} name='Category'>
						{CATEGORY.map((category: { CATEGORY: string; SUBCATEGORY: string[] }, index: number) => (
							<option
								key={index}
								value={category.CATEGORY}
								hidden={category.CATEGORY === 'Select Category'}
								selected={category.CATEGORY === 'Select Category'}>
								{category.CATEGORY}
							</option>
						))}
					</select>
				</div>
				<div className={styles.select}>
					<label>Sub Category</label>
					<select {...register('SubCategory')} name='SubCategory' disabled={subCategory.length === 0}>
						{watchCategory &&
							subCategory.length > 0 &&
							subCategory.map((subCategory: string, index: number) => (
								<option
									key={index}
									value={subCategory}
									hidden={subCategory === 'Select Sub Category'}
									selected={subCategory === 'Select Sub Category'}>
									{subCategory}
								</option>
							))}
					</select>
				</div>
				<div className={styles.select}>
					<label>Priority</label>
					<select {...register('Priority')} name='Priority'>
						{PRIORITY.map((priority, index) => (
							<option key={index} value={priority} selected={priority === 'NORMAL'}>
								{priority}
							</option>
						))}
					</select>
				</div>
				<div className={styles.select}>
					<label>Assign</label>
					<select {...register('Assign')} name='AssignTo'>
						{ASSIGN.map((assignTo: string, index: number) => (
							<option
								key={index}
								value={assignTo}
								hidden={assignTo === 'Assign to'}
								selected={assignTo === 'Assign to'}>
								{assignTo}
							</option>
						))}
					</select>
				</div>
				<div className={styles.fileInput}>
					<label>Attachment</label>
					<input type='file' name='file' {...register('Attached')} />
				</div>
				<div className={styles.textArea}>
					<label>Description</label>
					<textarea rows={5} {...register('Description')} name='Description' />
				</div>
			</div>

			<div className={styles.buttonGroup}>
				<button type='submit'>Submit</button>
				<button>Cancel</button>
			</div>
		</form>
	);
};

export default NewRequest;
