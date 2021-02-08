import React from 'react';
import PropTypes from 'prop-types';
import { View } from "react-native";
import { coreStyles } from "../styles";
import { CustomCheckbox, CustomImagePicker, CustomRadio, CustomSwitch, CustomTextInput, CustomActionButton, CustomSubmitButton } from "../components";
import { connect } from "react-redux";
import { useTheme } from 'react-native-paper';
import FormGenerator from '../components/form-generator/FormGenerator';


const PaginatedFormScreen = ({ form: { schema }, navigation }) => {
    const submitHandler = (values, updatedSchema) => {
        console.log(values, updatedSchema);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve('submitted');
            }, 2000);
        });
    }

    const theme = useTheme();

    return schema.paginatedSchema ? (
        <View style={coreStyles.container}>
            <FormGenerator
                schema={schema.paginatedSchema}
                library={{
                    string: CustomTextInput,
                    switch: CustomSwitch,
                    checkbox: CustomCheckbox,
                    radio: CustomRadio,
                    imagePicker: CustomImagePicker,
                    action: CustomActionButton,
                    submit: CustomSubmitButton
                }}
                submitHandler={submitHandler}
                validateOnChange={true}
                theme={theme}
                navigation={navigation}
            />
        </View>
    ) : null;
};

PaginatedFormScreen.propTypes = {
    form: PropTypes.object.isRequired,
};

const mapStateToProps = ({ form }) => ({
    form,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PaginatedFormScreen);