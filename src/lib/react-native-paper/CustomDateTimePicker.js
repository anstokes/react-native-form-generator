import React, {useState} from 'react'
import PropTypes from 'prop-types'

// Import: Components
import {View, Platform} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';


const CustomDateTimePicker = React.forwardRef(({fieldHelpers, name, value, label, errors, hidden, ...props}, ref) => {
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);

	const onChange = (event, selectedDate) => {
		if (selectedDate) {
			setShow(Platform.OS === 'ios');
			setDate(selectedDate);
			fieldHelpers.setValue(selectedDate.toDateString());
		}
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
		setShow(true);
	};

	return (
		<View ref={ref}>
			<TextInput
				error={errors && errors[name] ? true : false}
				name={name}
				value={value}
				label={label}
				editable={false}
				right={<TextInput.Icon name={'calendar'} onPress={showDatepicker} />}
				{...props}
			/>

			{show && (
				<DateTimePicker
					testID="dateTimePicker"
					value={date}
					mode={mode}
					display="default"
					onChange={onChange}
				/>
			)}
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
