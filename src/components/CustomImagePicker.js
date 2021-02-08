import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

// Imports: Components
import { Button, Image, View, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Text, useTheme} from "react-native-paper";

const CustomImagePicker = ({name, value, label, changeHandler, hidden, ...props}) => {

    const theme = useTheme();
    const styles = useStyles(theme);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({...props.pickerOptions});

        if (!result.cancelled && result.uri) {
            changeHandler(result);
        }
    };


    return hidden ? null : (
        <View style={styles.container}>
            {label && <Text>{label}</Text>}
            <View style={styles.imageContainer}>
                <Button title="Pick an image from camera roll" onPress={pickImage} />
                {value && value.uri ? (
                    <Image source={{ uri: value.uri }} style={{ width: 200, height: 200 }} />
                ) : null}
            </View>
        </View>
    );
};


const useStyles = (theme) => {
    return StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        imageContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        error: {
            padding: 8,
            color: theme.colors.error
        }
    })
};


CustomImagePicker.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    label: PropTypes.string,
    hidden: PropTypes.bool.isRequired,
    changeHandler: PropTypes.func.isRequired,
};

export default CustomImagePicker;