import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useReducer } from "react";
import { AppRegistry } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import SplashScreen from "./screens/SplashScreen";
const Stack=createStackNavigator();
const initialState={
  isLoading:true,
  isUserLoggedIn:false,
  userToken:null,
}
function authReducer(state,action){
  switch(action.type){
    case 'RESTORE_TOKEN':
      return{
        ...state,
        isUserLoggedIn:action.isLoggedIn,
        isLoading:false,
      }
    case 'SIGN_IN':
      return{
        ...state,
        isUserLoggedIn:true,
        userToken:action.token,
      }
    case 'SIGN_OUT':
      return{
        ...state,
        isUserLoggedIn:false,
        userToken:null,
      };
    default:
      return state;
  }
}
function App(){
  const [state,dispatch]=useReducer(authReducer,initialState);
  useEffect(()=>{
    const bootStrapAsync = async () => {
      try{
        const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
        const isLoggedIn = onboardingCompleted === 'true';
        dispatch({
          type:'RESTORE_TOKEN',
          isLoggedIn:isLoggedIn
        });
      }catch(e){
        dispatch({
          type:'RESTORE_TOKEN',
          isLoggedIn:false
        })
      }
    }
    bootStrapAsync();
  },[]);
  if(state.isLoading){
    return <SplashScreen/>
  }
  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {state.isUserLoggedIn?(
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
            />
            <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              initialParams={{
                onOnboardingComplete: () => dispatch({ type: 'SIGN_IN', token: 'dummy' })
              }}
            />
          </>
        ):(
          <Stack.Screen
              name="Onboarding"
              component={Onboarding}
              initialParams={{
                onOnboardingComplete:()=>dispatch({
                  type:'SIGN_IN',
                  token:'dummy'
                })
              }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
AppRegistry.registerComponent('main',()=>App);
export default App;
