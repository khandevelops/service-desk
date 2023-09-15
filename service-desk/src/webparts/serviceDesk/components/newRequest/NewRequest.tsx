import * as React from 'react';
import { MouseEvent } from 'react';
import styles from './NewRequest.module.scss';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CATEGORY, PRIORITY, STATUS } from '../../common/constants';
import { IItemAddResult } from '@pnp/sp/items';
import { SPFI } from '@pnp/sp';
import { Icon } from 'office-ui-fabric-react';
import { IRequest } from '../IServiceDesk';

const NewRequest = ({
	sp,
	closeNewRequestDrawer
}: {
	sp: SPFI;
	closeNewRequestDrawer: (event: MouseEvent<HTMLElement>) => void;
}): JSX.Element => {
	const [subCategory, setSubCategory] = useState<string[]>([]);
	const [departments, setDepartments] = useState<{ Title: string }[]>([]);
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { isValid }
	} = useForm<IRequest>({
		defaultValues: {
			Category: null,
			SubCategory: null,
			Priority: PRIORITY.NORMAL,
			AssignedTo: null,
			Description: null,
			SubmittedBy: null,
			AttachedFiles: null
		}
	});

	const watchCategory = watch('Category');

	const onSubmit: SubmitHandler<IRequest> = (addRequestRequest: IRequest, event: MouseEvent<HTMLElement>) => {
		sp.web.lists
			.getByTitle('Requests')
			.items.add({
				HBN: addRequestRequest.HBN,
				HSN: addRequestRequest.HSN,
				Category: addRequestRequest.Category,
				SubCategory: addRequestRequest.SubCategory,
				Priority: addRequestRequest.Priority,
				AssignedTo: addRequestRequest.AssignedTo,
				Description: addRequestRequest.Description,
				SubmittedBy: addRequestRequest.SubmittedBy,
				Status: STATUS.PENDING,
				CreatedTime: new Date()
			})
			.then((addRequestResponse: IItemAddResult) => {
				if (addRequestRequest.AttachedFiles && addRequestRequest.AttachedFiles.length > 0) {
					addRequestRequest.AttachedFiles[0]
						.arrayBuffer()
						.then((buffer) => {
							sp.web.lists
								.getByTitle('Requests')
								.items.getById(addRequestResponse.data.Id)
								.attachmentFiles.add(addRequestRequest.AttachedFiles[0].name, buffer)
								.then(() => reset())
								.catch((error: Error) => console.error(error.message));
						})
						.catch((error: Error) => console.error(error.message));
				}
			})
			.then(() => closeNewRequestDrawer(event))
			.catch((error: Error) => console.error(error.message));
	};

	useEffect(() => {
		sp.web.lists
			.getByTitle('Departments')
			.items()
			.then((response) => {
				setDepartments(
					response.map((item) => ({
						Title: item.Title
					}))
				);
			})
			.catch((error: Error) => console.error(error.message));
		sp.web
			.currentUser()
			.then((currentUser) => setValue('SubmittedBy', currentUser.Title))
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
		<form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
			<div className={styles.formGroup}>
				<div className={styles.textInput}>
					<label>HBN</label>
					<input {...register('HBN', { required: true })} name='HBN' />
				</div>
				<div className={styles.textInput}>
					<label>HBN</label>
					<input {...register('HSN', { required: true })} name='HSN' />
				</div>
				<div className={styles.selectContainer}>
					<label>Category</label>
					<div className={styles.select}>
						<select {...register('Category', { required: true })} name='Category'>
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
						<Icon iconName='ChevronDownMed' className={styles.icon} />
					</div>
				</div>
				<div className={styles.selectContainer}>
					<label>Sub Category</label>
					<div className={styles.select}>
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
						<Icon iconName='ChevronDownMed' className={styles.icon} />
					</div>
				</div>
				<div className={styles.selectContainer}>
					<label>Priority</label>
					<div className={styles.select}>
						<select {...register('Priority')} name='Priority'>
							{Object.keys(PRIORITY).map((priorityKey: keyof typeof PRIORITY, index: number) => (
								<option key={index} value={PRIORITY[priorityKey]}>
									{PRIORITY[priorityKey]}
								</option>
							))}
						</select>
						<Icon iconName='ChevronDownMed' className={styles.icon} />
					</div>
				</div>
				<div className={styles.selectContainer}>
					<label>Assign To</label>
					<div className={styles.select}>
						<select {...register('AssignedTo')} name='AssignedTo'>
							{departments.length > 0 &&
								departments.map((assignTo: { Title: string }, index: number) => (
									<option key={index} value={assignTo.Title}>
										{assignTo.Title}
									</option>
								))}
						</select>
						<Icon iconName='ChevronDownMed' className={styles.icon} />
					</div>
				</div>
				<div className={styles.fileInput}>
					<label>Attachment</label>
					<input type='file' name='file' {...register('AttachedFiles')} />
				</div>
				<div className={styles.textArea}>
					<label>Description</label>
					<textarea rows={5} {...register('Description')} name='Description' />
				</div>
			</div>

			<div className={styles.buttonGroup}>
				<button type='submit' disabled={!isValid}>
					Submit
				</button>
				{isValid}
				<button onClick={(event: MouseEvent<HTMLElement>) => closeNewRequestDrawer(event)}>Cancel</button>
			</div>
		</form>
	);
};

export default NewRequest;
