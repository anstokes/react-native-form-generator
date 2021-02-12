import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-native-paper";

const CustomSubmitButton = ({ form, setCurrentScreen, navigateTo, label, action, ...props }) => {
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // Disable and show loading animation when form is submitting
    useEffect(() => {
        setLoading(form.isSubmitting);
        setButtonDisabled(form.isSubmitting);
    }, [form.isSubmitting]);

    // Disable the submit button if there are any errors present
    useEffect(() => {
        if (typeof form.errors === 'object') {
            setButtonDisabled(Object.keys(form.errors).length > 0);
        }
    }, [form.errors])

    return (
        <Button
            onPress={form.handleSubmit}
            mode={"contained"}
            disabled={buttonDisabled}
            style={{ margin: 8, flexGrow: 1 }}
            {...props}
        >
            {loading ? 'Submitting...' : label}
        </Button>
    );
};


CustomSubmitButton.propTypes = {
    form: PropTypes.object.isRequired,
    setCurrentScreen: PropTypes.func.isRequired,
    navigateTo: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    label: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
};

export default CustomSubmitButton;