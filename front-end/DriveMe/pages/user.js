import { useFonts } from 'expo-font';
import { HStack, NativeBaseProvider } from "native-base"
import { StyleSheet, View, Image, Text, TextInput, Animated, Modal, TouchableOpacity, RefreshControl, ScrollView, Alert} from "react-native"
import {AntDesign} from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Entypo } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateField from 'react-native-datefield'
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment'

export const User = ({navigation, route}) => {

    const [profile, setProfile] = useState({})
    const [payment, setPayment] = useState({})
    const [rentedCar, setRentedCar] = useState({})

    const [car, setCar] = useState({})
    const [cvv, setCvv] = useState('* * *')

    const [modal, setModal] = useState(false)
    const [editModal, setEdit] = useState(false)

    const [paymentSys, setPaymentSys] = useState('')
    const [number, setNumber] = useState('')
    const [valid, setValid] = useState('')
    const [cvvdate, setCVV] = useState(0)

    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [date, setDate] = useState('')
    const [photo, setPhoto] = useState('')
    const [refresh, setRefresh] = useState(false)
    const [img, setImg] = useState('')

    const formdata = new FormData();

    useEffect(() => {
        fetch(`http://192.168.28.69:8000/rented-car/${route.params.user.id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${route.params.token}`
            }
        })
        .then(response => response.json())
        .then((data) => {
            setRentedCar(data)
            setCar(data.car)
        })
    }, [refresh])

    // FOR GESTURE NAVIGATION
    useEffect(() => {
        const {routes} = navigation.getState()

        const filteredRoutes = routes.filter(
            route1 => route1.name !== 'Home' && route1.name !== 'Detail' && route1.name !== 'Payment'
        )

        navigation.reset({
            index: filteredRoutes.length - 1,
            routes: filteredRoutes,
        });
    }, [])

    const update = (datas) => {
        fetch(`http://192.168.28.69:8000/user/${route.params.user.username}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${route.params.token}`
            },
            body: JSON.stringify({
                'username':route.params.user.username,
                'email':route.params.user.email,
                'full_name':route.params.user.full_name,
                'password':route.params.user.password,
                'payment_details': datas
            })
        }).then(response => response.json())
        .then((data) => {
            setPayment(data.payment_details)
            // console.log(data.payment_details)
        })
    }
    
    const edit = (datas) => {
        fetch(`http://192.168.28.69:8000/user/${route.params.user.username}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${route.params.token}`
            },
            body: datas
        }).then(response => response.json())
        .then((data) => {
            setProfile(data)
            setImg('http://192.168.28.69:8000/' + data.photo)
            setFullname('')
            setEmail('')
            setPhoto('')
        })
    }

    const create_payment = (payments) => {
        fetch('http://192.168.28.69:8000/create-payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Token ${route.params.token}`
            },
            body: JSON.stringify(payments)
        }).then(() => {
            update(payments)
            setPaymentSys('')
            setCVV('')
            setNumber('')
            setValid('')
        }
        )
        .catch((error) => console.log(error)) 
    }

    const deletePayment = (pk) => {
        fetch(`http://192.168.28.69:8000/delete-payment/${pk}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${route.params.token}`
            }
        })
    }

    const deleteRentedCar = () => {
        fetch(`http://192.168.28.69:8000/rented-car/${route.params.user.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${route.params.token}`
            }
        }).then(
            onRefresh()
        )
    }

    useEffect(() => {
        setProfile(route.params.user)
        setImg(route.params.user.photo)
        if (route.params.user.payment_details != null) {
            setPayment(route.params.user.payment_details)
        } else {
            setPayment('None')
        }
        }, [route])


    // -----------------------------------------------------------------

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
          base64: true,
          type: 'image'
        });
        
        if (!result.canceled) {
          setPhoto(result.assets[0].base64);
        }
      };

    // ---------------------------------------------

    const onRefresh = useCallback(() => {
        setRefresh(true);
        setTimeout(() => {
          setRefresh(false);
        }, 1000);
      }, []);
    

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

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------

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
        <ScrollView refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh}/>
        }>
            <NativeBaseProvider>
                        {/* PAYMENT  */}
                        <Modal animationType='fade' transparent={true} visible={modal} onShow={() => startAnimateElem()} onRequestClose={() => {
                            setModal(false)
                            endAnimateElem()
                            }}>
                            <KeyboardAwareScrollView resetScrollToCoords={{x:0, y:0}} showsVerticalScrollIndicator={false}>
                                <View style={styles.modal}>
                                    <Text style={{marginTop: '10%', fontFamily: 'Roboto-Medium', fontSize: 25, textAlign: 'center'}}>Add Card</Text>
                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Your Payment System</Text>
                                    <TextInput style={styles.loginUsernameInput} value={paymentSys} onChangeText={setPaymentSys} maxLength={10} placeholder='VISA/Mastercard'/>
                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Your Card Number</Text>
                                    <TextInput style={styles.loginUsernameInput} value={number} onChangeText={setNumber} keyboardType='numeric' maxLength={19} placeholder='Your Card Number (with spaces)'/>
                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Your Valid Date</Text>
                                    <TextInput style={styles.loginUsernameInput} value={valid} maxLength={5} onChangeText={setValid} placeholder='Your Valid Date'/>
                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Your CVV</Text>
                                    <TextInput style={styles.loginUsernameInput} value={cvvdate} onChangeText={setCVV} maxLength={3} keyboardType='numeric' placeholder='Your CVV' secureTextEntry={true}/>
                                    <TouchableOpacity onPress={() => {
                                        if ((paymentSys == 'Mastercard' || paymentSys == 'VISA') && number != '' && valid.length != 3 && cvv.length != 3) {
                                            endAnimateElem()
                                            deletePayment(payment.id)
                                            create_payment({
                                                'payment_sys':paymentSys,
                                                'number':number,
                                                'valid':valid,
                                                'cvv': parseInt(cvvdate)
                                            })
                                            onRefresh()
                                            setModal(false)
                                        } else {
                                            Alert.alert('Error', 'Please Provide Your Payment Details')
                                        }
                                        }}>
                                        <Text style={styles.submit}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAwareScrollView>
                        </Modal>
                        {/* EDIT DATA */}
                        <Modal animationType='fade' transparent={true} visible={editModal} onShow={() => startAnimateElem()} onRequestClose={() => {
                            setEdit(false)
                            endAnimateElem()
                            }}>
                            <KeyboardAwareScrollView resetScrollToCoords={{x:0, y:0}} showsVerticalScrollIndicator={false}>
                                <View style={styles.modal}>
                                    <Text style={{marginTop: '10%', fontFamily: 'Roboto-Medium', fontSize: 25, textAlign: 'center'}}>Edit Your Profile</Text>
                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Edit your Full Name</Text>
                                    <TextInput style={styles.loginUsernameInput} value={fullname} onChangeText={setFullname} placeholder='Your Full Name' />
                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Edit your Email</Text>
                                    <TextInput style={styles.loginUsernameInput} value={email} onChangeText={setEmail} placeholder='Your Email'/>
                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Edit Your Date of Birth</Text>
                                    <DateField
                                        labelDate="Day"
                                        styleInput={{fontFamily: 'Roboto-Regular', fontSize: 18, borderBottomWidth: 1}}
                                        containerStyle={{justifyContent: 'space-evenly', marginTop: '4%', marginBottom: '1%'}}
                                        onSubmit={(value) => setDate(value)}
                                        />

                                    <Text style={{marginTop: '5%', marginLeft: '5%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Upload your photo</Text>
                                    {photo != '' &&
                                        <Text style={{fontFamily: 'Roboto-Medium', fontSize: 15, color: 'green', marginTop: '2%', marginLeft: '6%'}}>*Uploaded</Text>
                                    }
                                    <TouchableOpacity
                                    onPress={pickImage}
                                    style={{alignSelf: 'center', marginTop: '5%', borderRadius: 20, borderWidth: 1, paddingHorizontal: '5%', paddingVertical: '4%'}}
                                    >
                                        <Text style={{fontFamily: 'Roboto-Medium', fontSize: 16}}>Select Photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        endAnimateElem()
                                        formdata.append('username', route.params.user.username)
                                        if (email == '') {
                                            formdata.append('email', route.params.user.email)
                                        } else {
                                            formdata.append('email', email)
                                        }
                                        if (fullname == '') {
                                            formdata.append('full_name', route.params.user.full_name)
                                        } else {
                                            formdata.append('full_name', fullname)
                                        }
                                        formdata.append('password', route.params.user.password)
                                        formdata.append('photo', photo)
                                        if (date) {
                                            formdata.append('date_of_birth', moment(date).format("YYYY-MM-DD"))
                                        }
                                        edit(formdata)
                                        onRefresh()
                                        setEdit(false)
                                        }}>
                                        <Text style={styles.submit}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAwareScrollView>
                        </Modal>
                        <Animated.ScrollView style={[{backgroundColor: '#f2f2f2'}, opacityStyle]}>
                            <HStack space={8} justifyContent='flex-start'>
                                <AntDesign name="arrowleft" size={33} color="black" style={styles.back} onPress={() => navigation.navigate('List')} />
                                <Text style={{marginTop: '11%',fontFamily: 'Roboto-Bold', fontSize: 36, marginLeft: '3%'}}>Your Profile</Text>
                            </HStack>

                            {/* PROFILE  */}

                            <HStack space={3} justifyContent='space-evenly' style={{marginTop: '3%', marginBottom: '7%'}}>
                                {profile.photo
                                ? <Image source={{uri: img}} style={{height: 220, width: 220, borderRadius: 20, alignSelf: 'flex-start', marginLeft: '4%'}}/>
                                : <View style={styles.noPhoto}>
                                    <Text style={{textAlign: 'center', fontFamily: 'Roboto-Medium', fontSize: 25}}>No Photo</Text>
                                </View>
                                }
                                <View style={{paddingHorizontal: '5%', borderRadius: 20, maxWidth: 205}}>
                                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 26, marginTop: '10%'}}>{profile.full_name}</Text>
                                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 15, marginTop: '5%'}}>{profile.email}</Text>
                                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 13, marginTop: '5%'}}>Date of Birth: {moment(profile.date_of_birth).format('DD.MM.YYYY')}</Text>
                                    <Text style={{fontFamily: 'Roboto-Regular', fontSize: 13, marginTop: '5%'}}>Registered: {moment(profile.registered_since).format('DD.MM.YYYY')}</Text>
                                </View>
                            </HStack>

                            <View>
                                <TouchableOpacity style={styles.edit} onPress={() => setEdit(true)}>
                                    <Text style={{fontFamily: 'Roboto-Medium', fontSize: 20, textAlign: 'center'}}>Edit Your Data</Text>
                                </TouchableOpacity>
                            </View>

                            {/* RENTED CAR */}

                            {car && 
                                <View style={{backgroundColor: '#fff', borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                    <HStack justifyContent='space-between' style={{marginTop: "5%"}}>
                                        <Text style={{marginTop: '2%', fontFamily: 'Roboto-Bold', fontSize: 30, marginLeft: '3%'}}>Rented Car</Text>
                                        <Entypo name="minus" size={28} color="black" style={{
                                            alignSelf: 'center',
                                            marginRight: '5%', 
                                            borderWidth: 1, 
                                            borderRadius: 20, 
                                            paddingVertical: '1.2%', 
                                            paddingLeft: '2%', 
                                            paddingRight: '1.5%',
                                            paddingTop: '1.5%'}} 
                                            onPress={() => {
                                                Alert.alert('Warning', 'Are you sure by canceling your order?', [
                                                    {
                                                        text: 'Cancel',
                                                        style: 'cancel',
                                                    },
                                                    {
                                                      text: 'Yes, I am sure',
                                                      onPress: () => deleteRentedCar()
                                                      ,
                                                    },
                                                ])
                                            }}/>
                                    </HStack>
                                    <View>
                                        <Image source={{uri: car.image}} style={{height: 235, width: 400, marginTop: '10%'}}/>
                                    </View>
                                    <HStack justifyContent='space-between' style={{marginLeft: '4%', marginRight: '4%', marginTop: '2%'}}>
                                        <Text style={{fontFamily: 'Roboto-Regular', fontSize: 23}}>{car.full_name}</Text>
                                        <Text style={{fontFamily: 'Roboto-Regular', fontSize: 23}}>
                                            <Entypo name="time-slot" size={25} color="black"/>
                                            {rentedCar.days} days
                                        </Text>
                                    </HStack>
                                    <Text style={{alignSelf: 'flex-end', fontFamily: 'Roboto-Regular', fontSize: 20, marginRight: '3.5%', marginTop: '2%', marginBottom: '10%'}}>Total: ${rentedCar.total}</Text>
                                </View>
                            }
                            {/* PAYMENT DETAILS  */}
                            <View style={{backgroundColor: '#fff', borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                {payment != 'None' 
                                ? <HStack justifyContent='space-between' style={{marginTop: "5%"}}>
                                <Text style={{fontFamily: 'Roboto-Bold', fontSize: 30, marginLeft: '3%'}}>Payment Details</Text>
                                <Ionicons name="refresh" size={28} color="black" style={{
                                    alignSelf: 'center', 
                                    marginRight: '5%', 
                                    borderWidth: 1, 
                                    borderRadius: 20, 
                                    paddingVertical: '1.2%', 
                                    paddingLeft: '2%', 
                                    paddingRight: '1%'}} 
                                onPress={() => setModal(true)}/>
                            </HStack>
                                : <HStack justifyContent='space-between' style={{marginTop: "5%"}}>
                                    <Text style={{fontFamily: 'Roboto-Bold', fontSize: 30, marginLeft: '3%'}}>Payment Details</Text>
                                    <Entypo
                                        name="plus"
                                        size={30}
                                        color="black"
                                        style={styles.addCard}
                                        onPress={() => setModal(true)}
                                    />
                                </HStack>
                                }
                                {payment != 'None' 
                                ?
                                    (payment.payment_sys.id == 2
                                        ? <View style={styles.cardMaster}>
                                            <Image source={require("../images/mastercard.png")} style={{ marginTop: '1.5%',width: '18%', height: '21%'}}/>
                                            <Text style={{color: 'white', fontFamily: 'Montserrat-Regular', fontSize: 23, marginTop: '6%', marginLeft: '2%'}}>{payment.number}</Text>
                                            <HStack space={5} justifyContent='flex-start' style={{marginTop: '10%'}}>
                                                <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}}>VALID THRU</Text>
                                                <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}} onPress={() => setCvv(payment.cvv)}>CVV</Text>
                                            </HStack>
                                            <HStack space={47.9} justifyContent='flex-start'>
                                                <Text style={{color: 'white', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '3%'}}>{payment.valid}</Text>
                                                <Text style={{color: 'white', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '3%'}} onPress={() => setCvv(payment.cvv)}>{cvv}</Text>
                                            </HStack>
                                        </View>

                                        : <View style={styles.cardVisa}>
                                            <Image source={require("../images/visa.png")} style={{ marginTop: '1.5%',width: '18%', height: '21%'}}/>
                                            <Text style={{color: '#000', fontFamily: 'Montserrat-Regular', fontSize: 23, marginTop: '6%', marginLeft: '2%'}}>{payment.number}</Text>
                                            <HStack space={5} justifyContent='flex-start' style={{marginTop: '10%'}}>
                                                <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}}>VALID THRU</Text>
                                                <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}} onPress={() => setCvv(payment.cvv)}>CVV</Text>
                                            </HStack>
                                            <HStack space={47.9} justifyContent='flex-start'>
                                                <Text style={{color: '#000', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '3%'}}>{payment.valid}</Text>
                                                <Text style={{color: '#000', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '3%'}} onPress={() => setCvv(payment.cvv)}>{cvv}</Text>
                                            </HStack>
                                        </View>
                                    )
                                : <Text style={{marginTop: '5%', marginLeft: '3%', marginBottom: '3%',fontFamily: 'Roboto-Regular', fontSize: 20}}>Opps... don't have any cads yet</Text>
                                }
                            </View>

                        </Animated.ScrollView>
                    </NativeBaseProvider>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    timeOrdered: {
        fontFamily: 'Roboto-Regular',
        fontSize: 25,
        marginTop: '10%',
        alignSelf: 'center',
        backgroundColor:'#000',
        color: 'white', 
        paddingHorizontal: '3%', 
        paddingVertical: '3%',
        borderRadius: 20
    },
    back: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        marginTop: '10.5%',
        marginBottom: '2%',
        marginLeft: '4%',
        padding: '2.5%',
        borderRadius: 20
    },
    cardMaster: {
        backgroundColor: '#1e2125',
        marginTop: '5%',
        paddingTop: '5%',
        paddingLeft: '5%',
        borderRadius: 25,
        marginBottom: '25%',
        marginLeft: '4%',
        marginRight: '4%'
    },
    cardVisa: {
        backgroundColor: '#e0e0e0',
        marginTop: '5%',
        paddingTop: '5%',
        paddingLeft: '5%',
        borderRadius: 25,
        marginBottom: '25%',
        marginLeft: '4%',
        marginRight: '4%',
        borderWidth: 1,
        borderColor: '#c9c6c5'
    },
    noPhoto: {
        width: 220,
        height: 220,
        marginLeft: '4%',
        marginRight: '2%',
        justifyContent: 'center',
        backgroundColor: '#c0c1c2',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#a6a8ab'
    },
    addCard: {
        marginRight: '4%',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'grey',
        textAlign: 'center',
        paddingHorizontal: '0.5%',
        paddingTop: '0.5%',
        backgroundColor: '#f2f2f2',
    },
    modal: {
        backgroundColor: 'white',
        alignSelf: 'center',
        width: '85%',
        marginTop: '30%',
        borderRadius: 20,
    },
    loginUsernameInput: {
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
    edit: {
        alignSelf: 'flex-end',
        marginRight: '4%',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: '4%',
        paddingVertical: '2%',
        marginBottom: '5%',
        backgroundColor: '#fff'
    }
})