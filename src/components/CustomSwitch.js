import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from "react-native";
import {Text, useTheme, Switch} from "react-native-paper";

const CustomSwitch = ({containerProps, changeHandler, name, value, label, errors, hidden, ...props}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return hidden ? null : (
        <View {...containerProps} style={styles.container}>
            {label && <Text>{label}</Text>}
            <Switch
                value={value ? value : false}
                name={name}
                onValueChange={(value) => changeHandler(value)}
                {...props}
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


CustomSwitch.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOf(['', true, false]),
    label: PropTypes.string,
    errors: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    hidden: PropTypes.bool.isRequired,
    changeHandler: PropTypes.func.isRequired,
};

export default CustomSwitch;