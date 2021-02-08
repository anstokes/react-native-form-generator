import React from 'react';
import { DefaultTheme as PaperLightTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDarkTheme } from '@react-navigation/native';

const combinedLightTheme = {
    ...NavigationDarkTheme,
    ...PaperLightTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        ...PaperLightTheme.colors,
        primary: '#F2994A',
        success: '',
        accent: '#F2994A',
    }
};

export default combinedLightTheme;