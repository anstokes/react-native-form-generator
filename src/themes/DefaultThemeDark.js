import React from 'react';
import {DarkTheme as PaperDarkTheme} from 'react-native-paper';
import {DarkTheme as NavigationDarkTheme} from '@react-navigation/native';

const combinedDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        ...PaperDarkTheme.colors,
        primary: '#fff',
        success: '',
        accent: '#F2994A',
    }
};

export default combinedDarkTheme;