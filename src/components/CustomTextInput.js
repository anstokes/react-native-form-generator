import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

const CustomTextInput = ({ containerProps, changeHandler, name, value, label, errors, hidden, ...props }) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return hidden ? null : (
        <View {...containerProps} style={styles.container}>
            <TextInput
                error={errors && errors[name] ? true : false}
                name={name}
                value={value}
                label={label}
                {...props}

                onChangeText={(value) => changeHandler(value)}
            />
            {errors && errors[name] ? (
                <Text style={styles.error}>{errors[name]}</Text>
            ) : null}
        </View>
    );
};


const useStyles = (theme) => {
    return StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        error: {
            padding: 8,
            color: theme.colors.error
        }
    })
};


CustomTextInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    hidden: PropTypes.bool.isRequired,
    changeHandler: PropTypes.func.isRequired,
};

export default CustomTextInput;