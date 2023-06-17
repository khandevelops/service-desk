import * as React from 'react';
import styles from './NewRequest.module.scss';
import { IRequest } from './INewRequestProps';
import { SPFI, SPFx, spfi } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/site-users/web';
import { useEffect, useState, ChangeEvent } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CATEGORY, PRIORITY } from '../constants';
// import * as moment from 'moment';

const NewRequest = ({ context }: { context: WebPartContext }): JSX.Element => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues
	} = useForm();
	const onSubmit: SubmitHandler<IRequest> = (data) => console.log(data);

	const sp: SPFI = spfi().using(SPFx(context));

	const [form, setForm] = useState<IRequest>({
		Subject: '',
		Priority: '',
		Category: '',
		SubCategory: '',
		AssignTo: '',
		DueDate: null,
		Description: '',
		SubmittedBy: '',
		CreatedTime: null,
		CompletedTime: null,
		CompletedBy: ''
	});

	useEffect(() => {
		sp.web
			.currentUser()
			.then((currentUser) => setForm({ ...form, SubmittedBy: currentUser.Title }))
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

	// const handleSelect = (event: ChangeEvent<HTMLSelectElement>): void => {
	// 	console.log(event);
	// 	if (event.target.name === 'Priority') {
	// 		setForm({ ...form, Priority: event.target.value });
	// 	}
	// 	if (event.target.name === 'Category') {
	// 		setForm({ ...form, Category: event.target.value });
	// 	}
	// 	if (event.target.name === 'SubCategory') {
	// 		setForm({ ...form, SubCategory: event.target.value });
	// 	}
	// 	if (event.target.name === 'assignTo') {
	// 		setForm({ ...form, AssignTo: event.target.value });
	// 	}
	// };

	// const Select = forwardRef<
	// 	HTMLSelectElement,
	// 	{ label: string; options: string[] } & ReturnType<UseFormRegister<IRequest>>
	// >(({ onChange, onBlur, name, label, options }, ref) => (
	// 	<>
	// 		<label>{label}</label>
	// 		<select name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
	// 			{options.map((option, index) => (
	// 				<option key={index}>{option}</option>
	// 			))}
	// 		</select>
	// 	</>
	// ));

	return (
		<div className={styles.newRequestContainer}>
			<div>hi</div>
			<div>{form.Category}</div>
			<form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.inputContainer}>
					<label>Subject</label>
					<input {...register('Subject', { required: true })} name='Subject' onChange={handleInputChange} />
					{errors.exampleRequired && <span>This field is required</span>}
				</div>
				<div className={styles.formGroup}>
					<div className={styles.inputContainer}>
						<label>Priority</label>
						<select {...register('Priority')} name='Priority'>
							{PRIORITY.map((priority, index) => (
								<option key={index} value={priority}>
									{priority.split('_').join(' ')}
								</option>
							))}
						</select>
					</div>
					<div className={styles.inputContainer}>
						<label>Category</label>
						<select {...register('Category')} name='Category'>
							{CATEGORY.map((category, index) => (
								<option key={index} value={category.CATEGORY}>
									{category.CATEGORY.split('_').join(' ')}
								</option>
							))}
						</select>
					</div>
					<div className={styles.inputContainer}>
						<label>Sub Category</label>
						<select {...register('SubCategory')} name='SubCategory'>
							{CATEGORY.filter((category) => category.CATEGORY === form.Category).length > 1 &&
								CATEGORY.filter((category) => category.CATEGORY === form.Category)[0].SUBCATEGORY.map(
									(subcategory, index) => (
										<option key={index} value={subcategory}>
											{subcategory.split('_').join(' ')}
										</option>
									)
								)}
						</select>
					</div>
					{/* <div className={styles.inputContainer}>
						<label>Assign To</label>
						<select {...register('assignTo')} name='assign-to'>
							<option> </option>
							{Object.keys(ASSIGN_TO).map((category: string, index: number) => (
								<option key={index} value={category}>
									{category.split('_').join(' ')}
								</option>
							))}
						</select>
					</div> */}
					{/* <div className={styles.inputContainer}>
						<label>Due Date</label>
						<input
							onChange={handleInputChange}
							type='datetime-local'
							id='meeting-time'
							name='due-date'
							value={form && form.DueDate ? moment(form.DueDate).format('YYYY-MM-DD HH:mm:ss') : ''}
						/>
					</div> */}
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
