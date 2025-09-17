import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { openDatabaseSync } from 'expo-sqlite';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const SECTIONS = ['starters', 'mains', 'desserts'];

const db = openDatabaseSync('little_lemon.db');

// in HomeScreen.js
// in HomeScreen.js
function getImageUrl(imageFile) {
    return `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${encodeURIComponent(imageFile)}?raw=true`;
  }

function groupBySection(items) {
    const map = { starters: [], mains: [], desserts: [] };
    items.forEach((it) => {
        if (map[it.category]) {
            map[it.category].push(it);
        }
    });
    return SECTIONS.map((name) => ({
        name,
        data: map[name] || []
    }));
}

export default function HomeScreen(){
    const navigation = useNavigation();

    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        orderStatuses: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
        image: ''
    });

    const [sectionsData, setSectionsData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(SECTIONS.map(() => false));
    const [loading, setLoading] = useState(true);

    // Fonts
    const [fontsLoaded] = useFonts({
        'Karla-Regular': require('../assets/fonts/Karla-Regular.ttf'),
        'Karla-Medium': require('../assets/fonts/Karla-Medium.ttf'),
        'Karla-Bold': require('../assets/fonts/Karla-Bold.ttf'),
        'Karla-ExtraBold': require('../assets/fonts/Karla-ExtraBold.ttf'),
        'MarkaziText-Regular': require('../assets/fonts/MarkaziText-Regular.ttf'),
        'MarkaziText-Medium': require('../assets/fonts/MarkaziText-Medium.ttf')
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    useEffect(() => {
        (async () => {
            try {
                await initDb();
                await bootstrap();
            } catch (err) {
                console.log('DB init/bootstrap error:', err);
                Alert.alert('Database error', 'Failed to initialize database.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const initDb = async () => {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS menu (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price TEXT NOT NULL,
                description TEXT NOT NULL,
                image TEXT NOT NULL,
                category TEXT NOT NULL
            );
        `);
    };

    const bootstrap = async () => {
        // Load profile from your app’s key 'userData'
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
            const user = JSON.parse(userDataString);
            setProfile({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                orderStatuses: user.orderStatus || false,
                passwordChanges: user.passwordChanges || false,
                specialOffers: user.specialOffers || false,
                newsletter: user.newsletter || false,
                image: user.profileImage || ''
            });
        }

        const existing = await getMenuItemsFromDB();
        if (existing.length === 0) {
            const fetched = await fetchMenu();
            await saveMenuItemsToDB(fetched);
            setSectionsData(groupBySection(fetched));
        } else {
            setSectionsData(groupBySection(existing));
        }
    };

    const fetchMenu = async () => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const menu = (json?.menu || []).map((item, idx) => ({
            id: idx + 1,
            name: item.name,
            price: String(item.price),
            description: item.description,
            image: item.image,
            category: item.category
        }));
        return menu;
    };

    const saveMenuItemsToDB = async (items) => {
        await db.withTransactionAsync(async () => {
            await db.runAsync('DELETE FROM menu');
            for (const it of items) {
                await db.runAsync(
                    'INSERT INTO menu (id, name, price, description, image, category) VALUES (?, ?, ?, ?, ?, ?)',
                    [it.id, it.name, it.price, it.description, it.image, it.category]
                );
            }
        });
    };

    const getMenuItemsFromDB = async () => {
        const rows = await db.getAllAsync('SELECT * FROM menu');
        return rows || [];
    };

    const filterMenuFromDB = async (q, activeCats) => {
        const like = `%${q.trim().toLowerCase()}%`;
        const hasQuery = q.trim().length > 0;
        const hasCats = activeCats.length > 0 && activeCats.length < SECTIONS.length;

        let sql = 'SELECT * FROM menu';
        const params = [];

        const clauses = [];
        if (hasQuery) {
            clauses.push('(LOWER(name) LIKE ? OR LOWER(description) LIKE ?)');
            params.push(like, like);
        }
        if (hasCats) {
            const placeholders = activeCats.map(() => '?').join(', ');
            clauses.push(`category IN (${placeholders})`);
            params.push(...activeCats);
        }
        if (clauses.length > 0) {
            sql += ' WHERE ' + clauses.join(' AND ');
        }
        return await db.getAllAsync(sql, params);
    };

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setQuery(searchBarText), 400);
        return () => clearTimeout(t);
    }, [searchBarText]);

    // Apply filters/search when query or selections change
    useEffect(() => {
        (async () => {
            try {
                const anySelected = filterSelections.some(Boolean);
                const activeCategories = anySelected ? SECTIONS.filter((_, i) => filterSelections[i]) : SECTIONS;
                const filtered = await filterMenuFromDB(query, activeCategories);
                setSectionsData(groupBySection(filtered));
            } catch (e) {
                Alert.alert('Filter error', e.message);
            }
        })();
    }, [query, filterSelections]);

    const toggleFilter = (index) => {
        const copy = [...filterSelections];
        copy[index] = !copy[index];
        setFilterSelections(copy);
    };

    if (!fontsLoaded) {
        return null;
    }

    if (loading) {
        return (
            <View style={styles.center} onLayout={onLayoutRootView}>
                <ActivityIndicator size="large" color="#495e57" />
                <Text style={{ marginTop: 8, color: '#495e57' }}>Loading menu…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    style={styles.logo}
                    source={require('../assets/images/Logo.png')}
                    accessible={true}
                    accessibilityLabel={'Little Lemon Logo'}
                />
                <Pressable
                    style={styles.avatar}
                    onPress={() => navigation.navigate('Profile')}
                    accessibilityRole="button"
                    accessibilityLabel="Open Profile"
                >
                    {profile.image ? (
                        <Image source={{ uri: profile.image }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatarEmpty}>
                            <Text style={styles.avatarEmptyText}>
                                {profile.firstName ? Array.from(profile.firstName)[0] : ''}
                                {profile.lastName ? Array.from(profile.lastName)[0] : ''}
                            </Text>
                        </View>
                    )}
                </Pressable>
            </View>

            {/* Hero */}
            <View style={styles.heroSection}>
                <Text style={styles.heroHeader}>Little Lemon</Text>
                <View style={styles.heroBody}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroHeader2}>Chicago</Text>
                        <Text style={styles.heroText}>
                            We are a family owned Mediterranean restaurant, focused on traditional recipes
                            served with a modern twist.
                        </Text>
                    </View>
                </View>
                <Searchbar
                    placeholder="Search"
                    placeholderTextColor="#333333"
                    onChangeText={setSearchBarText}
                    value={searchBarText}
                    style={styles.searchBar}
                    iconColor="#333333"
                    inputStyle={{ color: '#333333' }}
                    elevation={0}
                />
            </View>

            {/* Delivery header */}
            <Text style={styles.delivery}>ORDER FOR DELIVERY!</Text>

            {/* Category filters */}
            <View style={styles.filtersRow}>
                {SECTIONS.map((s, i) => {
                    const active = filterSelections[i];
                    return (
                        <Pressable
                            key={s}
                            style={[styles.filterChip, active && styles.filterChipActive]}
                            onPress={() => toggleFilter(i)}
                            accessibilityRole="button"
                            accessibilityLabel={`Filter ${s}`}
                        >
                            <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                                {s.toUpperCase()}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* Menu list */}
            <SectionList
                style={styles.sectionList}
                sections={sectionsData}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View style={styles.itemBody}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                        </View>
                        <Image
                            style={styles.itemImage}
                            source={
                                item.name === 'Grilled Fish'
                                    ? require('../assets/images/Grilled fish.png')
                                    : { uri: getImageUrl(item.image) }
                            }
                        />
                    </View>
                )}
                renderSectionHeader={({ section: { name } }) => (
                    <Text style={styles.itemHeader}>{name}</Text>
                )}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Constants.statusBarHeight
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    header: {
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#dee3e9'
    },
    logo: {
        height: 50,
        width: 150,
        resizeMode: 'contain'
    },
    sectionList: {
        paddingHorizontal: 16
    },
    searchBar: {
        marginTop: 15,
        backgroundColor: '#e4e4e4',
        shadowRadius: 0,
        shadowOpacity: 0
    },
    filtersRow: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 16,
        marginBottom: 8
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#e8e8e8'
    },
    filterChipActive: {
        backgroundColor: '#495e57'
    },
    filterChipText: {
        color: '#333',
        fontFamily: 'Karla-Medium'
    },
    filterChipTextActive: {
        color: '#fff',
        fontFamily: 'Karla-Bold'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
        paddingVertical: 10
    },
    itemBody: {
        flex: 1
    },
    itemHeader: {
        fontSize: 24,
        paddingVertical: 8,
        color: '#495e57',
        backgroundColor: '#fff',
        fontFamily: 'Karla-ExtraBold'
    },
    name: {
        fontSize: 20,
        color: '#000000',
        paddingBottom: 5,
        fontFamily: 'Karla-Bold'
    },
    description: {
        color: '#495e57',
        paddingRight: 5,
        fontFamily: 'Karla-Medium'
    },
    price: {
        fontSize: 20,
        color: '#EE9972',
        paddingTop: 5,
        fontFamily: 'Karla-Medium'
    },
    itemImage: {
        width: 100,
        height: 100
    },
    avatar: {
        flex: 1,
        position: 'absolute',
        right: 10,
        top: 10
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    avatarEmpty: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#0b9a6a',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarEmptyText: {
        color: '#fff',
        fontFamily: 'Karla-Bold',
        fontSize: 16
    },
    heroSection: {
        backgroundColor: '#495e57',
        padding: 15
    },
    heroHeader: {
        color: '#f4ce14',
        fontSize: 54,
        fontFamily: 'MarkaziText-Medium'
    },
    heroHeader2: {
        color: '#fff',
        fontSize: 30,
        fontFamily: 'MarkaziText-Medium'
    },
    heroText: {
        color: '#fff',
        fontFamily: 'Karla-Medium',
        fontSize: 14
    },
    heroBody: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    heroContent: {
        flex: 1
    },
    delivery: {
        fontSize: 18,
        padding: 15,
        fontFamily: 'Karla-ExtraBold'
    }
});