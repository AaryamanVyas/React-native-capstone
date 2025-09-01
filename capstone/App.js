import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import Onboarding from './screens/Onboarding';
const Stack=createNativeStackNavigator();
export default function App(){
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Onboarding' component={Onboarding}/>
            </Stack.Navigator>
            <Onboarding/>
        </NavigationContainer>
    )
}