# react-native-form-generator
Form generator using Formik and Yup, which uses a JSON schema to generate form elements, the schema rules are converted into Yup rule using the [@flipbyte/yup-schema](https://github.com/flipbyte/yup-schema) library. See the schemaExamples for examples with simple/advanced validation and form pagination.

## Quick Start Guide:
Once the library is installed, it can be used like so:

### First import the generator
```javascript
import {FormGenerator} from 'react-native-form-generator'
```

### Second prepare a schema (required)
The schema is a JSON schema, and it has the following properties:

Key  | Description | Type
---- | :----------- | :--------:
initialScreen | The key of the screen that is initially shown    | String
screens       | Object with screens ("screen1": {...properties}) | Object


- Each screen in the screens object can have the following:

Key | Description | Type               | Required
--- | :----------- | :----------------: | :------:
title                 | The title of the current form screen, optional.                    	| String           | False
description           | The description of the current form screen. optional               	| String           | False
navigateOnSubmit      | String or Object to redirect on submit, see paginatedSchemaExample.	| String or Object | False
contentContainerStyle | Style for the entire form elements wrapper 													| Object           | False
alwaysShowActions     | If true then it will render the actions outside of the scrollView  	| Boolean          | False
actions               | Object with actions for the current screen. 												| Object           | True
properties            | Object with form elements. 																					| Object 					 | True

If a custom end screen is required to handle the final submit, or to display some information to the user, then it should be included with the "end" key. The redirect to this screen can be handled in the navigateOnSubmit, or the "navigateTo" property of action buttons. 


- Each action in the actions object can have the following:

Key    | Description  | Type       | Required
------ | :------------ | :--------: | :------:
type   			| The type of the action button, should match the component in the library. | String | True
action 			| The action name which is passed to the handler. 													| String | True
label  			| The label of the action button. 																					| Object | True
navigateTo 	| The name of the screen to navigate to on button press. If no "navigateTo" is provided then the "navigateOnSubmit" will be used to get the redirect screen. | String | False
props  			| Any other objects which are passed to the custom component. 							| Object | False

- Each property in the properties object can have the following:

Key               | Description | Type       | Required
----------------- | :----------- | :--------: | :------:
type              | The type of the form element, should match the component in the library.  | String | True
value             | The initial value of the element.                                         | String | True
label             | The label of the element.                                                 | Object | True
validation        | The validation rules which are converted to Yup rules.                    | Object | False
customValidation  | Custom validation rules for "hidden", "disabled" properties.              | Object | False
props             | Any other props which are passed to the custom component.                 | Object | False

### Third prepare custom library (required)
The library is an object with the custom components used to render the form elements/controls. The keys match to the "type" property in the schema.

```javascript
const library = {
	string: CustomTextInput,
	radio: CustomRadioButton,
	submit: CustomSubmitButton,
	cancel: CustomActionButton,
	camera: CustomCamera,
	...
}
```

### Lastly have a submitHandler (required)
The submitHandler callback is sent to all form action buttons, and it depends on the user to implement what to happen. It gets called by the form asynchronously and the form runs the validation rules every time the submit action happens. The callback receives the following arguments:
- The values of the submitted form.
- The updated schema with the new values.

### Use <FormGenerator /> component
Finally our form can be generated:

```javascript
<FormGenerator 
	library={library}
	schema={schema}
	submitHandler={submitHandler}
	validateOnChange={true} // false by default
	validateOnMount={true} 	// false by default
	theme={useTheme()}      // Currently the theme is only used to display errors when the components are missing from the library
	navigation={navigation} // The navigation.navigate() function is used when a screen is not found in the schema.
/>
```



