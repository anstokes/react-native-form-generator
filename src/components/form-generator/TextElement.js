import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from "react-native";

const TextElement = ({ value, type, errors, library, theme, ...props }) => {
    const styles = useStyle(theme);

    return library[type] ? (
        React.createElement(library[type], {
            name,
            value,
            label,
            errors,
            changeHandler: helpers.setValue,
            ...props
        })
    ) : (
            <View style={styles.container}>
                <Text style={[styles.text, styles[type] ? styles[type] : '']}>{value}</Text>
            </View>
        )
};


const useStyle = (theme) => {
    return StyleSheet.create({
        container: {
            padding: 8
        },
        text: {
            color: theme && theme.colors && theme.colors.text ? theme.colors.text : 'black',
            fontFamily: theme && theme.fonts && theme.fonts.regular && theme.fonts.regular.fontFamily ? theme.fonts.regular.fontFamily : "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        },
        title: {
            fontSize: 18,
            marginBottom: 8
        },
        description: {
            marginBottom: 8
        }
    })
}


TextElement.propTypes = {
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    errors: PropTypes.object.isRequired,
    library: PropTypes.object,
    theme: PropTypes.object,
}


export default TextElement;