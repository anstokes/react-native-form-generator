import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from "react-native";
import {Text, useTheme, RadioButton} from "react-native-paper";

const CustomRadio = ({containerProps, changeHandler, name, value, label, errors, options, hidden, fieldHelpers, ...props}) => {
	const theme = useTheme();
	const styles = useStyles(theme);

	return hidden ? null : (
		<View {...containerProps} style={styles.container}>
			{label && <Text>{label}</Text>}
			<View style={styles.column}>
				{options && (options.map(option => (
					<View key={option.value} style={[styles.optionContainer, {alignItems: 'center'}]}>
						{option.label && (<Text>{option.label}</Text>)}
						<RadioButton
							value={option.value}
							status={option.value === value ? 'checked' : 'unchecked'}
							onPress={() => changeHandler(option.value)}
							{...props}
						/>
					</View>
				)))}
				{errors[name] ? (
					<Text style={styles.error}>{errors[name]}</Text>
				) : null}
			</View>
		</View>
	);
};


const useStyles = (theme) => {
	return StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 16,
		},
		optionContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between'
		},
		error: {
			padding: 8,
			color: theme.colors.error
		}
	})
};


CustomRadio.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	options: PropTypes.array.isRequired,
	hidden: PropTypes.bool.isRequired,
	changeHandler: PropTypes.func.isRequired,
};

export default CustomRadio;