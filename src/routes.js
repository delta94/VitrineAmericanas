import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignInScreem" headerMode="none">
                <Stack.Screen
                    name="SignInScreem"
                    component={SignIn}
                    options={{title: 'Entrar'}}
                />
                <Stack.Screen
                    name="HomeScreem"
                    component={Home}
                    options={{title: 'Home'}}
                />
                <Stack.Screen
                    name="SignUpScreem"
                    component={SignUp}
                    options={{title: 'Cadastrar'}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
