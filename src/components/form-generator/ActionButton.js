import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text } from "react-native";


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


const ActionButton = ({ submitHandler, isSubmitting, setCurrentScreen, navigateTo, label, library, validation, errors, type, action, ...props }) => {
    let disabled = getDisabled(validation.disabled);

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
    ) : <Text>Missing "{type}" button from library</Text>
};

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
    errors: PropTypes.object,
};

export default ActionButton;