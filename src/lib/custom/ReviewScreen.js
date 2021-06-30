import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

// Import: components
import {View, StyleSheet} from 'react-native';
import {Text, Subheading, Divider, Button} from 'react-native-paper';


const ReviewGroup = ({fields, title, screenName, theme, setCurrentScreen}) => {
	const styles = useStyles(theme);
	const label = 'Change';

	return (
		<View style={styles.group_wrapper}>
			{/* Group header */}
			{title && (
				<Fragment>
					<View style={styles.title_wrapper}>
						{/* Group title */}
						<Subheading style={styles.title}>{title}</Subheading>

						{/* Edit screen button */}
						{setCurrentScreen && (
							<Button mode={'text'} onPress={() => setCurrentScreen(screenName)} compact={true} color={theme.colors.button.primary}>{label}</Button>
						)}
					</View>

					<Divider />
				</Fragment>
			)}


			{/* Group rows */}
			{Object.keys(fields).map(fieldName => {
				const fieldObj = fields[fieldName];
				const ignore = ['object', 'function'].includes(typeof (fieldObj.label)) || ['object', 'function'].includes(typeof (fieldObj.value));

				return ignore ? null : (
					<ReviewRow
						key={fieldObj.name}
						label={fieldObj.label}
						value={fieldObj.value}
						theme={theme}
					/>
				);
			})}
		</View>

	);
}


const ReviewRow = ({label, value, theme}) => {
	const styles = useStyles(theme);
	label = label ?? 'Missing Label';

	if (typeof (value) === 'boolean') {
		value = value ? 'Yes' : 'No';
	}

	return value ? (
		<View style={styles.row_wrapper}>
			<Text>{label}:</Text>
			<Text>{value}</Text>
		</View>
	) : null;
}


const ReviewScreen = ({screens, formProperties, theme, setCurrentScreen}) => {
	return formProperties ? (
		<Fragment>
			{
				Object.keys(formProperties).map(screenName => {
					const properties = formProperties[screenName];
					const screen = screens[screenName] ?? {};

					return properties && Object.keys(properties).length ? (
						<ReviewGroup
							key={screenName}
							title={screen.title ?? false}
							screenName={screenName}
							fields={properties}
							theme={theme}
							setCurrentScreen={setCurrentScreen}
						/>
					) : null;
				})
			}
		</Fragment>
	) : null;
}


const useStyles = (theme) => (StyleSheet.create({
	group_wrapper: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: 8
	},
	groupHeader: {
		display: 'flex'
	},
	title_wrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	title: {
		padding: 8
	},
	row_wrapper: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 8
	},
}))


ReviewScreen.propTypes = {
	screens: PropTypes.object.isRequired,
	formProperties: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	setCurrentScreen: PropTypes.func,
}

export default ReviewScreen;
