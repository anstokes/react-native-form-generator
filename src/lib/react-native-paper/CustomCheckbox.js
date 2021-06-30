import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from "react-native";
import {Text, Checkbox, useTheme} from "react-native-paper";

const CustomCheckbox = ({containerProps, changeHandler, name, value, label, errors, hidden, ...props}) => {
	const theme = useTheme();
	const styles = useStyles(theme);

	const {fieldHelpers} = props;

	return hidden ? null : (
		<View {...containerProps} style={styles.container}>
			{label && <Text>{label}</Text>}
			<Checkbox
				status={value == 'yes' ? 'checked' : 'unchecked'}
				name={name}
				onPress={() => fieldHelpers.setValue(value == 'yes' ? 'no' : 'yes')}
				{...props}
			/>
			{errors && errors[name] ? (
				<Text style={styles.error}>{errors[name]}</Text>
			) : null}
		</View>
	);
};


const useStyles = (theme) => {
	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 16,
		},
		error: {
			padding: 8,
			color: theme.colors.error
		}
	})
};


CustomCheckbox.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	hidden: PropTypes.bool.isRequired,
	changeHandler: PropTypes.func.isRequired,
};

export default CustomCheckbox;