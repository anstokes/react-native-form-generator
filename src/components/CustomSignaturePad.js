import React, { useRef, useState } from 'react';
import { Modal, View, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import SignatureScreen from 'react-native-signature-canvas';

const CustomSignaturePad = ({ containerProps, changeHandler, name, value, label, errors, hidden, ...props }) => {
	const ref = useRef(null);
	const [visible, setVisible] = useState(false);

	const handleSignature = (signature) => {
		changeHandler(signature);
		setVisible(false);
	};

	const handleEmpty = () => {
		console.log('Empty');
		setVisible(false);
	}

	const handleClear = () => {
		changeHandler('');
		console.log('clear success!');
	}

	const handleEnd = () => {
		// ref.current.readSignature();
	}

	return Platform.OS === 'web' ? (
		<View style={{ marginBottom: 16 }}>
			<Button mode={'contained'} onPress={() => console.log('Missing signature web component')}>Signature Web Component Missing</Button>
		</View>
	) : (
			<View>
				<Modal visible={visible}>
					<SignatureScreen
						ref={ref}
						onEnd={handleEnd}
						onOK={handleSignature}
						onEmpty={handleEmpty}
						onClear={handleClear}
						autoClear={true}
						descriptionText={'Draw signature'}
						{...props}
					/>
				</Modal>
				<View style={{ marginBottom: 16 }}>
					<Button mode={'contained'} onPress={() => setVisible(true)}>{label}</Button>
					{!!value && (
						<Text>Signature Shown Here</Text>
					)}
				</View>
			</View>
		);
}


CustomSignaturePad.propTypes = {}


export default CustomSignaturePad;
