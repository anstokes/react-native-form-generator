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
    getHiddenState,
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
    const styles = useStyles();

    // Effect runs when the schema is first loaded, or if it ever changes.
    // It sets the screen details, form properties, validation schema, form data, and current screen.
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
                title: typeof schema.screens[currentScreen].title ? schema.screens[currentScreen].title : null,

                // The current screen description, or null
                description: typeof schema.screens[currentScreen].description === 'string' ? schema.screens[currentScreen].description : null,
            });

            // Set the form values, used to reinitialize the form with the new fields
            setFormValues(formData[currentScreen]);
        }
    }, [currentScreen])


    // Return the Form for the current screen
    return (Object.keys(formValues).length > 0) ? (
        <Formik
            initialValues={formValues}
            enableReinitialize={true}
            validationSchema={validationSchema[currentScreen]}
            onSubmit={async (values, actions) => {
                // Run the submit callback with the form data and the updated schema
                if (currentScreen) {
                    let data = { ...formData, [currentScreen]: values };
                    setFormData(data);

                    // Run submit handler callback
                    if (typeof submitHandler === 'function') {
                        let updatedSchema = getUpdatedSchema(data, schema);
                        let navigateOnSubmit = updatedSchema.screens[currentScreen].navigateOnSubmit ? updatedSchema.screens[currentScreen].navigateOnSubmit : false;
                        let route = false;

                        await submitHandler(data, updatedSchema);

                        if (typeof navigateOnSubmit === 'object') {
                            route = getRoute(data, navigateOnSubmit);
                        }
                        else if (typeof navigateOnSubmit === 'string') {
                            route = navigateOnSubmit;
                        }

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
            {({ values, handleChange, handleSubmit, errors, isSubmitting, ...rest }) => {
                // The custom validation rules, with their related fields
                const customValidation = getCustomValidation(values, formProperties, formData);
                // console.log(errors);

                return typeof formProperties[currentScreen] === 'object' && Object.keys(formProperties[currentScreen]).length > 0 ? (
                    <Fragment>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <ScrollView>
                                {/* Current screen title and description if set */}
                                {typeof screenDetails === 'object' && Object.keys(screenDetails).map(key => {
                                    return (
                                        <TextElement
                                            key={key}
                                            value={screenDetails[key]}
                                            type={key}
                                            errors={errors}
                                            library={library}
                                            theme={theme}
                                        />
                                    )
                                })}


                                {/* Current screen form elements */}
                                {typeof values === 'object' && Object.keys(values).map(fieldName => {
                                    let fieldProperties = formProperties[currentScreen][fieldName];

                                    return fieldProperties ? (
                                        <FieldElement
                                            key={fieldName}
                                            type={fieldProperties.type}
                                            name={fieldName}
                                            label={fieldProperties.label}
                                            value={values[fieldName] ? values[fieldName] : ''}
                                            errors={errors}
                                            hidden={!!(Array.isArray(customValidation.hidden) && customValidation.hidden.includes(fieldName))}
                                            disabled={!!(Array.isArray(customValidation.disabled) && customValidation.disabled.includes(fieldName)) || isSubmitting}
                                            {...fieldProperties.props}
                                            library={library}
                                            theme={theme}
                                        />
                                    ) : null;
                                })}


                                {/* Current screen actions */}
                                <View style={styles.actionsWrapper}>
                                    {schema.screens[currentScreen].actions && Object.keys(schema.screens[currentScreen].actions).map(actionName => {
                                        let button = schema.screens[currentScreen].actions[actionName];

                                        // TODO button hiding/disabling based on rules
                                        return button ? (
                                            <ActionButton
                                                key={actionName}
                                                submitHandler={handleSubmit}
                                                isSubmitting={isSubmitting}
                                                setCurrentScreen={(screen) => {
                                                    // Keep the form data fresh before changing screen
                                                    setFormData({ ...formData, [currentScreen]: values })
                                                    setPreviousScreen(currentScreen);
                                                    setCurrentScreen(screen)
                                                }}
                                                previousScreen={previousScreen}
                                                navigateTo={button.navigateTo ? button.navigateTo : getRoute(formData, schema.screens[currentScreen].navigateOnSubmit)}
                                                label={button.label ? button.label : 'Missing Label'}
                                                library={library ? library : {}}
                                                theme={theme}
                                                type={button.type ? button.type : 'submit'}
                                                action={button.action ? button.action : 'submit'}
                                                errors={errors}
                                                disabled={false}
                                                hidden={false}
                                                rules={button.rules ? button.rules : {}}
                                                {...button.props}
                                            />
                                        ) : null;
                                    })}
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </Fragment>
                ) : null;
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