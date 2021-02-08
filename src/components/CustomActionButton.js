import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const CustomActionButton = ({ submitHandler, isSubmitting, setCurrentScreen, previousScreen, navigateTo, label, disabled, action, ...props }) => {
    const navigation = useNavigation();
    const [buttonDisabled, setButtonDisabled] = useState(disabled);

    useEffect(() => {
        setButtonDisabled(isSubmitting);
    }, [isSubmitting]);

    const handlePress = () => {
        switch (action) {
            default: break;

            case 'back':
                setCurrentScreen(previousScreen);
                break;

            case 'next':
                if (navigateTo) {
                    setCurrentScreen(navigateTo);
                }
                break;

            case 'cancel':
                navigation.navigate(navigateTo);
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

export default CustomActionButton;