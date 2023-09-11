import { useFonts } from 'expo-font';
import { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { HStack, NativeBaseProvider } from "native-base"
import { StyleSheet, View, Image, Text, ScrollView, Modal, Animated, TextInput, TouchableOpacity, Alert } from "react-native"
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


export const Detail = ({navigation, route}) => {

    const [car, setCar] = useState({}) // -> CAR
    const [transmission, setTransmission] = useState({})
    const [driveTrain, setDriveTrain] = useState({})

    const [modal, setModal] = useState(false)

    const [city, setCity] = useState('') // -> FOR CAR RENTAL
    const [street, setStreet] = useState('')
    const [days, setDays] = useState('')
    const [rent, setRent] = useState({})

    // CAR DETAILS
    useEffect(() => {
        fetch(`http://192.168.28.69:8000/car/${route.params.slug}/`, {})
        .then(response => response.json())
        .then((data) => {
            setCar(data)
            setTransmission(data.transmission)
            setDriveTrain(data.drive_train)
        })
    }, [])


    useEffect(() => {
        fetch(`http://192.168.28.69:8000/rented-car/${route.params.user.id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${route.params.token}`
            }
        })
        .then(response => response.json())
        .then((data) => {
            if (data.detail == 'Not found.') {
                setRent('None')
            } else if (data.car) {
                setRent(data)
            }
        })
    }, [])

    // ANIMATION FOR OPACITY (MODAL)

    const opacityAnimation = useRef(new Animated.Value(1)).current
    const opacityStyle = {opacity: opacityAnimation}
    const startAnimateElem = () => {
        Animated.timing(opacityAnimation, {
            toValue: 0.1,
            duration: 400,
            useNativeDriver: true
        }).start()
    }
    const endAnimateElem = () => {
        Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true
        }).start()
    }

    // console.log(car)
    // console.log(route.params.user)

    // FONTS
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require('../fonts/Roboto-Bold.ttf'),
        'Roboto-Light': require('../fonts/Roboto-Light.ttf'),
        'Roboto-Black': require('../fonts/Roboto-Black.ttf'),
        'Roboto-Regular': require('../fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('../fonts/Roboto-Medium.ttf'),
      });
    
    if (!fontsLoaded) { 
        return null;
    }

    return (
        <NativeBaseProvider>
            {/* RENTAL MODAL  */}
            <Modal animationType='fade' transparent={true} visible={modal} onShow={() => startAnimateElem()} onRequestClose={() => {
                    setModal(false)
                    endAnimateElem()
                    }}>
                <KeyboardAwareScrollView resetScrollToCoords={{x:0, y:0}} showsVerticalScrollIndicator={false}>
                    <View style={styles.modal}>
                        <Text style={{marginTop: '10%', fontFamily: 'Roboto-Medium', fontSize: 25, textAlign: 'center'}}>Booking</Text>
                        <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Your City</Text>
                        <TextInput style={styles.rentalForm} value={city} onChangeText={setCity} placeholder='Your City'/>
                        <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Your Street</Text>
                        <TextInput style={styles.rentalForm} value={street} onChangeText={setStreet} placeholder='Street'/>
                        <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Days Quantity</Text>
                        <TextInput style={styles.rentalForm} keyboardType='numeric' value={days} maxLength={2} onChangeText={setDays} placeholder='Days Number'/>
                        <TouchableOpacity onPress={() => {
                            if (city != '' && street != '' && days != '') {
                                endAnimateElem()
                                setModal(false)
                                navigation.navigate('Payment', {'user': route.params.user, 'token':route.params.token, 'city':city, 'street':street, 'days':parseInt(days), 'rentedCar':car})
                            } else {
                                Alert.alert('Error', 'Please Provide Your Rental Information')
                            }
                            }}>
                            <HStack justifyContent='center' style={styles.submit}>
                            <Text style={{fontFamily: 'Roboto-Medium', fontSize: 20}}>
                                Continue
                            </Text>
                            <AntDesign style={{marginLeft: '3%', alignSelf: 'center', marginTop: '1%'}} name="arrowright" size={24} color="black" />
                            </HStack>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </Modal>

            <Animated.ScrollView style={[{backgroundColor: '#24262D'}, opacityStyle]}>
                <AntDesign name="arrowleft" size={33} color="white" style={styles.back} onPress={() => navigation.goBack()} />
                <Image source={{uri: car.image}} style={[styles.picture, car.full_name == 'Lamborghini Aventador' && {height: 250}]}/>
                <HStack space={40} justifyContent='space-around'>
                    <Text style={{color: '#E2AA4F', fontFamily: 'Roboto-Medium'}}></Text>
                    <Text style={{color: 'white', fontFamily: 'Roboto-Medium'}}><FontAwesome name="star" size={15} color="#F5B754" />{car.shop_rating}</Text>
                </HStack>
                <Text style={{color: 'white', fontFamily: 'Roboto-Black', fontSize: 30, marginLeft: '5%', marginTop: '2%'}}>{car.full_name}</Text>
                <Text style={{color: 'grey', fontFamily: 'Roboto-Light', fontSize: 15, marginLeft: '5%'}}>{car.short_desc}</Text>
                <View style={styles.infoBar}>
                    <Text style={{fontFamily:'Roboto-Black', fontSize: 18, marginLeft: '5%', marginTop: '4%'}}>Features</Text>
                    {/* CAR FEATURES  */}
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <HStack justifyContent='space-evenly' style={{marginTop: 15, marginLeft: 9, paddingBottom: 15}}>
                            {car.engine >= 1000 
                            ? <View style={{backgroundColor: '#FCEACC', borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingBottom: 2, paddingRight: 29, marginRight: 12}}>
                                    <MaterialCommunityIcons name="engine" size={25} color="black" style={{backgroundColor: '#FEF7EB', width: 60, padding: 16, paddingRight: 19, borderRadius: 20}}/>
                                    <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, marginTop: 30}}>Engine {'\n'}Output</Text>
                                    <Text style={{fontFamily: 'Roboto-Black', fontSize: 25}}>{car.engine} <Text style={{fontFamily:'Roboto-Light', fontSize:15}}>hp</Text></Text>
                              </View>
                            : <View style={{backgroundColor: '#FCEACC', borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingBottom: 2, paddingRight: 42, marginRight: 12}}>
                                    <MaterialCommunityIcons name="engine" size={25} color="black" style={{backgroundColor: '#FEF7EB', width: 60, padding: 16, paddingRight: 19, borderRadius: 20}}/>
                                    <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, marginTop: 30}}>Engine {'\n'}Output</Text>
                                    <Text style={{fontFamily: 'Roboto-Black', fontSize: 25}}>{car.engine} <Text style={{fontFamily:'Roboto-Light', fontSize:15}}>hp</Text></Text>
                              </View>
                            }
                            
                            <View style={{backgroundColor: '#DBE5F1', borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingRight: 24, marginRight: 12}}>
                                <Ionicons name="speedometer" size={25} color="black" style={{backgroundColor: '#EDF2F8', width: 60, padding: 16, paddingRight: 19, borderRadius: 20}} />
                                <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, marginTop: 30}}>Highest {'\n'}Speed</Text>
                                <Text style={{fontFamily: 'Roboto-Black', fontSize: 25}}>{car.speed} <Text style={{fontFamily:'Roboto-Light', fontSize:15}}>km/h</Text></Text>
                            </View>
                            <View style={{backgroundColor:"#abadcc", borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingRight: 26, marginRight: 12}}>
                                <Entypo name="time-slot" size={25} color="black" style={{backgroundColor: '#cecfe0', width: 60, padding: 16, paddingRight: 19, borderRadius: 20}}/>
                                <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, color: '#000', marginTop: 30}}>Time {'\n'}to 100 km/h</Text>
                                <Text style={{fontFamily: 'Roboto-Black', fontSize: 25, color: '#000'}}>{car.time_to_100} <Text style={{fontFamily:'Roboto-Light', fontSize:15, color: '#000'}}>sec</Text></Text>
                            </View>
                            <View style={{backgroundColor:"#d8ebdd", borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingRight: 35, marginRight: 12}}>
                                <FontAwesome name="road" size={24} color="black" style={{backgroundColor: '#f2f5f3', width: 59, padding: 16, paddingRight: 19, borderRadius: 20}}/>
                                <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, color: '#000', marginTop: 30}}>Car {'\n'}Range</Text>
                                <Text style={{fontFamily: 'Roboto-Black', fontSize: 25, color: '#000'}}>{car.car_range} <Text style={{fontFamily:'Roboto-Light', fontSize:15, color: '#000'}}>km</Text></Text>
                            </View>
                            <View style={{backgroundColor:"#c4cfb2", borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingRight: 26, marginRight: 12}}>
                                <MaterialCommunityIcons name="weight-kilogram" size={25} color="black" style={{backgroundColor: '#dcded9', width: 59, padding: 16, paddingRight: 19, borderRadius: 20}}/>
                                <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, color: '#000', marginTop: 30}}>Car {'\n'}Weight</Text>
                                <Text style={{fontFamily: 'Roboto-Black', fontSize: 25, color: '#000'}}>{car.weight} <Text style={{fontFamily:'Roboto-Light', fontSize:15, color: '#000'}}>kg</Text></Text>
                            </View>
                            <View style={{backgroundColor:"#c2a7aa", borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingRight: 22, marginRight: 12}}>
                                <FontAwesome name="gears" size={25} color="black" style={{backgroundColor: '#dbced0', width: 61, padding: 16, borderRadius: 20}}/>
                                <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, color: '#000', marginTop: 30}}>Gears {'\n'}Type</Text>
                                <Text style={{fontFamily: 'Roboto-Black', fontSize: 18, color: '#000', marginTop: 5}}>{transmission.name}</Text>
                            </View>
                            <View style={{backgroundColor:"#bea5c2", borderRadius: 15, paddingTop: 10, paddingLeft: 14, paddingRight: 47, marginRight: 12}}>
                                <MaterialCommunityIcons name="car-cog" size={24} color="black" style={{backgroundColor: '#d2c9d4', width: 59, padding: 16, borderRadius: 20}}/>
                                <Text style={{fontFamily: 'Roboto-Light', fontSize: 15, color: '#000', marginTop: 30}}>Drive {'\n'}Train</Text>
                                <Text style={{fontFamily: 'Roboto-Black', fontSize: 18, color: '#000', marginTop: 5}}>{driveTrain.name}</Text>
                            </View>
                        </HStack>
                    </ScrollView>

                    {/* CAR RENTAL + PRICE PER DAY  */}
                    <View style={styles.rental}>
                        <HStack justifyContent='space-around'>
                            <Text style={{paddingVertical: '2.5%', marginTop: '4%'}}>
                                <Text style={{fontFamily:'Roboto-Regular', fontSize: 20}}>$</Text>
                                <Text style={{fontFamily:'Roboto-Bold', fontSize: 35}}>{car.price_per_day}</Text>
                                <Text style={{fontFamily: 'Roboto-Regular', color: 'grey', fontSize: 20}}>/day</Text>
                            </Text>
                            {route.params.user != 'anonymos' && rent == 'None'
                            
                            ?    <View style={{textAlign: 'center', marginBottom: '10%'}}>
                                    <Text style={styles.booking} onPress={() => {
                                        setModal(true)
                                    }}>Book a Car</Text>
                                </View>
                            :  route.params.user == 'anonymos'
                                    ? <Text style={styles.forRent}>You should log in or sign up</Text>
                                    : <Text style={styles.forRent}>You have already rented some car</Text>
                                
                            }
                        </HStack>
                    </View>
                </View>
            </Animated.ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    icons: {
        padding: '3%',
        borderRadius: 20,
        width: '27%',
        height: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2D3035',
        textAlign: 'center',
        paddingTop: '5.5%'
    },
    back: {
        padding: '2.5%',
        textAlign: 'center',
        borderRadius: 20,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#2D3035',
        backgroundColor: '#2B2E32',
        marginTop: '10%',
        marginLeft: '4%'
    },
    picture: {
        width: 410,
        height: 280
    },
    infoBar: {
        backgroundColor: '#F3F4F6', // dedfe0
        marginTop: '10%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },
    rental: {
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginBottom: '4%'
    },
    booking: {
        backgroundColor: '#F5B754',
        color: 'white',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        borderRadius: 15,
        marginTop: '22%',
        paddingVertical: '2%',
        paddingHorizontal: '5%'
    },
    modal: {
        backgroundColor: 'white',
        alignSelf: 'center',
        width: '85%',
        marginTop: '45%',
        borderRadius: 20,
    },
    rentalForm: {
        borderBottomWidth: 1,
        marginTop: '5%',
        width: '85%',
        alignSelf: 'center',
        fontFamily: 'Roboto-Regular',
        fontSize: 16
    },
    submit: {
        marginTop: '8%',
        fontFamily: 'Roboto-Medium',
        fontSize: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: '6%',
        paddingVertical: '2%',
        backgroundColor: '#f2f2f2',
        marginBottom: '5%'
    },
    forRent: {
        width: '30%',
        alignSelf: 'center',
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: '2.5%',
        paddingHorizontal: '1.5%',
        marginTop: '3%',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        backgroundColor: '#ededed'
    }
})