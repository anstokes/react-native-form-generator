import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet, Modal, Platform, Keyboard} from 'react-native';
import {Button, TextInput, RadioButton, Dialog, Portal} from "react-native-paper";


const CustomSelect = React.forwardRef(({containerProps, changeHandler, name, value, label, errors, hidden, fieldHelpers, ...props}, ref) => {
	const {theme} = props;
	const styles = useStyles(theme);
	const [dialogVisible, setDialogVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [textInput, setTextInput] = useState(null);
	
	const toggleDialogVisible = () => {
		const visible = !dialogVisible;
		if (visible) {
			setModalVisible(true);
		}
		setDialogVisible(visible);
		hideKeyboard();
	}
	
	const toggleModalVisible = () => {
		setModalVisible(!modalVisible);
		setDialogVisible(!modalVisible);
		hideKeyboard();
	}
	
	const hideKeyboard = () => {
		//Keyboard.dismiss();		// Clear focus from all text elements and hides keyboard	
		if (textInput) {
			textInput.blur();
		}
	}

	return hidden ? null : (
		<Fragment>
			{/* Use native modal for android/ios */}
			{modalVisible && Platform.OS !== 'web' && (
				<Modal
					transparent={true}
					visible={modalVisible}
					// onDismiss={toggleModalVisible}		// Function triggered once the modal has been dismissed (visible prop has changed)
					onRequestClose={toggleModalVisible}		// Function triggered by the device "Back" action
				>
					<Dialog visible={modalVisible} style={styles.dialogContainer} onDismiss={toggleModalVisible}>
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
							<Button onPress={toggleModalVisible} color={theme.colors?.onSurface ?? '#000'}>Done</Button>
						</Dialog.Actions>
					</Dialog>
				</Modal>
			)}
			
			{/* Use portal for web */}
			{dialogVisible && Platform.OS === 'web' && (
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
				ref={setTextInput}
				error={errors && errors[name] ? true : false}
				name={name}
				value={value}
				label={label}
				showSoftInputOnFocus={false}	// Does not show keyboard on focus
				editable={false}
				onFocus={toggleDialogVisible}
				{...props}
			/>
		</Fragment>
	);
});


const useStyles = (theme) => {
	return StyleSheet.create({
		dialogContainer: {
			borderWidth: 2,
			borderStyle: 'solid',
			borderColor: theme.colors.primary,
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