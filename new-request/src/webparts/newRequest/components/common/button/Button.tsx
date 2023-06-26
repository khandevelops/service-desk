import * as React from 'react';
import styles from './Button.module.scss';

const Button = ({ text }: { text: string }): JSX.Element => {
	return (
		<div className={styles.button}>
			<button>{text}</button>
		</div>
	);
};

export default Button;
