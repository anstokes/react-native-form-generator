import React from "react";
import PropTypes from 'prop-types';
import {Element} from './Element';
import {View} from "react-native";


class TextElement extends Element {
	componentDidMount() {
		this.element = this.getElement();
		this.setState({
			ready: true,
		});
	}

	render() {
		const Element = this.element;
		const {value, type, errors, library, theme, appearance, ...rest} = this.props;
		const typeStyle = this.styles[type] ? this.styles[type] : '';

		return this.element ? (
			<View style={this.styles.container}>
				<Element style={[this.styles.text, typeStyle]} {...rest}>{value}</Element>
			</View>
		) : null;
	}
}


TextElement.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.object,]).isRequired,
	type: PropTypes.string.isRequired,
	errors: PropTypes.object.isRequired,
	library: PropTypes.object,
	theme: PropTypes.object,
	appearance: PropTypes.string,
	endReached: PropTypes.bool.isRequired,
	setCurrentScreen: PropTypes.func.isRequired,
	canReview: PropTypes.bool.isRequired,
}


export default TextElement;