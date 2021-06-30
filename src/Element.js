import {Component} from 'react'
import PropTypes from 'prop-types'
import {StyleSheet, Platform} from 'react-native';
import * as PaperComponents from './lib/react-native-paper';
import * as CustomComponents from './lib/custom';

export class Element extends Component {

	static propTypes = {
		theme: PropTypes.object,
		type: PropTypes.string.isRequired,
		appearance: PropTypes.string,
		library: PropTypes.object,
		containerStyle: PropTypes.object,
	}

	state = {
		ready: false
	}

	isOverriden = false;
	styles = {};
	element = null;

	constructor(props) {
		super(props);
		this.getElement = this.getElement.bind(this);
		this.getCustomElement = this.getCustomElement.bind(this);
		this.styles = useStyles(props.theme, props.containerStyle);
	}


	getCustomElement() {
		const {type, appearance} = this.props;
		const nameMappings = {
			'title': 'CustomTitle',
			'description': 'CustomDescription',
			'string': 'CustomTextInput',
			'select': 'CustomSelect',
			'date': 'CustomDateTimePicker',
			'date_web': 'CustomDatePickerWeb',
			'checkbox': 'CustomCheckbox',
			'switch': 'CustomSwitch',
			'radio': 'CustomRadio',
			'action': 'Button',
			'submit': 'Button',
			'reviewScreen': 'ReviewScreen',
		};
		const appearanceMappings = {
			'react-native-paper': PaperComponents
		};

		// Set the component based on the appearance mappings
		if (nameMappings[type]) {
			let newName = nameMappings[type];

			// Override date type for web
			if (type == 'date' && Platform.OS == 'web') {
				newName = nameMappings['date_web'];
			}

			if (appearanceMappings[appearance] && appearanceMappings[appearance][newName]) {
				console.log('Getting "' + type + '" component from "' + appearance + '" library');
				return appearanceMappings[appearance][newName];
			}

			// Try to find in the custom library
			if (CustomComponents[newName]) {
				console.log('Getting "' + type + '" component from "custom" library');
				return CustomComponents[newName];
			}
		}

		return null;
	}


	getElement() {
		const {type, library} = this.props;
		let CustomElement = this.getCustomElement();

		// Get component based on the library set
		if (library && library[type]) {
			this.isOverriden = true;
			CustomElement = library[type];
		}

		// Return custom element if set, otherwise return native element
		return CustomElement ? CustomElement : null;
	}
}


const useStyles = (theme, overrides) => {
	return StyleSheet.create({
		container: {
			...overrides,
			padding: 8,
		},
		text: {
			color: theme && theme.colors && theme.colors.text ? theme.colors.text : 'black',
			fontFamily: theme && theme.fonts && theme.fonts.regular && theme.fonts.regular.fontFamily ? theme.fonts.regular.fontFamily : "Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif"
		},
		title: {
			fontSize: 18,
			marginBottom: 8
		},
		description: {
			marginBottom: 8
		},
		error: {
			padding: 8,
			color: theme.colors.error
		}
	})
}


export default Element
