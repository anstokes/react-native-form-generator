import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, TextInput, RadioButton, Portal, Dialog} from "react-native-paper";


const CustomSelect = React.forwardRef(({containerProps, changeHandler, name, value, label, errors, hidden, fieldHelpers, ...props}, ref) => {
	const {theme} = props;
	const styles = useStyles(theme);
	const [dialogVisible, setDialogVisible] = useState(false);

	const toggleDialogVisible = () => {
		setDialogVisible(!dialogVisible);
	}

	return hidden ? null : (
		<Fragment>
			{/* Show dialog with options */}
			{dialogVisible && (
				<Portal>
					<Dialog visible={dialogVisible} style={styles.dialogContainer} onDismiss={toggleDialogVisible}>
						<Dialog.Title>{label}</Dialog.Title>
						<Dialog.Content style={styles.dialogContent}>
							<ScrollView style={styles.listContainer}>
								<RadioButton.Group name={name} onValueChange={(newValue) => changeHandler(newValue)} value={value}>
									{props.options.map(elem => {
										//console.log(elem.name);
										return (
											<RadioButton.Item key={elem.value} label={elem.name} value={elem.value} />
										)
									})}
								</RadioButton.Group>
							</ScrollView>
						</Dialog.Content>
						<Dialog.Actions>
							<Button onPress={toggleDialogVisible} color={theme.colors?.onSurface ?? '#000'}>Done</Button>
						</Dialog.Actions>
					</Dialog>
				</Portal>
			)}

			{/* The text input with the selected value */}
			<TextInput
				ref={ref}
				error={errors && errors[name] ? true : false}
				name={name}
				value={value}
				label={label}
				{...props}
				onFocus={toggleDialogVisible}
			/>
		</Fragment>

	);
})


const useStyles = (theme) => {
	return StyleSheet.create({
		dialogContainer: {
			borderWidth: 2,
			borderStyle: 'solid',
			borderColor: theme.colors.primary
		},
		dialogContent: {
			backgroundColor: theme.colors.background
		},
		listContainer: {
			padding: 8,
			maxHeight: 300
		},
		error: {
			padding: 8,
			color: theme.colors.error
		}
	})
};


CustomSelect.propTypes = {
	...RadioButton.props,
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	hidden: PropTypes.bool.isRequired,
	changeHandler: PropTypes.func.isRequired,
};

export default CustomSelect;