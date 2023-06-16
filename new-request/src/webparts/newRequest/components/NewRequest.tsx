import * as React from 'react';
import styles from './NewRequest.module.scss';
import { IRequest } from './INewRequestProps';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import { useEffect, useState, MouseEvent, ChangeEvent } from 'react';
import { ASSIGN_TO, CATEGORY, PRIORITY, SUB_CATEGORY } from '../constants';
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
		CreatedOn: null,
		CreatedBy: ''
	});

	useEffect(() => {
		sp.web
			.currentUser()
			.then((currentUser) => setForm({ ...form, CreatedBy: currentUser.Title }))
			.catch((error: Error) => console.error(error.message));
	}, []);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.name === 'subject') {
			setForm({ ...form, Subject: event.target.value });
		}
		if (event.target.name === 'due-date') {
			setForm({ ...form, DueDate: new Date(event.target.value) });
		}
	};

	const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
		setForm({ ...form, Description: event.target.value });
	};

	const handleSelect = (event: ChangeEvent<HTMLSelectElement>): void => {
		if (event.target.name === 'priority') {
			setForm({ ...form, Priority: event.target.value });
		}
		if (event.target.name === 'category') {
			setForm({ ...form, Category: event.target.value });
		}
		if (event.target.name === 'sub-category') {
			setForm({ ...form, SubCategory: event.target.value });
		}
		if (event.target.name === 'assign-to') {
			setForm({ ...form, AssignTo: event.target.value });
		}
	};

	const handleSubmit = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
		event.preventDefault();
		sp.web.lists
			.getByTitle('Requests')
			.items.add({ ...form, CreatedOn: new Date() })
			.then()
			.catch((error: Error) => console.error(error.message));
	};

	return (
		<div className={styles.newRequestContainer}>
			<div className={styles.formContainer}>
				<div className={styles.formGroup}>
					<label className={styles.inputLabel}>
						<div>Subject</div>
						<input type='text' name='subject' onChange={handleInputChange} required />
					</label>
					<label className={styles.inputLabel}>
						<div>Priority</div>
						<select onChange={handleSelect} name='priority'>
							<option> </option>
							{Object.keys(PRIORITY).map((priority: string, index: number) => (
								<option key={index} value={priority}>
									{priority.split('_').join(' ')}
								</option>
							))}
						</select>
					</label>
					<label className={styles.inputLabel}>
						<div>Category</div>
						<select onChange={handleSelect} name='category'>
							<option> </option>
							{Object.keys(CATEGORY).map((category: string, index: number) => (
								<option key={index} value={category}>
									{category.split('_').join(' ')}
								</option>
							))}
						</select>
					</label>
					<label className={styles.inputLabel}>
						<div>Sub Category</div>
						<select onChange={handleSelect} name='sub-category'>
							<option> </option>
							{Object.keys(SUB_CATEGORY).map((subCategory: string, index: number) => (
								<option key={index} value={subCategory}>
									{subCategory.split('_').join(' ')}
								</option>
							))}
						</select>
					</label>
					<label className={styles.inputLabel}>
						<div>Assign To</div>
						<select onChange={handleSelect} name='assign-to'>
							<option> </option>
							{Object.keys(ASSIGN_TO).map((assignTo: string, index: number) => (
								<option key={index} value={assignTo}>
									{assignTo.split('_').join(' ')}
								</option>
							))}
						</select>
					</label>
					<label className={styles.inputLabel}>
						<div>Due Date</div>
						<input
							onChange={handleInputChange}
							type='datetime-local'
							id='meeting-time'
							name='due-date'
							value={form && form.DueDate ? moment(form.DueDate).format('YYYY-MM-DD HH:mm:ss') : ''}
						/>
					</label>
				</div>
				<label className={styles.inputLabel}>
					<div>Description</div>
					<textarea rows={6} onChange={handleTextAreaChange} />
				</label>

				<div className={styles.buttonGroup}>
					<button onClick={handleSubmit} disabled={form.Subject === ''}>
						Submit
					</button>
					<button>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default NewRequest;
