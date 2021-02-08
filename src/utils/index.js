// Imports: Dependencies
import Rules from "@flipbyte/yup-schema";


/**
 * Function goes through the given array to find an object with a key named "function", if found the function returns the indexes which lead to the "function".
 * It only looks down to one level of nesting.
 * 
 * @param {Array} dataArray 
 */
const hasFunction = (dataArray) => {
    let indexes = [];

    if (Array.isArray(dataArray)) {
        dataArray.forEach((elem, index) => {
            // Find the object and check if it has a key named function
            if (Array.isArray(elem)) {
                elem.forEach((nestedElem, nestedIndex) => {
                    // Check if object with key "function" exists
                    if (typeof nestedElem === 'object') {
                        let keys = Object.keys(nestedElem);

                        if (keys.length > 0 && keys.includes("function")) {
                            // Store the indexes up to this point
                            indexes = [index, nestedIndex];
                        }
                    }
                })
            }
        })
    }

    return indexes.length > 0 ? indexes : false;
}


const ensureFunctionAndRegex = (dataArray) => {
    if (Array.isArray(dataArray)) {
        dataArray.forEach((elem, index) => {
            // Find the element which has the regex object
            if (Array.isArray(elem)) {
                elem.forEach((nestedElem, nestedIndex) => {
                    // Check if string value starts with / and ends with /, if so convert from string to regex
                    if (typeof nestedElem === 'object') {
                        let keys = Object.keys(nestedElem);

                        if (keys.length > 0) {
                            // Convert to function from object
                            if (keys.includes('function')) {
                                let args = dataArray[index][nestedIndex].function.args;
                                let body = dataArray[index][nestedIndex].function.body;

                                dataArray[index][nestedIndex] = new Function(args, body);
                            }
                            else if (keys.includes('regex')) {
                                let value = dataArray[index][nestedIndex].regex.value;
                                let flag = dataArray[index][nestedIndex].regex.flag;

                                dataArray[index][nestedIndex] = new RegExp(value, flag);
                            }
                        }
                    }
                })
            }
        })
    }
}


/**
 * Converts the schema properties validation rules to yup rules, and returns the converted rules associated under their related screens.
 * Also, it initializes any functions to work with yup.
 * 
 * @param {object} properties 
 */
export const prepareValidationSchema = (properties) => {
    let validationSchema = {};

    if (properties && typeof properties === 'object') {
        Object.keys(properties).forEach(screenName => {
            // Set the validation rules for each property (field)
            if (typeof properties[screenName] === 'object') {
                Object.keys(properties[screenName]).forEach(propertyName => {
                    if (properties[screenName][propertyName].validation) {
                        // Ensure the function and regex objects are converted
                        ensureFunctionAndRegex(properties[screenName][propertyName].validation)
                        validationSchema[screenName] = { ...validationSchema[screenName], [propertyName]: properties[screenName][propertyName].validation };
                    }
                })
            }
            else {
                console.warn('Failed to prepare screen: ' + screenName + ' validation, expected "object" instead got "' + typeof properties[screenName] + '"');
            }


            // Convert the validation rules to yup rules
            if (typeof validationSchema[screenName] === 'object') {
                // Only convert if there are validation rules for the current screen
                if (Object.keys(validationSchema[screenName]).length > 0) {
                    validationSchema[screenName] = new Rules([['object'], ['shape', validationSchema[screenName]]]).toYup();
                }
                else {
                    console.warn('Failed to convert screen: ' + screenName + ' validation rules to yup, no validation rules found');
                }
            }
            else {
                console.warn('Failed to convert screen: ' + screenName + ' validation rules to yup, expected "object" instead got "' + typeof properties[screenName] + '"');
            }
        })
    }

    return validationSchema;
}


/**
 * Function returns all of the properties with their associated screen name.
 * 
 * @param {object} jsonSchema
 */
export const getProperties = (jsonSchema) => {
    let formProperties = {};

    if (jsonSchema && typeof jsonSchema.screens === 'object') {
        // Go through each screen and get their related properties
        Object.keys(jsonSchema.screens).forEach(screenName => {
            let screen = jsonSchema.screens[screenName];

            if (typeof screen.properties === 'object') {
                Object.keys(screen.properties).forEach(propertyName => {
                    let value = screen.properties[propertyName].value ? screen.properties[propertyName].value : '';

                    // Include the value if missing
                    screen.properties[propertyName] = { ...screen.properties[propertyName], value }
                    formProperties[screenName] = { ...formProperties[screenName], [propertyName]: screen.properties[propertyName] }
                });
            }
            else {
                console.warn('Failed to get screen: ' + screenName + ' properties, expected [properties] "object" instead got "' + typeof screen.properties + '"');
            }
        })
    }
    else {
        console.warn('Failed to get schema properties, expected [screens] "object" instead got "' + typeof jsonSchema.screens + '"');
    }

    return formProperties;
}


/**
 * Function returns an object with the the form data fields and their associated values ('' if no value found).
 *
 * @param {object} properties
 */
export const getFormData = (properties) => {
    let formData = {};

    if (typeof properties === 'object') {
        // Go through each grouping (screen) and get the form data
        Object.keys(properties).forEach(screenName => {
            if (typeof properties[screenName] === 'object') {
                Object.keys(properties[screenName]).forEach(fieldName => {
                    let value = typeof properties[screenName][fieldName].value !== 'undefined' ? properties[screenName][fieldName].value : '';
                    formData[screenName] = { ...formData[screenName], [fieldName]: value }
                })
            }
            else {
                console.warn('Failed to get screen: ' + screenName + ' form data, expected "object" instead got "' + typeof properties[screenName] + '"');
            }
        })
    }
    else {
        console.warn('Failed to get properties form data, expected "object" instead got "' + typeof properties + '"');
    }

    return formData;
}


/**
 * Function returns the form properties which should be hidden | disabled, based on the "customValidation" related to each property.
 * 
 * @param {object} formData 
 * @param {object} formProperties 
 */
export const getCustomValidation = (formData, formProperties) => {
    let fields = {};

    // Go through each form property and check custom validation for the hidden validation
    Object.keys(formProperties).forEach(screenName => {
        Object.keys(formProperties[screenName]).map(fieldName => {
            let field = formProperties[screenName][fieldName];

            if (field.customValidation) {
                Object.keys(field.customValidation).forEach(rule => {
                    if (
                        Array.isArray(field.customValidation[rule].fields) &&
                        Array.isArray(field.customValidation[rule].values)
                    ) {
                        let validationFields = field.customValidation[rule].fields;
                        let validationValues = field.customValidation[rule].values;

                        // Go through each validation field and check if the related fields have the specified value
                        validationFields.forEach((key, index) => {

                            if (typeof formData[fieldName] !== 'undefined' && formData[key] === validationValues[index]) {
                                let defaultValue = field.value !== 'undefined' ? field.value : '';

                                // Add the field name with the rule key
                                if (fields[rule]) {
                                    fields[rule].push(fieldName);
                                }
                                else {
                                    fields[rule] = [fieldName];
                                }

                                // Set back to the default value
                                formData[fieldName] = defaultValue;
                            }
                        })
                    }
                })
            }
        })

    })

    return fields;
}


/**
 * Function updates the schema object with the newly set form data, and returns the updated schema.
 * 
 * @param {object} formData 
 * @param {object} schemaObj 
 */
export const getUpdatedSchema = (formData, schemaObj) => {
    // ***** Exceptions handling ***************************
    if (typeof formData !== 'object') {
        console.warn('Failed to update schema, expected formData "object" instead got "' + typeof formData + '"');
        return schemaObj;
    }

    if (typeof schemaObj !== 'object') {
        console.warn('Failed to update schema, expected schemaObj "object" instead got "' + typeof schemaObj + '"');
        return schemaObj;
    }

    if (Object.keys(formData).length === 0) {
        console.warn('Failed to update schema, form data is empty');
        return schemaObj;
    }

    if (Object.keys(schemaObj.screens).length === 0) {
        console.warn('Failed to update schema, schema does not have any screens');
        return schemaObj;
    }
    // ******************************************************

    let updatedSchema = schemaObj;

    // Go through each screen and set the properties values from the form data
    Object.keys(updatedSchema.screens).forEach(screenName => {
        let screen = updatedSchema.screens[screenName];

        if (typeof screen.properties === 'object') {
            Object.keys(screen.properties).forEach(fieldName => {
                // Set the field value from the form data
                if (typeof formData[screenName] !== 'undefined' && typeof formData[screenName][fieldName] !== 'undefined') {
                    updatedSchema.screens[screenName].properties[fieldName].value = formData[screenName][fieldName];
                }
            })
        }
        else {
            console.warn('Failed to update screen: ' + screenName + ' properties, expected "object" instead got: "' + typeof screen.properties + '"');
        }
    })

    return updatedSchema;
} 