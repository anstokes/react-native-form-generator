import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text} from "react-native";


const ActionButton = ({form, navigateTo, label, library, theme, type, action, ...props}) => {
	const styles = useStyle(theme);

	return library[type] ? (
		React.createElement(library[type], {
			form,
			navigateTo,
			action,
			label,
			...props
		})
	) : <Text style={styles.text}>"Missing {type} button from library."</Text>
};


const useStyle = (theme) => {
	return StyleSheet.create({
		text: {
			color: theme && theme.colors && theme.colors.text ? theme.colors.primary : 'black',
			fontFamily: theme && theme.fonts && theme.fonts.regular && theme.fonts.regular.fontFamily ? theme.fonts.regular.fontFamily : "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"
		},
	})
}


ActionButton.propTypes = {
	form: PropTypes.object.isRequired,
	navigateTo: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	type: PropTypes.string.isRequired,
	action: PropTypes.string.isRequired,
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	library: PropTypes.object.isRequired,
	theme: PropTypes.object,
};

export default ActionButton;