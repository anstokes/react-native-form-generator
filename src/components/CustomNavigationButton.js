import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from "react-native";
import { useTheme, Button } from "react-native-paper";

const CustomNavigationButton = ({ submitHandler, setCurrentScreen, navigateTo, label, disabled, action, ...props }) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const handlePress = () => {
        switch (action) {
            default: break;

            case 'back':
            case 'next':
                setCurrentScreen(navigateTo);
                break;
        }
    }

    return (
        <Button
            onPress={handlePress}
            mode={"contained"}
            disabled={disabled}
            {...props}
        >
            {label}
        </Button>
    );
};


const useStyles = (theme) => {
    return StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        error: {
            padding: 8,
            color: theme.colors.error
        }
    })
};


CustomNavigationButton.propTypes = {
    submitHandler: PropTypes.func,
    setCurrentScreen: PropTypes.func,
    navigateTo: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
    action: PropTypes.string,
};

export default CustomNavigationButton;