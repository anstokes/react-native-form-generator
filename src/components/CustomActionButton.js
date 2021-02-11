import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const CustomActionButton = ({ form, setCurrentScreen, navigateTo, label, action, ...props }) => {
    const navigation = useNavigation();
    const [buttonDisabled, setButtonDisabled] = useState(false);

    // Disable the button when form is submitting
    useEffect(() => {
        if (action !== 'cancel') {
            setButtonDisabled(form.isSubmitting);
        }
    }, [form.isSubmitting]);

    // Disable the button if there are any errors
    useEffect(() => {
        if (typeof form.errors === 'object' && action !== 'cancel') {
            setButtonDisabled(Object.keys(form.errors).length > 0);
        }
    }, [form.errors])

    const handlePress = () => {
        let screen = typeof navigateTo === 'function' ? navigateTo() : navigateTo;

        switch (action) {
            default:
                form.validateForm().then(errors => {
                    if (Object.keys(errors).length > 0) {
                        console.log(errors);
                    }
                    else {
                        setCurrentScreen(screen);
                    }
                });
                break;

            case 'back':
                setCurrentScreen(form.previousScreen)
                break;

            case 'finish':
            case 'cancel':
                navigation.navigate(screen);
                break;
        }
    }

    return (
        <Button
            onPress={handlePress}
            mode={"contained"}
            disabled={buttonDisabled}
            {...props}
        >
            {label}
        </Button>
    );
};


CustomActionButton.propTypes = {
    form: PropTypes.object.isRequired,
    navigateTo: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    label: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
};

export default CustomActionButton;