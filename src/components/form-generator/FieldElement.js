import React from "react";
import PropTypes from 'prop-types';
import { useField } from "formik";
import { Text } from "react-native-paper";

const FieldElement = ({ name, value, type, label, errors, library, containerProps, hidden, ...props }) => {
    const [field, meta, helpers] = useField(name);

    return library[type] ? (
        React.createElement(library[type], {
            containerProps,
            name,
            value,
            label,
            errors,
            hidden,
            changeHandler: helpers.setValue,
            ...props
        })
    ) : <Text>Missing {type} input from library.</Text>
};

FieldElement.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.object]),
    label: PropTypes.string,
    type: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
}


export default FieldElement;