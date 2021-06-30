import React from 'react'

// Import: Components
import {View, StyleSheet} from 'react-native';
import {Text, IconButton} from "react-native-paper";

const CustomTitle = React.forwardRef(({children, endReached, canReview, setCurrentScreen, ...props}, ref) => {
	const styles = useStyles();

	return (
		<View style={styles.wrapper}>
			<Text ref={ref} {...props}>
				{children}
			</Text>
			{endReached && canReview && (
				<IconButton
					icon={'arrow-right'}
					size={30}
					onPress={() => setCurrentScreen('endScreen')}
				/>
			)}
		</View>
	);
});

const useStyles = () => (
	StyleSheet.create({
		wrapper: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		}
	})
)

export default CustomTitle;
