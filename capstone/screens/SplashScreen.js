import { Image, Text, View } from "react-native";

export default function SplashScreen(){
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image 
                source={require('../assets/images/Logo.png')}
                style={{ width: 200, height: 100, resizeMode: 'contain' }}
            />
            <Text style={{ marginTop: 20, fontSize: 18 }}>Loading...</Text>
        </View>
    )
}