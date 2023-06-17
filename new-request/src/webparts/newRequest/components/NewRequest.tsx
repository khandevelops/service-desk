import * as React from 'react';
import styles from './NewRequest.module.scss';
import { IRequest } from './INewRequestProps';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/files';
import '@pnp/sp/folders';
import '@pnp/sp/lists/web';
import '@pnp/sp/attachments';
import '@pnp/sp/site-users/web';
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import { ASSIGN_TO, CATEGORY, PRIORITY } from '../constants';
import * as moment from 'moment';
import { WebPartContext } from '@microsoft/sp-webpart-base';

const NewRequest = ({ context }: { context: WebPartContext }): JSX.Element => {
	const sp: SPFI = spfi().using(SPFx(context));

	const [form, setForm] = useState<IRequest>({
		Subject: '',
		Priority: '',
		Category: '',
		SubCategory: '',
		AssignTo: '',
		DueDate: null,
		Description: '',
		RequesterEmail: ''
	});

	// const item: IItem = sp.web.lists.getByTitle("MyList").items.getById(1);

	// await item.attachmentFiles.add("file2.txt", "Here is my content");

	useEffect(() => {
		sp.web
			.currentUser()
			.then((currentUser) => setForm({ ...form, RequesterEmail: currentUser.Email }))
			.catch((error: Error) => console.error(error.message));
	}, []);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.name === 'Subject') {
			setForm({ ...form, Subject: event.target.value });
		}
		if (event.target.name === 'DueDate') {
			setForm({ ...form, DueDate: new Date(event.target.value) });
		}
	};

	const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
		setForm({ ...form, Description: event.target.value });
	};

	const handleSelect = (event: ChangeEvent<HTMLSelectElement>): void => {
		if (event.target.name === 'Priority') {
			setForm({ ...form, Subject: event.target.value });
		}
		if (event.target.name === 'Category') {
			setForm({ ...form, Category: event.target.value });
		}
		if (event.target.name === 'SubCategory') {
			setForm({ ...form, SubCategory: event.target.value });
		}
		if (event.target.name === 'AssignTo') {
			setForm({ ...form, AssignTo: event.target.value });
		}
	};

	const handleSubmit = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
		event.preventDefault();
		sp.web.lists
			.getByTitle('Requests')
			.items.add({ ...form })
			.then((response) => console.log(response))
			.catch((error: Error) => console.error(error.message));
	};

	return (
		<div className={styles.newRequestContainer}>
			<form className={styles.formContainer}>
				<div className={styles.formGroup}>
					<div className={styles.inputLabel}>
						<label>Subject</label>
						<input type='text' name='subject' onChange={handleInputChange} required />
					</div>
					<div className={styles.inputLabel}>
						<label>Priority</label>
						<select value='NORMAL' onChange={handleSelect} name='priority'>
							<option value='null' selected disabled>
								Select Priority
							</option>
							{PRIORITY.map((priority: string, index: number) => (
								<option key={index} value={priority}>
									{priority}
								</option>
							))}
						</select>
					</div>
					<div className={styles.inputLabel}>
						<label>Category</label>
						<select onChange={handleSelect} name='category'>
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
					<div className={styles.inputLabel}>
						<label>Sub Category</label>
						<select
							onChange={handleSelect}
							name='sub-category'
							disabled={
								!(
									CATEGORY.some((category) => category.CATEGORY === form.Category) &&
									CATEGORY.filter((category) => category.CATEGORY === form.Category)[0].SUBCATEGORY
										.length > 0
								)
							}>
							<option value='null' selected disabled>
								{CATEGORY.some((category) => category.CATEGORY === form.Category) &&
								CATEGORY.filter((category) => category.CATEGORY === form.Category)[0].SUBCATEGORY
									.length > 0
									? 'Select Sub Category'
									: ''}
							</option>
							{CATEGORY.filter((category) => category.CATEGORY === form.Category).length > 0 &&
								CATEGORY.filter((category) => category.CATEGORY === form.Category)[0].SUBCATEGORY.map(
									(subCategory, index) => (
										<option key={index} value={subCategory}>
											{subCategory}
										</option>
									)
								)}
						</select>
					</div>
					<div className={styles.inputLabel}>
						<label>Assign To</label>
						<select onChange={handleSelect} name='assign-to'>
							{ASSIGN_TO.map((assignTo: string, index: number) => (
								<option key={index} value={assignTo}>
									{assignTo}
								</option>
							))}
						</select>
					</div>
					<div className={styles.inputLabel}>
						<label>Due Date</label>
						<input
							onChange={handleInputChange}
							type='datetime-local'
							id='meeting-time'
							name='due-date'
							value={form && form.DueDate ? moment(form.DueDate).format('YYYY-MM-DD HH:mm:ss') : ''}
						/>
					</div>
				</div>
				<div className={styles.fileInput}>
					<input type='file' name='file' />
				</div>
				<div className={styles.inputLabel}>
					<label>Description</label>
					<textarea rows={6} onChange={handleTextAreaChange} />
				</div>

				<div className={styles.buttonGroup}>
					<button type='submit' onClick={handleSubmit}>
						Submit
					</button>
					<button>Cancel</button>
				</div>
			</form>
		</div>
	);
};

export default NewRequest;
