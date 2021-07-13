import React, {useState} from 'react'
import PropTypes from 'prop-types'

// Import: Components
import {View, Platform} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {TouchableOpacity} from 'react-native-gesture-handler';


const CustomDateTimePicker = React.forwardRef(({fieldHelpers, name, value, label, errors, hidden, ...props}, ref) => {
	const [date, setDate] = useState(new Date(value ?? null));
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);
	const [type, setType] = useState('default');

	const onChange = (event, selectedDate) => {
		if (selectedDate) {
			setShow(false)
			setDate(selectedDate);
			fieldHelpers.setValue(selectedDate.toDateString());
		}
		else {
			setShow(false);
		}
	};
	
	const showMode = (mode, type) => {
		type = Platform.OS === 'ios' ? 'spinner' : type;
		setType(type);
		setMode(mode);
		setShow(true);
	}
	
	const showDatePicker = () => {
		showMode('date', 'calendar');
	}

	return (
		<View ref={ref}>
			<TouchableOpacity onPressIn={showDatePicker}>
				<TextInput
					error={errors && errors[name] ? true : false}
					name={name}
					value={date.toDateString()}
					label={label}
					editable={false}
					{...props}
				/>
			</TouchableOpacity>

			{show ? (
				<DateTimePicker
					testID={"dateTimePicker"}
					value={date}
					mode={mode}
					display={type}
					onChange={onChange}
				/>
			) : null}
		</View>
	);
})


CustomDateTimePicker.propTypes = {
	...DateTimePicker.props,
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	hidden: PropTypes.bool,
	changeHandler: PropTypes.func.isRequired,
}


export default CustomDateTimePicker;