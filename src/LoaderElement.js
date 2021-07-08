import React from "react";
import PropTypes from 'prop-types';
import {Element} from 'react-native-form-generator/src/Element';
import {View} from "react-native";


class LoaderElement extends Element {
	componentDidMount() {
		this.element = this.getElement();
		this.setState({
			ready: true,
		});
	}

	render() {
		const Element = this.element;
		const {library, theme, appearance, ...rest} = this.props;

		return this.element ? (
			<View style={this.styles.container}>
				<Element {...rest} />
			</View>
		) : null;
	}
}


LoaderElement.propTypes = {
	type: PropTypes.string.isRequired,
	title: PropTypes.string,
	subTitle: PropTypes.string,
	library: PropTypes.object,
	theme: PropTypes.object,
	appearance: PropTypes.string,
}


export default LoaderElement;