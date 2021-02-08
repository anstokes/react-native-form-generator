import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const CustomActionButton = ({ submitHandler, isSubmitting, setCurrentScreen, navigateTo, label, disabled, action, ...props }) => {
    const navigation = useNavigation();
    const [buttonDisabled, setButtonDisabled] = useState(disabled);

    useEffect(() => {
        setButtonDisabled(isSubmitting);
    }, [isSubmitting]);

    const handlePress = () => {
        switch (action) {
            default: break;

            case 'back':
                setCurrentScreen(navigateTo);
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
    navigateTo: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    action: PropTypes.string.isRequired,
};

export default CustomActionButton;