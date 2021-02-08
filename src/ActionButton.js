import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from "react-native";


const getDisabled = (value) => {
    switch (value) {
        default: return false;

        case 'errors':
            if (Object.keys(errors).length > 0) {
                return true;
            }

            break
    }
}


const ActionButton = ({ submitHandler, isSubmitting, setCurrentScreen, navigateTo, label, library, theme, validation, errors, type, action, ...props }) => {
    let disabled = getDisabled(validation.disabled);
    const styles = useStyle(theme);

    return library[type] ? (
        React.createElement(library[type], {
            submitHandler,
            isSubmitting,
            setCurrentScreen,
            navigateTo,
            action,
            disabled,
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
    navigateTo: PropTypes.string,
    type: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    validation: PropTypes.object,
    label: PropTypes.string.isRequired,
    library: PropTypes.object.isRequired,
    theme: PropTypes.object,
    errors: PropTypes.object,
};

export default ActionButton;