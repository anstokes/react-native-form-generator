import React, { useState, useEffect, Fragment } from 'react';
import { ScrollView, StyleSheet, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';

// Import: Formik dependencies
import { Formik } from 'formik';

// Import: Utilities
import {
    getProperties,
    getFormData,
    prepareValidationSchema,
    getCustomValidation,
    getUpdatedSchema,
    getRoute
} from './utils';

// Import: Components
import FieldElement from './FieldElement';
import ActionButton from './ActionButton';
import TextElement from './TextElement';


const FormGenerator = ({ schema, library, submitHandler, theme, navigation, validateOnChange = false, validateOnMount = false }) => {
    const [previousScreen, setPreviousScreen] = useState('');
    const [currentScreen, setCurrentScreen] = useState('');
    const [screenDetails, setScreenDetails] = useState({});
    const [formProperties, setFormProperties] = useState({});
    const [formData, setFormData] = useState({});
    const [formValues, setFormValues] = useState({});
    const [validationSchema, setValidationSchema] = useState({});
    const [endScreen, setEndScreen] = useState({});
    const styles = useStyles();

    // Effect runs when the schema is first loaded, or if it ever changes.
    // It sets the screen details, form properties, validation schema, form data, current screen, and end screen details.
    useEffect(() => {
        if (Object.keys(schema).length > 0 && typeof schema.screens === 'object') {
            let initialScreen = false;
            let properties = getProperties(schema);

            // Get the initial screen based on either the initialScreen property in the schema, or the first screen name
            if (typeof schema.initialScreen === 'string') {
                initialScreen = schema.initialScreen;
            }
            else if (Object.keys(schema.screens).length > 0) {
                initialScreen = Object.keys(schema.screens)[0];
            }

            // Set the default end screen object
            if (schema.screens && schema.screens.end) {
                setEndScreen(schema.screens.end)
            }

            // Set the initial screen details
            if (initialScreen) {
                setScreenDetails({
                    // The current screen title, or null
                    title: typeof schema.screens[initialScreen].title ? schema.screens[initialScreen].title : null,

                    // The current screen description, or null
                    description: typeof schema.screens[initialScreen].description === 'string' ? schema.screens[initialScreen].description : null,
                });

                setFormProperties(properties);
                setValidationSchema(prepareValidationSchema(properties));
                setFormData(getFormData(properties));
                setPreviousScreen(initialScreen);
                setCurrentScreen(initialScreen);
            }
        }
    }, [schema]);


    // Effect runs when the current screen changes.
    // It sets the screen details and form values based on the form data. 
    // The form data stores the properties for all the screens, while the form values stores only the ones for the current screen.
    useEffect(() => {
        if (currentScreen) {
            // Set the new screen details
            setScreenDetails({
                // The current screen title, or null
                title: typeof schema.screens[currentScreen].title === 'string' ? schema.screens[currentScreen].title : null,

                // The current screen description, or null
                description: typeof schema.screens[currentScreen].description === 'string' ? schema.screens[currentScreen].description : null,

                // The style which applies to the screen content wrapper
                contentContainerStyle: schema.screens[currentScreen].contentContainerStyle ? schema.screens[currentScreen].contentContainerStyle : null
            });

            // Set the form values, used to reinitialize the form with the new fields
            if (formData[currentScreen]) {
                setFormValues(formData[currentScreen]);
            }
            else {
                setFormValues({});
            }
        }
    }, [currentScreen])


    // Return the Form for the current screen
    return schema.screens[currentScreen] ? (
        <Formik
            initialValues={formValues}
            enableReinitialize={true}
            validationSchema={validationSchema[currentScreen] ? validationSchema[currentScreen] : null}
            onSubmit={async (values, actions) => {
                // Run the submit callback with the form data and the updated schema
                if (currentScreen) {
                    let data = { ...formData, [currentScreen]: values };
                    setFormData(data);

                    // Run submit handler callback, and redirect the user
                    if (typeof submitHandler === 'function') {
                        let updatedSchema = getUpdatedSchema(data, schema);
                        let navigateOnSubmit = updatedSchema.screens[currentScreen].navigateOnSubmit ? updatedSchema.screens[currentScreen].navigateOnSubmit : false;
                        let route = getRoute(data, navigateOnSubmit, endScreen, setEndScreen);

                        await submitHandler(data, updatedSchema);

                        if (route) {
                            switch (Object.keys(updatedSchema.screens).includes(route)) {
                                default: break;

                                case true:
                                    setPreviousScreen(currentScreen);
                                    setCurrentScreen(route);
                                    break;

                                case false:
                                    if (navigation && navigation.navigate) {
                                        navigation.navigate(route);
                                    }
                                    else {
                                        console.warn('Failed to navigate using app navigation expected "object", instead got: ' + typeof (navigation));
                                    }
                                    break;

                            }
                        }
                    }
                }
            }}
            validateOnChange={validateOnChange}
            validateOnMount={validateOnMount}
        >
            {({ values, ...form }) => {
                // The custom validation rules, with their related fields
                const customValidation = getCustomValidation(values, formProperties, formData);
                // console.log(form.errors);

                // console.log(customValidation);

                return (
                    <Fragment>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <ScrollView contentContainerStyle={screenDetails.contentContainerStyle ? { ...screenDetails.contentContainerStyle } : {}}>

                                {/* Current screen title and description if set */}
                                {typeof screenDetails === 'object' && Object.keys(screenDetails).map(key => {
                                    return ['title', 'description'].includes(key) && screenDetails[key] ? (
                                        <TextElement
                                            key={key}
                                            value={screenDetails[key] ? screenDetails[key] : ''}
                                            type={key}
                                            errors={form.errors}
                                            library={library}
                                            theme={theme}
                                        />
                                    ) : null;
                                })}


                                {/* Current screen form elements */}
                                {formProperties[currentScreen] && Object.keys(values).map(fieldName => {
                                    let fieldProperties = formProperties[currentScreen][fieldName] ? formProperties[currentScreen][fieldName] : false;
                                    let hidden = !!(Array.isArray(customValidation.hidden) && customValidation.hidden.includes(fieldName));

                                    return fieldProperties && !hidden && (
                                        <FieldElement
                                            key={fieldName}
                                            type={fieldProperties.type}
                                            name={fieldName}
                                            label={fieldProperties.label}
                                            value={values[fieldName] ? values[fieldName] : ''}
                                            errors={form.errors}
                                            hidden={hidden}
                                            disabled={!!(Array.isArray(customValidation.disabled) && customValidation.disabled.includes(fieldName)) || form.isSubmitting}
                                            {...fieldProperties.props}
                                            library={library}
                                            theme={theme}
                                        />
                                    );
                                })}


                                {/* Current screen actions */}
                                <View style={styles.actionsWrapper}>
                                    {schema.screens[currentScreen].actions && Object.keys(schema.screens[currentScreen].actions).map(actionName => {
                                        let button = schema.screens[currentScreen].actions[actionName];
                                        let navigateOnSubmit = schema.screens[currentScreen].navigateOnSubmit && schema.screens[currentScreen].navigateOnSubmit;

                                        return button ? (
                                            <ActionButton
                                                key={actionName}
                                                form={{
                                                    ...form,
                                                    allData: formData,
                                                    navigateOnSubmit,
                                                    currentScreen,
                                                    previousScreen,
                                                }}
                                                setCurrentScreen={(screen) => {
                                                    // Keep the form data fresh before changing screen
                                                    setFormData({ ...formData, [currentScreen]: values })
                                                    setPreviousScreen(currentScreen);
                                                    setCurrentScreen(screen)
                                                }}
                                                navigateTo={button.navigateTo ? button.navigateTo : () => getRoute(formData, navigateOnSubmit, endScreen, setEndScreen)}
                                                label={button.label ? button.label : 'Missing Label'}
                                                library={library ? library : {}}
                                                theme={theme}
                                                type={button.type ? button.type : 'submit'}
                                                action={button.action ? button.action : 'submit'}
                                                {...button.props}
                                            />
                                        ) : null;
                                    })}
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </Fragment>
                );
            }}
        </Formik>
    ) : null;
};


const useStyles = () => (StyleSheet.create({
    actionsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
}));


FormGenerator.propTypes = {
    schema: PropTypes.object.isRequired,
    library: PropTypes.object.isRequired,
    validateOnChange: PropTypes.bool,
    validateOnMount: PropTypes.bool,
    submitHandler: PropTypes.func.isRequired,
    theme: PropTypes.object,
    navigation: PropTypes.object,
};


export default FormGenerator;