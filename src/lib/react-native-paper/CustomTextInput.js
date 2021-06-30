import React from 'react'
import PropTypes from 'prop-types'

// Import: Components
import {TextInput} from "react-native-paper";


const CustomTextInput = React.forwardRef(({containerProps, changeHandler, name, value, label, errors, hidden, ...props}, ref) => {
	return hidden ? null : (
		<TextInput
			ref={ref}
			error={errors && errors[name] ? true : false}
			name={name}
			value={value}
			label={label}
			{...props}
			onChangeText={(value) => changeHandler(value)}
		/>
	);
})


CustomTextInput.propTypes = {
	...TextInput.props,
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	changeHandler: PropTypes.func.isRequired,
}

export default CustomTextInput;
