import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from "react-native";


const ActionButton = ({ submitHandler, isSubmitting, setCurrentScreen, previousScreen, navigateTo, label, library, theme, hidden, disabled, errors, type, action, ...props }) => {
    const styles = useStyle(theme);

    return library[type] ? (
        React.createElement(library[type], {
            submitHandler,
            isSubmitting,
            previousScreen,
            setCurrentScreen,
            previousScreen,
            navigateTo,
            action,
            disabled,
            hidden,
            label,
            ...props
        })
    ) : <Text style={styles.text}>Missing "{type}" button from library</Text>
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
    submitHandler: PropTypes.func,
    isSubmitting: PropTypes.bool.isRequired,
    setCurrentScreen: PropTypes.func,
    previousScreen: PropTypes.string,
    navigateTo: PropTypes.string,
    type: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    label: PropTypes.string.isRequired,
    library: PropTypes.object.isRequired,
    theme: PropTypes.object,
    errors: PropTypes.object,
};

export default ActionButton;