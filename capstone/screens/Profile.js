import { useNavigation } from "@react-navigation/native";
import Checkbox from 'expo-checkbox';
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function Logo(){
    return(
        <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
        />
    )
} 

export default function Profile(){  
    const navigation = useNavigation();
    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [phoneno,setPhoneNo]=useState("");
    const [email,setEmail]=useState("");
    const [orderStatus, setOrderStatus] = useState(false);
    const [passwordChanges, setPasswordChanges] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    
    return(
        <View style={styles.container}>
            {/* Header with back button, logo, and profile picture */}
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.backButtonText}>←</Text>
                </Pressable>
                <Logo/>
                <View style={styles.profilePicture}>
                    <Text style={styles.profilePictureText}>👤</Text>
                </View>
            </View>

            {/* Avatar section with Change and Remove buttons */}
            <View style={styles.avatarSection}>
                <View style={styles.profileImagePlaceholder}>
                    <Text style={styles.profileImageText}>��</Text>
                </View>
                <View style={styles.avatarButtons}>
                    <Pressable style={styles.changeButton}>
                        <Text style={styles.changeButtonText}>Change</Text>
                    </Pressable>
                    <Pressable style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>Remove</Text>
                    </Pressable>
                </View>
            </View>

            {/* Form inputs */}
            <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>First name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter first name"
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize="words"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Last name</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter last name"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter the email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        returnKeyType="next"
                    />
                </View>
                
                <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Phone number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        value={phoneno}
                        onChangeText={setPhoneNo}
                        keyboardType="numeric"
                        returnKeyType="done"
                        maxLength={10}
                    />    
                </View>
            </View>

            {/* Email notifications section */}
            <View style={styles.notificationsSection}>
                <Text style={styles.notificationsTitle}>Email notifications</Text>
                
                <View style={styles.checkboxRow}>
                    <Checkbox 
                        value={orderStatus} 
                        onValueChange={setOrderStatus} 
                        color="#495e57"
                    />
                    <Text style={styles.checkboxText}>Order statuses</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                    <Checkbox 
                        value={passwordChanges} 
                        onValueChange={setPasswordChanges} 
                        color="#495e57"
                    />
                    <Text style={styles.checkboxText}>Password changes</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                    <Checkbox 
                        value={specialOffers} 
                        onValueChange={setSpecialOffers} 
                        color="#495e57"
                    />
                    <Text style={styles.checkboxText}>Special offers</Text>
                </View>
                
                <View style={styles.checkboxRow}>
                    <Checkbox 
                        value={newsletter} 
                        onValueChange={setNewsletter} 
                        color="#495e57"
                    />
                    <Text style={styles.checkboxText}>Newsletter</Text>
                </View>
            </View>

            {/* Logout button */}
            <View style={styles.logoutSection}>
                <Pressable
                    style={styles.logoutButton}
                    onPress={() => navigation.navigate('Onboarding')}
                >
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </Pressable>
            </View>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
                <Pressable style={styles.discardButton}>
                    <Text style={styles.discardButtonText}>Discard changes</Text>
                </Pressable>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save changes</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 30
    },
    
    // Header styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10
    },
    backButton: {
        backgroundColor: '#495e57',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        lineHeight:40,
        textAlign:'center',
        textAlignVertical:'center',
        marginTop:-7
    },
    logo: {
        resizeMode: 'contain',
        height: 50,
        width: 100
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profilePictureText: {
        fontSize: 20
    },
    
    // Avatar section styles
    avatarSection: {
        alignItems: 'center',
        marginBottom: 20
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    profileImageText: {
        fontSize: 30
    },
    avatarButtons: {
        flexDirection: 'row',
        gap: 10
    },
    changeButton: {
        backgroundColor: '#495e57',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6
    },
    changeButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14
    },
    removeButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#495e57',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6
    },
    removeButtonText: {
        color: '#495e57',
        fontWeight: '600',
        fontSize: 14
    },
    
    // Form section styles
    formSection: {
        marginBottom: 20
    },
    inputGroup: {
        marginBottom: 15
    },
    labelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#495e57',
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#e7e7ed',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#fff',
        height: 40
    },
    
    // Notifications section styles
    notificationsSection: {
        marginBottom: 20
    },
    notificationsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#495e57',
        marginBottom: 10
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingLeft: 5
    },
    checkboxText: {
        fontSize: 14,
        color: '#495e57',
        marginLeft: 8
    },
    
    // Logout section styles
    logoutSection: {
        alignItems: 'center',
        marginBottom: 20
    },
    logoutButton: {
        backgroundColor: '#f4ce14',
        paddingHorizontal: 110,
        paddingVertical: 12,
        borderRadius: 6,
        width:'100%',
        alignItems:'center'
    },
    logoutButtonText: {
        color: '#495e57',
        fontSize: 14,
        fontWeight: '600'
    },
    
    // Action buttons styles
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 10
    },
    discardButton: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#495e57',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        borderRadius:10
    },
    discardButtonText: {
        color: '#495e57',
        fontSize: 14,
        fontWeight: '600'
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#495e57',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        borderRadius:10
    },
    saveButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600'
    }
})