import React from "react";
import PropTypes from 'prop-types';
import {Text, View} from "react-native";
import Element from "./Element";

class FieldElement extends Element {

	static propTypes = {
		name: PropTypes.string.isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number, PropTypes.object]),
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		type: PropTypes.string.isRequired,
		errors: PropTypes.object.isRequired,
		library: PropTypes.object,
		theme: PropTypes.object,
		hidden: PropTypes.bool,
		disabled: PropTypes.bool,
		form: PropTypes.object.isRequired,
		appearance: PropTypes.string,
		customValidation: PropTypes.object,
	}

	state = {
		hidden: false,
		disabled: false,
		ready: false
	}

	// Field helpers are set from the "form" object and it contains helper functions {setValue, setError, setTouched}
	fieldHelpers = {};

	constructor(props) {
		super(props);
		const {name, form} = props;

		this.fieldHelpers = form.getFieldHelpers(name);
		this.getCustomState = this.getCustomState.bind(this);
	}

	componentDidMount() {
		this.element = this.getElement();
		this.setState({
			ready: true,
		});
	}

	componentDidUpdate(prevProps, prevState) {
		const isHidden = this.getCustomState('hidden');
		const isDisabled = this.getCustomState('disabled');

		if (isHidden != prevState.hidden || isDisabled != prevState.disabled) {
			this.setState({
				hidden: isHidden,
				disabled: isDisabled
			})
		}
	}

	getCustomState(type) {
		const {customValidation, name, form} = this.props;

		if (customValidation && customValidation[name] && customValidation[name][type]) {
			const ruleObject = customValidation[name][type];

			// Go through each fields and validate against the set values
			if (Array.isArray(ruleObject.fields)) {

				for (let index = 0; index < ruleObject.fields.length; index++) {
					let fieldName = ruleObject.fields[index];
					let fieldValue = form.values[fieldName];
					let validValues = Array.isArray(ruleObject.values[index]) ? ruleObject.values[index] : [ruleObject.values[index]];

					if (typeof fieldValue !== 'undefined' && validValues.includes(fieldValue)) {
						return true;
					}
				}
			}
		}

		return false;
	}

	render() {
		// Wait for component to be ready
		if (!this.state.ready) return null;

		// Proceed with the render
		const Element = this.element;
		const {name, value, label, form, ...rest} = this.props;
		const {hidden, disabled} = this.state;
		const errors = form.errors ? form.errors : {};

		return this.element ? (
			<View style={this.styles.container}>
				<Element
					name={name}
					value={value}
					label={label}
					error={errors[name] && errors[name] !== ''}
					errors={errors}
					hidden={hidden}
					disabled={disabled}
					onChangeText={form.handleChange(name)}     // Support for react-native-paper
					changeHandler={form.handleChange(name)}    // Handler passed to custom component (when overriding via library prop)
					fieldHelpers={this.fieldHelpers ? this.fieldHelpers : {}}
					{...rest}
				/>
				{errors && errors[name] && !this.isOverriden ? (
					<Text style={this.styles.error}>{errors[name]}</Text>
				) : null}
			</View>
		) : null;

	}
}


export default FieldElement;