import {StyleSheet} from 'react-native';

const coreStyles = StyleSheet.create({
    /* Application styles */
    alertsWrapper: {
        position: 'absolute',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },

    container: {
        flex: 1,
        // marginTop: Platform.OS === 'android' ? StatusBar.currentHeight / 2 : 0,
        paddingLeft: 16,
        paddingBottom: 16,
        paddingRight: 16
    }
})

export default coreStyles;