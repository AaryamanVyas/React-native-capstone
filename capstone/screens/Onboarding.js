import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
function Logo(){
    return(
        <Image
            source={require('../assets/images/Logo.png')}
            style={styles.image}
        />
    )
}
export default function Onboarding (){
    const navigation=useNavigation();
    const [text,setText]=useState('');
    const [email,setEmail]=useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState({});
    const { onOnboardingComplete } = useRoute().params || {};
    useEffect(()=>{
        const isValid=text.trim()!=='' || email.trim()!=='';
        setIsFormValid(isValid);
    },[text,email]);
    const handleNext=()=>{
        navigation.navigate('Home');
    }
    const validateForm = () => {
        const newErrors = {};
        
        if (text.trim() === '') {
          newErrors.name = 'Name is required';
        }
        
        if (email.trim() === '') {
          newErrors.email = 'Email is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit =async () => {
        if (validateForm()) {
            try{
                await AsyncStorage.setItem('onboardingCompleted', 'true');
                onOnboardingComplete();
            }catch(error){
                console.log('Onboarding not complete');
            }
        } else {
          Alert.alert('Error', 'Please fill in all required fields');
        }
      };
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Logo/>
                
            </View>
            <Text style={styles.textinp}>Let us get to know you!</Text>
            <View>
                <Text style={styles.textinp}>First Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    onChangeText={(text)=>setText(text)}
                    value={text}
                    autoCapitalize="words"
                />
                <Text style={styles.textinp}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    onChangeText={(email)=>setEmail(email)}
                    value={email}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    !isFormValid && styles.buttonDisabled  
                ]}
                onPressIn={() => console.log('Press started')}
                onPressOut={() => console.log('Press ended')}
                onLongPress={() => console.log('Long pressed')}
                android_ripple={{color: '#DDD', borderless: false}} 
                disabled={!isFormValid}
                hitSlop={10}              
                delayLongPress={500}
                pressRetentionOffset={{top: 20, left: 20, right: 20, bottom: 20}}
                unstable_pressDelay={0}   
                onPress={()=>navigation.navigate('Home')}
                >
                <Text style={styles.buttonText}>Next</Text>
                </Pressable>
            </View>
            
        </View>
    )
}
const styles=StyleSheet.create({
    header:{
        flex:0.2,
        alignItems:'center'
    },
    image:{
        width:'100%',
        height:70,
        resizeMode: 'contain',
        justifyContent:'center',
        marginTop:50
    },
    container:{
        flex:1,  
        justifyContent:'space-between'
    },
    input:{
        marginRight:40,
        marginLeft:40,
        height:50,
        borderWidth:1,
        borderColor:'#ddd',
        borderRadius:8,
        paddingHorizontal:15,
        fontSize:16,
        backgroundColor:"#FFF",
        marginVertical:10,
    },
    textinp:{
        textAlign:'center',
        fontSize:20,
        alignItems:'center'
    },
    buttonContainer: {
        alignItems: 'flex-end',
        padding: 20,
    },
    button: {
        backgroundColor: '#007AFF',   
        paddingHorizontal: 20,         
        paddingVertical: 12,           
        borderRadius: 8,               
        borderWidth: 1,                
        borderColor: '#0056CC',        
        minWidth: 100,                 
        minHeight: 44,                 
        shadowColor: '#000',           
        shadowOffset: {width: 0, height: 2}, 
        shadowOpacity: 0.25,           
        shadowRadius: 3.84,            
        elevation: 5,                  
    },
    buttonPressed: {
        backgroundColor: '#0056CC',    
        transform: [{scale: 0.98}],    
    },
    buttonText: {
        color: '#FFFFFF',              
        fontSize: 16,                  
        fontWeight: '600',             
        textAlign: 'center',          
    },
})