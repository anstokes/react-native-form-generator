import React from "react";
import PropTypes from 'prop-types';
import { useField } from "formik";
import { Text, StyleSheet } from "react-native";

const FieldElement = ({ name, value, type, label, errors, library, theme, hidden, disabled, ...props }) => {
    const [field, meta, helpers] = useField(name);
    const styles = useStyle(theme);

    return library[type] ? (
        React.createElement(library[type], {
            name,
            value,
            label,
            errors,
            hidden,
            changeHandler: helpers.setValue,
            ...props
        })
    ) : <Text style={styles.text}>Missing {type} input from library.</Text>
};


const useStyle = (theme) => {
    return StyleSheet.create({
        text: {
            color: theme && theme.colors && theme.colors.text ? theme.colors.primary : 'black',
            fontFamily: theme && theme.fonts && theme.fonts.regular && theme.fonts.regular.fontFamily ? theme.fonts.regular.fontFamily : "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        },
    })
}


FieldElement.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.object]),
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
    library: PropTypes.object,
    theme: PropTypes.object,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
}


export default FieldElement;