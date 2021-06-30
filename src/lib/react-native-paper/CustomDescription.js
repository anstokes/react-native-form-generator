import React from 'react'

// Import: Components
import {Text} from "react-native-paper";

const CustomDescription = React.forwardRef((props, ref) => {
	return (
		<Text ref={ref} {...props}>
			{props.children}
		</Text>
	);
});

export default CustomDescription;
