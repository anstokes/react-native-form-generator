import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import: Redux
import { fetchFormSchema } from '../redux/actions/formActions';

// Import: Styles and Themes
import { defaultThemeDark, defaultThemeLight } from '../src/themes';

// Import: Components
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, Title } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';

// Import: Screens
import { HomeScreen, AdvancedFormScreen, SimpleFormScreen, PaginatedFormScreen } from "./screens";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Main = (props) => {

    const [theme] = useState(defaultThemeLight);

    useEffect(() => {
        fetchFormSchema();
    }, [])

    return (
        <PaperProvider theme={theme}>
            <Fragment>
                <NavigationContainer theme={theme}>
                    <Stack.Navigator initialRouteName={'home'}>
                        <Stack.Screen
                            name={'home'}
                            component={HomeScreen}
                            options={{
                                title: 'Forms Testing'
                            }}
                        />
                        <Stack.Screen
                            name={'simple_form'}
                            component={SimpleFormScreen}
                            options={{
                                title: 'Simple Validation'
                            }}
                        />
                        <Stack.Screen
                            name={'advanced_form'}
                            component={AdvancedFormScreen}
                            options={{
                                title: 'Advanced Validation'
                            }}
                        />
                        <Stack.Screen
                            name={'paginated_form'}
                            component={PaginatedFormScreen}
                            options={{
                                title: 'Paginated & Advanced Validation'
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>

                <StatusBar style={'dark'} backgroundColor={theme.colors.primary} />
            </Fragment>
        </PaperProvider>
    );
};

Main.propTypes = {};

const mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(Main);