import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";

export default function HomeScreen(){
    const navigation = useNavigation();  
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 30 }}>Home</Text>
            <Pressable
                style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}
                onPress={() => navigation.navigate('Profile')}  
            >
                <Text style={{ color: 'white', fontSize: 16 }}>Go to Profile</Text>
            </Pressable>
        </View>
    )
}