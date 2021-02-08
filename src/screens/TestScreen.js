import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { coreStyles } from "../styles";
import { CustomCheckbox, CustomImagePicker, CustomRadio, CustomSwitch, CustomTextInput, CustomActionButton, CustomActivityIndicator, CustomSubmitButton } from "../components";
import { connect } from "react-redux";
import { useTheme, Text, Button } from 'react-native-paper';
import FormGenerator from '../components/form-generator/FormGenerator';


const TestScreen = ({ form: { schema }, navigation }) => {

    const submitHandler = (values, updatedSchema) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('submitted');
            }, 2000);
        });
    }

    const theme = useTheme();

    return (
        <>
            <KeyboardAvoidingView behavior={'height'}>
                <ScrollView>
                    <View>
                        <Text style={{ fontSize: 36 }}>Header</Text>
                    </View>
                    <CustomTextInput name={'test'} value={''} hidden={false} changeHandler={() => console.log('test')} />
                    <CustomTextInput name={'test'} value={''} hidden={false} changeHandler={() => console.log('test')} />
                    <CustomTextInput name={'test'} value={''} hidden={false} changeHandler={() => console.log('test')} />
                    <CustomTextInput name={'test'} value={''} hidden={false} changeHandler={() => console.log('test')} />
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button title="Submit" mode={'contained'} onPress={() => null}>Test</Button>
                <Button title="Submit" mode={'contained'} onPress={() => null}>Test</Button>
            </View>
        </>
    );
};

TestScreen.propTypes = {
    form: PropTypes.object.isRequired,
};

const mapStateToProps = ({ form }) => ({
    form
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TestScreen);