import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-native-paper";

const CustomSubmitButton = ({ submitHandler, isSubmitting, setCurrentScreen, navigateTo, label, disabled, action, ...props }) => {
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(disabled);

    useEffect(() => {
        setLoading(isSubmitting);
        setButtonDisabled(isSubmitting);
    }, [isSubmitting]);

    const handlePress = () => {
        submitHandler();
    }

    return (
        <Button
            onPress={handlePress}
            mode={"contained"}
            disabled={buttonDisabled}
            {...props}
        >
            {loading ? 'Submitting...' : label}
        </Button>
    );
};


CustomSubmitButton.propTypes = {
    submitHandler: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    setCurrentScreen: PropTypes.func.isRequired,
    previousScreen: PropTypes.string,
    navigateTo: PropTypes.string,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    action: PropTypes.string.isRequired,
};

export default CustomSubmitButton;