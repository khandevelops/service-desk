import * as React from 'react';
import { MouseEvent } from 'react';
import styles from './NewRequest.module.scss';
import { IRequest } from './INewRequestProps';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ASSIGN, CATEGORY, PRIORITY } from '../../common/constants';
import { IItemAddResult } from '@pnp/sp/items';
import { SPFI } from '@pnp/sp';
import { Icon } from 'office-ui-fabric-react';

const NewRequest = ({
	sp,
	closeNewRequestDrawer
}: {
	sp: SPFI;
	closeNewRequestDrawer: (event: MouseEvent<HTMLElement>) => void;
}): JSX.Element => {
	const [subCategory, setSubCategory] = useState<string[]>([]);
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
			Priority: 'NORMAL',
			Assign: null,
			Description: null
		}
	});

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
				<div className={styles.selectContainer}>
					<label>Category</label>
					<div className={styles.select}>
						<select {...register('Category', { required: true })} name='Category' required>
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
							{PRIORITY.map((priority, index) => (
								<option key={index} value={priority} selected={priority === 'NORMAL'}>
									{priority}
								</option>
							))}
						</select>
						<Icon iconName='ChevronDownMed' className={styles.icon} />
					</div>
				</div>
				<div className={styles.selectContainer}>
					<label>Assign</label>
					<div className={styles.select}>
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
						<Icon iconName='ChevronDownMed' className={styles.icon} />
					</div>
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
				<button type='submit' disabled={isValid}>
					Submit
				</button>
				<button onClick={(event: MouseEvent<HTMLElement>) => closeNewRequestDrawer(event)}>Cancel</button>
			</div>
		</form>
	);
};

export default NewRequest;
