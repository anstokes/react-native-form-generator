import React from 'react';
import PropTypes from 'prop-types';
import { View } from "react-native";
import { coreStyles } from "../styles";
import { CustomCheckbox, CustomImagePicker, CustomRadio, CustomSwitch, CustomTextInput, CustomActionButton, CustomSubmitButton, CustomCamera, CustomSignaturePad, CustomAudioRecorder } from "../components";
import { connect } from "react-redux";
import { useTheme } from 'react-native-paper';
import FormGenerator from '../components/form-generator/FormGenerator';


const AllElementsFormScreen = ({ form: { schema }, navigation }) => {

    const submitHandler = (values, updatedSchema) => {
        console.log(values, updatedSchema);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve('submitted');
            }, 500);
        });
    }

    const theme = useTheme();

    return schema.allElementsSchema ? (
        <View style={coreStyles.container}>
            <FormGenerator
                schema={schema.allElementsSchema}
                library={{
                    string: CustomTextInput,
                    switch: CustomSwitch,
                    checkbox: CustomCheckbox,
                    radio: CustomRadio,
                    imagePicker: CustomImagePicker,
                    action: CustomActionButton,
                    submit: CustomSubmitButton,
                    camera: CustomCamera,
                    signaturePad: CustomSignaturePad,
                    audioRecorder: CustomAudioRecorder
                }}
                submitHandler={submitHandler}
                validateOnChange={true}
                theme={theme}
                navigation={navigation}
            />
        </View>
    ) : null;
};

AllElementsFormScreen.propTypes = {
    form: PropTypes.object.isRequired,
};

const mapStateToProps = ({ form }) => ({
    form
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AllElementsFormScreen);