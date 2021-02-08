import React from 'react';
import propTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const CustomActivityIndicator = ({ loading, ...props }) => {
	return (
		<View>
			<ActivityIndicator animating={loading} {...props} />
		</View>
	)
}

const styles = StyleSheet.create({})

CustomActivityIndicator.propTypes = {}

export default CustomActivityIndicator;
