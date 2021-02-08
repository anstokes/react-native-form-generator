import React, {useEffect, useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import {MaterialCommunityIcons} from '@expo/vector-icons';

// Import: Redux
import {fetchFormSchema} from '../redux/actions/formActions';

// Import: Styles and Themes
import {defaultThemeDark} from '../src/themes';

// Import: Components
import {StatusBar} from 'expo-status-bar';
import {Provider as PaperProvider} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

// Import: Screens
import {CustomFieldsScreen, DefaultFieldsScreen} from "./screens";
import {store} from "../redux/store";

const Tab = createBottomTabNavigator();

const Test = (props) => {

    const [theme] = useState(defaultThemeDark);

    useEffect(() => {
        // fetchFormSchema()();
        fetchFormSchema();
    }, [])

    return (
        <PaperProvider theme={theme}>
            <Fragment>
                <NavigationContainer theme={theme}>
                    <Tab.Navigator
                        initialRouteName={'default'}
                        tabBarOptions={{
                            activeTintColor: theme.colors.accent
                        }}
                        barStyle={{backgroundColor: theme.colors.primary}}
                        shifting={true}
                    >
                        <Tab.Screen
                            name={'default'}
                            component={DefaultFieldsScreen}
                            options={{
                                tabBarIcon: ({ color}) => (
                                    <MaterialCommunityIcons name="cursor-text" color={color} size={20} />
                                ),
                                tabBarLabel: 'Default'
                            }}
                        />
                        <Tab.Screen
                            name={'custom'}
                            component={CustomFieldsScreen}
                            options={{
                                tabBarIcon: ({ color }) => (
                                    <MaterialCommunityIcons name={"circle"} color={color} size={20} />
                                ),
                                tabBarLabel: 'Custom'
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>

                <StatusBar style={'dark'} backgroundColor={theme.colors.primary} />
            </Fragment>
        </PaperProvider>
    );
};

Test.propTypes = {};

export default Test;