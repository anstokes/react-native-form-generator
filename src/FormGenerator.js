import React, {Component} from 'react';
import {ScrollView, View, Keyboard, TouchableWithoutFeedback, StyleSheet, KeyboardAvoidingView, BackHandler, Platform} from 'react-native';
import {Text, Provider as PaperProvider} from 'react-native-paper';
import PropTypes from 'prop-types';

// Fast object comparison
const isEqual = require("react-fast-compare");

// Import: Formik dependencies
import {Formik} from 'formik';
import Rules from "@flipbyte/yup-schema";

// Import: Utilities
import {
	ensureFunctionAndRegex,
	debounce
} from './utils';

// Import: Components
import FieldElement from './FieldElement';
import ActionButton from './ActionButton';
import TextElement from './TextElement';
import ScreenElement from './ScreenElement';
import LoaderElement from './LoaderElement';


const supportedAppearances = ['react-native-paper'];


class FormGenerator extends Component {
    _formikRef = React.createRef();
    
	static propTypes = {
		schema: PropTypes.object.isRequired,
		appearance: PropTypes.oneOf(supportedAppearances),
		library: PropTypes.object.isRequired,
		validateOnChange: PropTypes.bool,
		validateOnMount: PropTypes.bool,
		submitHandler: PropTypes.func.isRequired,
		// translationHandler: PropTypes.func,
		theme: PropTypes.object,
		navigation: PropTypes.object,
		children: PropTypes.object,
		debugMode: PropTypes.bool,
	}

	state = {
		appearance: 'react-native-paper',
		initialScreen: '',
		previousScreen: [],
		currentScreen: '',
		screenDetails: {
			title: null,
			description: null,
			contentContainerStyle: null
		},
		formProperties: {},
		formActions: false,
		formData: {},
		formValues: {},
		validationSchema: {},
		customValidation: {},
		endReached: false,
		canReview: false,
		library: {},
		theme: {}
	};

	defaultContentContainerStyle = {
		flex: 1
	}

	static getDerivedStateFromProps(props, state) {
		const {appearance} = props;

		if (appearance && supportedAppearances.includes(appearance)) {
			state.appearance = appearance;
		}

		return state;
	}

	constructor(props) {
		super(props);

		this.styles = useStyles();
		this.endScreen = props.schema && props.schema.screens && props.schema.screens.endScreen ? props.schema.screens.endScreen : {};
		this.getProperties = this.getProperties.bind(this);
		this.getActions = this.getActions.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.getRoute = this.getRoute.bind(this);
		this.getInitialScreen = this.getInitialScreen.bind(this);
		this.screenChange = this.screenChange.bind(this);
		this.backAction = this.backAction.bind(this);
		BackHandler.removeEventListener('hardwareBackPress', this.backAction);
	}

	// On mount set the screen details, form properties, validation schema, form data, current screen, and end screen details.
	componentDidMount() {
		const {schema} = this.props;

		if (schema.screens) {
			let properties = this.getProperties(false, false);
			let initialScreen = this.getInitialScreen();
			let formData = this.getFormData(properties);
			let screenTitle = schema.screens[initialScreen] && schema.screens[initialScreen].title;
			let screenDescription = schema.screens[initialScreen] && schema.screens[initialScreen].description;
			
			// Use the backAction handler to handle the hardware "back" action (android only)
			if (Platform.OS === 'android') {
				BackHandler.addEventListener('hardwareBackPress', this.backAction);
			}

			this.setState({
				initialScreen: initialScreen,
				previousScreen: [initialScreen],
				currentScreen: initialScreen,
				canReview: schema.canReview ? true : false,
				screenDetails: {
					title: screenTitle,
					description: screenDescription,
					contentContainerStyle: schema.screens[initialScreen] && schema.screens[initialScreen].contentContainerStyle ? schema.screens[initialScreen].contentContainerStyle : {}
				},
				formProperties: properties,
				formActions: this.getActions(),
				formData: formData,
				validationSchema: this.prepareValidationSchema(properties),
				customValidation: this.getCustomValidation(properties),
			});
		}		
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const {currentScreen, formActions, formData} = this.state;
		const {schema} = this.props;

		try {
			// Throw warning if there is not current screen
			if (!currentScreen) {
				throw new Error('Expected current screen type "string", instead got "' + typeof currentScreen + '"');
			}

			// Throw warning if current screen has not changed
			if (currentScreen === prevState.currentScreen) {
				//throw new Error('Screen has not changed');
			}

			// Throw warning if current screen is not found in the schema screens
			if (!schema.screens[currentScreen]) {
				throw new Error('Missing current screen "' + currentScreen + '" from schema');
			}
            
            // Ensure form updates when schema changes
            if (!isEqual(prevProps.schema, schema)) {
				debounce(this.componentDidMount, this);
                // this.componentDidMount();
                if (this._formikRef.current && typeof (this._formikRef.current.validateForm) === 'function') {
					debounce(this._formikRef.current.validateForm, this);
                }
            }

			// Update when the current screen changes
			let title = schema?.screens[currentScreen]?.title ? schema.screens[currentScreen].title : null;
			let description = schema?.screens[currentScreen]?.description ? schema.screens[currentScreen].description : null;
			let contentContainerStyle = schema?.screens[currentScreen]?.contentContainerStyle ? schema.screens[currentScreen].contentContainerStyle : this.defaultContentContainerStyle;
			let formValues = formData[currentScreen] ? formData[currentScreen] : {};
			let updatedState = {};
			let compareState = {};

			// Use end screen details (which can change) if end reached
			if (currentScreen === 'endScreen' && Object.keys(this.endScreen).length) {
				title = this.endScreen?.title ? this.endScreen.title : title;
				description = this.endScreen?.description ? this.endScreen.description : description;
				contentContainerStyle = this.endScreen?.contentContainerStyle ? this.endScreen.contentContainerStyle : contentContainerStyle;
				updatedState.endReached = true;
				updatedState.formActions = {...formActions, end: this.endScreen.actions ? this.endScreen.actions : {}};
				
				compareState.endReached = prevState.endReached;
				compareState.formActions = prevState.formActions;
			}

			// Set the current screen details and form values
			updatedState = {...updatedState, formValues, screenDetails: {title, description, contentContainerStyle}};
			compareState = {...compareState, formValues: prevState.formValues, screenDetails: prevState.screenDetails};
			
			// Set the updated state
			if (!isEqual(compareState, updatedState)) {
				this.setState(updatedState);
			}
		} catch (e) {
			if (this.props.debugMode) {
				console.warn('Form generator state changed with warning: ' + e.message);
			}
		}
	}
	
	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.backAction);
	}
	
	/**
	 *  The back handler attaches to the "hardwareBackPress" event.
	 *	Returning false will allow the default navigation to work.
	 * @returns {Boolean}
	 */
	 backAction() {
		// If current screen is the initial one then allow the default "back" action
		if (this.state.currentScreen === this.state.initialScreen) {
			return false;
		}
		
		this.screenChange('back');
		return true;
	}
	
	screenChange(action, screen = false) {
		const {currentScreen, previousScreen, formData} = this.state;
		const currentValues = this._formikRef?.current?.values ?? {};
		const allData = {...formData, [currentScreen]: {...currentValues}};
		var newState = {formData: allData};
						
		// Keep the form data fresh before changing screen
		// Support next/back actions via array push/pop
		switch (action) {
			case 'submit':
			case 'next':
				newState = {
					...newState,
					previousScreen: [...previousScreen, currentScreen],
					currentScreen: screen
				}
				break;
				
			case 'back':
				newState = {
					...newState,
					previousScreen: previousScreen.slice(0, -1),
					currentScreen: previousScreen[previousScreen.length - 1]
				}
				break;
		
			default:
				break;
		}
		
		this.setState(newState);
	}


	// Function Converts the schema properties validation rules to yup rules, and returns the converted rules associated under their related screens.
	// Also, it initializes any functions to work with yup.
	prepareValidationSchema(properties) {
		let validationSchema = {};

		if (properties && typeof properties === 'object') {
			Object.keys(properties).forEach(screenName => {
				// Set the validation rules for each property (field)
				if (typeof properties[screenName] === 'object') {
					Object.keys(properties[screenName]).forEach(propertyName => {
						const property = properties[screenName][propertyName];

						if (property.type == 'group' && property.properties) {
							Object.keys(property.properties).forEach(groupedPropertyName => {
								const groupedProperty = property.properties[groupedPropertyName];

								// Ensure the function and regex objects are converted
								if (groupedProperty.validation) {
									// Ensure the function and regex rules are converted
									ensureFunctionAndRegex(groupedProperty.validation);
									validationSchema[screenName] = {...validationSchema[screenName], [groupedPropertyName]: groupedProperty.validation};
								}
							})
						}
						else if (property.validation) {
							// Ensure the function and regex objects are converted
							ensureFunctionAndRegex(property.validation)
							validationSchema[screenName] = {...validationSchema[screenName], [propertyName]: property.validation};
						}
					})
				}
				else if (this.props.debugMode) {
					console.warn('Failed to prepare screen "' + screenName + '" validation, expected "object" instead got "' + typeof properties[screenName] + '"');
				}

				// Convert the validation rules to yup rules
				if (typeof validationSchema[screenName] === 'object') {
					// Only convert if there are validation rules for the current screen
					if (Object.keys(validationSchema[screenName]).length) {
						validationSchema[screenName] = new Rules([['object'], ['shape', validationSchema[screenName]]]).toYup();
					}
					else if (this.props.debugMode) {
						console.warn('Failed to convert screen "' + screenName + '" validation rules to yup, no validation rules found');
					}
				}
				else if (this.props.debugMode) {
					console.warn('Failed to convert screen "' + screenName + '" validation rules to yup, expected "object" instead got "' + typeof validationSchema[screenName] + '"');
				}
			})
		}

		return validationSchema;
	}


	//Function returns an object with the the form data fields and their associated values ('' if no value found).
	getFormData(properties) {
		let formData = {};

		if (typeof properties === 'object') {
			// Go through each grouping (screen) and get the form data
			Object.keys(properties).forEach(screenName => {
				if (typeof properties[screenName] === 'object') {
					Object.keys(properties[screenName]).forEach(fieldName => {
						const property = properties[screenName][fieldName];

						if (property.type && property.type == 'group' && property.properties) {
							Object.keys(property.properties).forEach(groupedPropertyName => {
								const groupedProperty = property.properties[groupedPropertyName];
								formData[screenName] = {...formData[screenName], [groupedPropertyName]: (typeof (groupedProperty.value) !== 'undefined' ? groupedProperty.value : '')};
							})
						}
						else {
							formData[screenName] = {...formData[screenName], [fieldName]: (typeof (property.value) !== 'undefined' ? property.value : '')}
						}
					})
				}
				else if (this.props.debugMode) {
					console.warn('Failed to get screen: ' + screenName + ' form data, expected "object" instead got "' + typeof properties[screenName] + '"');
				}
			})
		}
		else if (this.props.debugMode) {
			console.warn('Failed to get properties form data, expected "object" instead got "' + typeof properties + '"');
		}

		return formData;
	}


	//Function returns the form properties which should be hidden | disabled, based on the "customValidation" related to each property.
	getCustomValidation(properties) {
		let fields = {};

		// Go through each form property and check custom validation for the hidden validation
		Object.keys(properties).forEach(screenName => {
			Object.keys(properties[screenName]).map(fieldName => {
				let field = properties[screenName][fieldName];

				if (field.customValidation) {
					fields[screenName] = {...fields[screenName], [fieldName]: field.customValidation}
					fields[screenName][fieldName] = field.customValidation;
				}
			})

		})

		return fields;
	}


	getInitialScreen() {
		const {schema} = this.props;

		if (typeof schema.initialScreen === 'string') {
			return schema.initialScreen;
		}

		if (Object.keys(schema.screens).length) {
			return Object.keys(schema.screens)[0];
		}

		if (this.props.debugMode) {
			console.error('Schema initial screen is missing.');
		}
	}


	getActions() {
		const {schema} = this.props;
		let formActions = {};

		if (schema && typeof schema.screens === 'object') {
			// Go through each screen and get their related properties
			Object.keys(schema.screens).forEach(screenName => {
				let screen = schema.screens[screenName];

				if (screen.actions && typeof screen.actions === 'object') {
					Object.keys(screen.actions).forEach(actionName => {
						let action = screen.actions[actionName];
						formActions[screenName] = {...formActions[screenName], [actionName]: action}
					});
				}
				else if (this.props.debugMode) {
					console.warn('Failed to get screen "' + screenName + '" actions, expected "object" instead got "' + typeof screen.actions + '"');
				}
			})
		}
		else if (this.props.debugMode) {
			console.warn('Failed to get schema screens actions, expected "object" instead got "' + typeof schema.screens + '"');
		}

		return formActions;
	}


	getRoute(data, navigateOnSubmit) {
		if (navigateOnSubmit) {
			// Get the "function" result if found in data
			if (typeof navigateOnSubmit === 'object' && navigateOnSubmit.function && navigateOnSubmit.function.args && navigateOnSubmit.function.body) {
				let newFunc = new Function(navigateOnSubmit.function.args, navigateOnSubmit.function.body);
				if (typeof newFunc === 'function') {
					navigateOnSubmit = newFunc(data);
				}
			}

			// Set the end screen details and action buttons
			if (typeof navigateOnSubmit === 'object' && typeof navigateOnSubmit.screen !== 'undefined') {
				if (Object.keys(this.endScreen).length) {
					// Set end screen details along with the route name
					let endScreenData = {
						title: navigateOnSubmit.routeParams.title ? navigateOnSubmit.routeParams.title : this.endScreen.title,
						description: navigateOnSubmit.routeParams.description ? navigateOnSubmit.routeParams.description : this.endScreen.description,
						actions: {}
					};

					Object.keys(this.endScreen.actions).forEach(key => {
						if (typeof navigateOnSubmit.routeParams.actions === 'undefined' || navigateOnSubmit.routeParams.actions.includes(key)) {
							endScreenData.actions[key] = this.endScreen.actions[key];
						}
					});

					this.endScreen = endScreenData;

					navigateOnSubmit = navigateOnSubmit.screen;

					return navigateOnSubmit;
				}
			}

			return navigateOnSubmit;
		}
		else {
			if (this.props.debugMode) {
				console.error('Navigation route could not be determined');
			}
			return ['route_error', false];
		}
	}


	//Function returns all of the properties with their associated screen name.
	getProperties(data = false, properties = false) {
		const {schema} = this.props;
		let formProperties = {};

		try {
			if (properties) {
				if (typeof properties !== 'object') {
					throw new Error('Error while setting the form properties, expected object instead found: ' + typeof properties)
				}

				// Go through each property, check if value and name is set, and apply translation
				Object.keys(properties).forEach(propertyName => {
					let property = properties[propertyName];

					// Ensure the name property is set
					property.name = property.name ?? propertyName;

					// Recursive call to get the properties from the group
					if (property.type && property.type == 'group') {
						if (property.properties) {
							property.properties = this.getProperties((data ?? false), property.properties);
							formProperties = {...formProperties, [propertyName]: property};
						}
					}
					else {
						// Ensure the value property is set by default
						property.value = property.value ?? '';

						if (typeof (data[propertyName]) !== 'undefined') {
							property.value = data[propertyName];
						}

						formProperties[propertyName] = property;
					}
				})
			}
			else if (schema && schema.screens) {
				if (typeof schema !== 'object') {
					throw new Error('Error while setting the screen properties, expected object instead found: ' + typeof jsonSchema.screens)
				}

				// Go through each screen and get their related properties
				Object.keys(schema.screens).forEach(screenName => {
					let screen = schema.screens[screenName];
					if (screen.properties) {
						formProperties[screenName] = {...this.getProperties((data[screenName] ?? false), screen.properties)}
					}
				})
			}
		} catch (e) {
			if (this.props.debugMode) {
				console.error('Error encountered while getting form properties/groups: ' + (e.message ? e.message : 'No error message'));
			}
		}

		return formProperties;
	}


	async handleFormSubmit(values) {
		const {submitHandler, schema, navigation} = this.props;
		const {currentScreen, previousScreen, formData} = this.state;
		const navigationRoutes = typeof (navigation?.dangerouslyGetState) === 'function' ? navigation.dangerouslyGetState().routeNames : [];

		// Run the submit callback with the form data and the updated schema
		if (currentScreen) {
			let data = {...formData, [currentScreen]: values};
			// Remember the form data state change
			let updatedState = {
				formData: data
			};

			// Run submit handler callback, and redirect user
			if (typeof submitHandler === 'function') {
				let navigateOnSubmit = schema.screens[currentScreen] && schema.screens[currentScreen].navigateOnSubmit ? schema.screens[currentScreen].navigateOnSubmit : false;

				if (navigateOnSubmit) {
					navigateOnSubmit = this.getRoute(data, navigateOnSubmit);
				}

				if (this.props.debugMode) {
					console.log('Submitting form...');
				}
				await submitHandler(data);

				// Redirect user to screen in form
				if (typeof navigateOnSubmit == 'string' && Object.keys(schema.screens).includes(navigateOnSubmit)) {
					if (this.props.debugMode) {
						console.log('Navigating to form screen named: ' + navigateOnSubmit);
					}

					this.setState({
						previousScreen: [...previousScreen, currentScreen],
						currentScreen: navigateOnSubmit
					})
				}
				else if (Array.isArray(navigationRoutes) && navigationRoutes.includes(navigateOnSubmit)) {
					// Otherwise navigate to app route
					if (this.props.debugMode) {
						console.log('Navigating to app screen named: ' + navigateOnSubmit);
					}
					navigation.navigate(navigateOnSubmit);
				}
			}

			// Update the state
			this.setState({...updatedState});
		}
	}

	render() {
		const {validateOnChange, validateOnMount, schema} = this.props;
		const {formValues, validationSchema, currentScreen} = this.state;

		return schema.screens[currentScreen] ? (
			<PaperProvider theme={this.props?.theme ?? {}}>
				<Formik
                    innerRef={this._formikRef}
					initialValues={formValues}
					enableReinitialize={true}
					validationSchema={validationSchema[currentScreen] ? validationSchema[currentScreen] : null}
					onSubmit={async (values, actions) => this.handleFormSubmit(values, actions)}
					validateOnChange={typeof validateOnChange === 'undefined' ? true : validateOnChange}
					validateOnMount={typeof validateOnMount === 'undefined' ? true : validateOnMount}
				>
					{(form) => {
						const {values, isSubmitting} = form;
						const {screenDetails, appearance, currentScreen, formActions, formData, customValidation, formProperties, previousScreen, canReview, endReached} = this.state;
						const {theme, library, schema} = this.props;
						const screenProperties = formProperties[currentScreen] ? formProperties[currentScreen] : false;

						// Return submitting loader/text
						if (isSubmitting) {
							return (
								<LoaderElement 
									type={'loader'} 
									subTitle={'Submitting'}
									library={library}
									theme={theme}
									appearance={appearance}
								/>
							)
						}

						return (
							<KeyboardAvoidingView
								behavior={'padding'}
								style={{flex: 1}}
								keyboardVerticalOffset={-200}
							>
								<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
									<ScrollView contentContainerStyle={screenDetails.contentContainerStyle ? StyleSheet.create({...screenDetails.contentContainerStyle}) : {}}>

										{/* Current screen title and description if set */}
										{typeof screenDetails === 'object' && Object.keys(screenDetails).map(key => {
											return ['title', 'description'].includes(key) && screenDetails[key] ? (
												<TextElement
													key={key}
													value={screenDetails[key] ? screenDetails[key] : ''}
													endReached={endReached}
													setCurrentScreen={(action, screen) => this.screenChange(action, screen)}
													canReview={canReview}
													type={key}
													errors={form.errors}
													library={library}
													theme={theme}
													appearance={appearance}
												/>
											) : null;
										})}

										{/* Review screen */}
										{currentScreen == 'endScreen' && canReview && (
											<ScreenElement
												screens={schema.screens}
												theme={theme}
												type={'reviewScreen'}
												appearance={appearance}
												library={library}
												formProperties={this.getProperties({...formData, [currentScreen]: values})}
												setCurrentScreen={(action, screen) => this.screenChange(action, screen)}
											/>
										)}

										{/* Current screen inputs */}
										{Object.keys(values).length > 0 && screenProperties && Object.keys(screenProperties).map(propertyName => {
											const fieldObject = screenProperties[propertyName];
											const isGroup = fieldObject.type && fieldObject.type == 'group';
											const {name, type, props} = fieldObject;
											const containerStyle = props && props.containerStyle ? StyleSheet.create({...props.containerStyle}) : null;

											if (isGroup) {
												const {title, description} = fieldObject;

												// Add gouped inputs with wrapper. Also, show group title/description if set
												return (
													<View key={name} {...props}>
														{title && (
															<TextElement
																key={name + '_title'}
																value={title}
																type={'title'}
																errors={form.errors}
																library={library}
																theme={theme}
																appearance={appearance}
															/>
														)}

														{description && (
															<TextElement
																key={name + '_description'}
																value={description}
																type={'description'}
																errors={form.errors}
																library={library}
																theme={theme}
																appearance={appearance}
															/>
														)}

														{Object.keys(fieldObject.properties).map(groupedPropertyName => {
															const {name, type, label, props} = fieldObject.properties[groupedPropertyName];

															return (
																<FieldElement
																	key={name}
																	type={type}
																	name={name}
																	label={label}
																	value={typeof(values[name]) !== 'undefined' ? values[name] : ''}
																	errors={form.errors}
																	customValidation={customValidation[currentScreen] ? customValidation[currentScreen] : {}}
																	library={library}
																	theme={theme}
																	form={form}
																	appearance={appearance}
																	{...props}
																/>
															)
														})}
													</View>
												)
											}
											else {
												const {label} = fieldObject;

												return (
													<FieldElement
														key={name}
														type={type}
														name={name}
														label={label}
														value={typeof(values[name]) !== 'undefined' ? values[name] : ''}
														errors={form.errors}
														customValidation={customValidation[currentScreen] ? customValidation[currentScreen] : {}}
														library={library}
														theme={theme}
														form={form}
														appearance={appearance}
														containerStyle={containerStyle}
														{...props}
													/>
												);
											}
										})}

										{/* Current screen actions*/}
										{!schema.screens[currentScreen].alwaysShowActions && (
											<View style={this.styles.actionsWrapper}>
												{formActions[currentScreen] && Object.keys(formActions[currentScreen]).map(actionName => {
													const button = formActions[currentScreen][actionName];
													const allData = {...formData, [currentScreen]: {...values}};

													let navigateOnSubmit = schema.screens[currentScreen].navigateOnSubmit ? schema.screens[currentScreen].navigateOnSubmit : false;
													if (navigateOnSubmit) {
														navigateOnSubmit = this.getRoute(allData, navigateOnSubmit);
													}

													let navigateTo = button.navigateTo ? this.getRoute(allData, button.navigateTo) : previousScreen[previousScreen.length - 1];

													return button ? (
														<ActionButton
															key={actionName}
															form={{
																...form,
																allData: allData,
																// navigateOnSubmit,
																currentScreen,
																previousScreen,
															}}
															setCurrentScreen={(action, screen) => this.screenChange(action, screen)}
															navigateTo={navigateTo}
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
										)}
									</ScrollView>
								</TouchableWithoutFeedback>
								{/* Current screen actions if alwaysShowActions is set to true */}
								{schema.screens[currentScreen].alwaysShowActions && (
									<View style={this.styles.actionsWrapper}>
										{formActions[currentScreen] && Object.keys(formActions[currentScreen]).map(actionName => {
											let button = formActions[currentScreen][actionName];
											let navigateOnSubmit = schema.screens[currentScreen].navigateOnSubmit && schema.screens[currentScreen].navigateOnSubmit;
											let allData = {...formData, [currentScreen]: {...values}};

											return button ? (
												<ActionButton
													key={actionName}
													form={{
														...form,
														allData: allData,
														navigateOnSubmit,
														currentScreen,
														previousScreen,
													}}
													setCurrentScreen={(action, screen) => this.screenChange(action, screen)}
													navigateTo={button.navigateTo ? button.navigateTo : () => this.getRoute(allData, navigateOnSubmit)}
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
								)}
								
								{this.props.children ? (
									<View>
										{this.props.children}
									</View>
								) : null}
							</KeyboardAvoidingView>
						);
					}}
				</Formik>
			</PaperProvider>
		) : null;
	}
}


const useStyles = () => ({
	actionsWrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});


FormGenerator.propTypes = {
	...FormGenerator.propTypes
}


export default FormGenerator;