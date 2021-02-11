import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import SignatureScreen from 'react-native-signature-canvas';


const CustomSignatureCapture = ({ text, onOK }) => {
	const ref = useRef();

	const handleSignature = signature => {
		console.log(signature);
		onOK(signature);
	};

	const handleEmpty = () => {
		console.log('Empty');
	}

	const handleClear = () => {
		console.log('clear success!');
	}

	const handleEnd = () => {
		// ref.current.readSignature();
	}

	return (
		<SignatureScreen
			ref={ref}
			onEnd={handleEnd}
			onOK={handleSignature}
			onEmpty={handleEmpty}
			onClear={handleClear}
			autoClear={true}
			descriptionText={text}
		/>
	);
}



const styles = StyleSheet.create({
	sketch: {
		flex: 1,
	},
	sketchContainer: {
		height: '100%',
	},
})


CustomSignatureCapture.propTypes = {}


export default CustomSignatureCapture;
