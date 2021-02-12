import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { Audio } from 'expo-av';

const CustomAudioRecorder = ({ label }) => {
	const [recording, setRecording] = React.useState();

	async function startRecording() {
		try {
			console.log('Requesting permissions..');
			await Audio.requestPermissionsAsync();
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
			});
			console.log('Starting recording..');
			const recording = new Audio.Recording();
			await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
			await recording.startAsync();
			setRecording(recording);
			console.log('Recording started');
		} catch (err) {
			console.error('Failed to start recording', err);
		}
	}

	async function stopRecording() {
		console.log('Stopping recording..');
		setRecording(undefined);
		await recording.stopAndUnloadAsync();
		const uri = recording.getURI();
		console.log('Recording stopped and stored at', uri);
	}

	return Platform.OS === 'web' ? (
		<View style={{ marginBottom: 16 }}>
			<Button mode={'contained'} onPress={() => console.log('Missing recorder web component')}>Recorder Web Component Missing</Button>
		</View>
	) : (
			<View style={{ marginBottom: 16 }}>
				<Button
					mode={'contained'}
					onPress={recording ? stopRecording : startRecording}
				>{recording ? 'Stop Recording' : 'Start Recording'}</Button>
			</View>
		);
}


CustomAudioRecorder.propTypes = {
	label: PropTypes.string,
}


export default CustomAudioRecorder;