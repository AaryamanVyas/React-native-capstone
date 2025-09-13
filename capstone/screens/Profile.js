import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";

export default function Profile(){  
    const navigation = useNavigation();
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 30 }}>
                This is the Profile Page
            </Text>
            
            {/* Add navigation buttons */}
            <Pressable
                style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 15 }}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={{ color: 'white', fontSize: 16 }}>Go to Home</Text>
            </Pressable>
            
            <Pressable
                style={{ backgroundColor: '#34C759', padding: 15, borderRadius: 8, marginBottom: 15 }}
                onPress={() => navigation.navigate('Onboarding')}
            >
                <Text style={{ color: 'white', fontSize: 16 }}>Go to Onboarding</Text>
            </Pressable>
        </View>
    )
}