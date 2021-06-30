import React from 'react'
import PropTypes from 'prop-types'
import Element from "./Element";
import {View} from 'react-native';

class ScreenElement extends Element {

    static propTypes = {
        screens: PropTypes.object.isRequired,
        theme: PropTypes.object,
        type: PropTypes.string.isRequired,
        appearance: PropTypes.string,
        library: PropTypes.object,
        // schema: PropTypes.object.isRequired,
        formProperties: PropTypes.object.isRequired,
        actions: PropTypes.object,
        setCurrentScreen: PropTypes.func,
    }

    componentDidMount() {
        this.element = this.getElement();
        this.setState({
            ready: true,
        });
    }

    render() {
        // Wait for component to be ready
        if (!this.state.ready) return null;

        // Proceed with the render
        const Element = this.element;

        return this.element ? (
            <View style={this.styles.container}>
                <Element {...this.props} />
            </View>
        ) : null;
    }
}

export default ScreenElement;