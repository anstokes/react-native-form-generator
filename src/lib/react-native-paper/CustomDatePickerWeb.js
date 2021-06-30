import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

// Import: Components
import {View} from 'react-native';
import {Text} from 'react-native-paper';


const CustomDatePickerWeb = React.forwardRef(({fieldHelpers, name, value, label, errors, hidden, theme, ...props}, ref) => {
	const [styles, setStyles] = useState({});
	const [dateInput, setDateInput] = useState(null);

	useEffect(() => {
		const styles = useStyles(theme, !!errors[name]);
		setStyles(styles);
	}, [!!errors[name]])

	useEffect(() => {
		setDateInput(
			React.createElement('input', {
				type: 'date',
				name: name,
				value: value,
				style: styles.input,
				onChange: (event) => {fieldHelpers.setValue(event.target.value)}
			})
		)
	}, [styles, value])

	return (
		<View ref={ref} style={styles.container}>
			<Text style={styles.label}>{label}</Text>
			{dateInput}
		</View>
	)
})


const useStyles = (theme, isError) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-evenly',
	},
	label: {
		padding: 8,
		color: isError ? theme.colors.error : theme.colors.onSurface,
	},
	input: {
		overflow: 'hidden',
		height: 60,
		paddingLeft: 8,
		paddingRight: 8,
		borderStyle: 'none',
		borderTopLeftRadius: 3,
		borderTopRightRadius: 3,
		borderBottomStyle: 'solid',
		borderBottomColor: isError ? theme.colors.error : theme.colors.primary,
		borderBottomWidth: 2,
		backgroundColor: theme.colors.background,
		color: isError ? theme.colors.error : theme.colors.onSurface,
	}
})


CustomDatePickerWeb.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	hidden: PropTypes.bool,
	changeHandler: PropTypes.func.isRequired,
}


export default CustomDatePickerWeb;
