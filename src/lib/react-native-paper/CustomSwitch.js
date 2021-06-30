import React, {useState} from 'react'
import PropTypes from 'prop-types'

// Import: Components
import {View} from 'react-native';
import {Text, Switch} from "react-native-paper";


const CustomSwitch = React.forwardRef(({fieldHelpers, name, value, label, errors, hidden, ...props}, ref) => {
	const styles = useStyle();

	return hidden ? null : (
		<View ref={ref} style={styles.switchContainer}>
			<Text>{label}</Text>
			<Switch
				error={errors && errors[name] ? true : false}
				name={name}
				value={!!value}
				{...props}
				onValueChange={(newValue) => {
					if (fieldHelpers && fieldHelpers.setValue) {
						fieldHelpers.setValue(newValue);
					}
					else {
						console.warn('Missing switch change handler');
					}
				}}
			/>
		</View>
	);
})


const useStyle = () => ({
	switchContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		verticalPadding: 8
	}
})


CustomSwitch.propTypes = {
	...Switch.props,
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	changeHandler: PropTypes.func.isRequired,
}


export default CustomSwitch;
