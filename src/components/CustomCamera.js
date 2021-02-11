import React, { useState, useEffect } from 'react';
import * as Permissions from "expo-permissions";
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Button } from 'react-native-paper';

const CustomCamera = () => {
	const [camera, setCamera] = useState(null);
	const [showCamera, setShowCamera] = useState(false);
	const [hasPermission, setHasPermission] = useState(null);
	const [type] = useState(Camera.Constants.Type.front);

	useEffect(() => {
		if (showCamera) {
			(async () => {
				const { status } = await Permissions.askAsync(Permissions.CAMERA);
				setHasPermission(status === 'granted');
			})();
		}
	}, [showCamera]);


	const takePicture = () => {
		if (camera) {
			camera.takePictureAsync({ onPictureSaved: handleSave });
		}
	}

	const handleSave = (photo) => {
		console.log(photo);
	}


	if (showCamera && hasPermission === null) {
		return <View />;
	}

	if (showCamera && hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			{showCamera ? (
				<Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							onPress={() => {
								setShowCamera(!showCamera);
							}}>
							<Text style={styles.text}> Close </Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={takePicture}>
							<Text style={styles.text}> Snap Pic </Text>
						</TouchableOpacity>
					</View>
				</Camera>
			) : (
					<Button mode={'contained'} onPress={() => setShowCamera(!showCamera)}>Take Picture</Button>
				)}
		</View>
	);
}


CustomCamera.propTypes = {};


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	camera: {
		flex: 1,
		minHeight: 300
	},
	buttonContainer: {
		backgroundColor: 'transparent',
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 20,
	},
	button: {
		flex: 0.1,
		alignSelf: 'flex-end',
		alignItems: 'center',
	},
	text: {
		fontSize: 18,
		color: 'white',
	},
});


export default CustomCamera;
