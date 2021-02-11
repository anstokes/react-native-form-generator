import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';

const CustomAudioRecorder = ({ label }) => {
	const [audioObj, setAudioObj] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	async function startRecording() {
		try {
			console.log('Requesting permissions..');
			await Permissions.askAsync(Permissions.AUDIO_RECORDING);
			console.log('Starting recording..');
			const audio = new Audio.Recording();
			await audio.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
			console.log(recording);
			await audio.startAsync();
			setIsRecording(true);
			setAudioObj(audio);
			console.log('Recording started');
		} catch (err) {
			console.error('Failed to start recording', err);
		}
	}

	async function stopRecording() {
		console.log('Stopping recording..');
		await audioObj.stopAndUnloadAsync();
		const uri = audioObj.getURI();
		setIsRecording(false);
		console.log('Recording stopped and stored at', uri);
	}

	return (
		<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
			<Text>{label}</Text>
			<Button
				mode={'contained'}
				onPress={isRecording ? stopRecording : startRecording}
			>{isRecording ? 'Stop Recording' : 'Start Recording'}</Button>
		</View>
	);
}


CustomAudioRecorder.propTypes = {
	label: PropTypes.string,
}


export default CustomAudioRecorder;