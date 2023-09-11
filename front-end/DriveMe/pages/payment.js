import {View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated, Modal, TextInput, TouchableOpacity, Alert} from 'react-native'
import {NativeBaseProvider, HStack} from 'native-base'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useEffect, useState, useRef } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'




export const Payment = ({navigation, route}) => {

    const [payment, setPayment] = useState('None') // -> payment data
    const [cvv, setCvv] = useState('* * *') // -> cvv (for ***)
    const [paymentSys1, setPaymentSys1] = useState('') // -> payment system for conditional card style
    const [forProfile, setForProfile] = useState({}) // -> user data
    
    const [modal, setModal] = useState(false) // -> payment modal 

    const [paymentSys, setPaymentSys] = useState('') // -> payment creation
    const [number, setNumber] = useState('') // -> --||--
    const [valid, setValid] = useState('') // -> --||--
    const [cvvdate, setCVV] = useState(0) // -> --||--
    const total = route.params.rentedCar.price_per_day * route.params.days // -> Total price

    // FIRST DATA
    useEffect(() => {
      fetch(`http://192.168.28.69:8000/user/${route.params.user.username}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${route.params.token}`
        }
      })
      .then(response => response.json())
      .then((data) => {
        if (data.payment_details != null) {
          setPayment(data.payment_details)
          setPaymentSys1(data.payment_details.payment_sys)
        }
        setForProfile(data)
      })
    }, [cvv, modal])

    // UPDATE USER DATA 
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
            setForProfile(data)
            // console.log(data.payment_details)
        })
    }
    
    // CREATE A PAYMENT 
    const create_payment = (payments) => {
        fetch('http://192.168.28.69:8000/create-payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Token ${route.params.token}`
            },
            body: JSON.stringify(payments)
        }).then(() => {
            setPaymentSys1(paymentSys)
            console.log(payments)
            update(payments)
        }
        )
    }

    // CAR RENTAL 
    const rentCar = (carData) => {
        fetch(`http://192.168.28.69:8000/rented-car/${forProfile.id}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${route.params.token}`
          },
          body: JSON.stringify(carData)
        })
        .then(response => response.json())
        .then((data) => {
          console.log(data)
        })
    }


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
    
    // FONTS 
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require('../fonts/Roboto-Bold.ttf'),
        'Roboto-Light': require('../fonts/Roboto-Light.ttf'),
        'Roboto-Black': require('../fonts/Roboto-Black.ttf'),
        'Roboto-Regular': require('../fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('../fonts/Roboto-Medium.ttf'),
        'Montserrat-Regular': require('../fonts/Montserrat-Regular.ttf'),
        'Montserrat-Medium': require('../fonts/Montserrat-Medium.ttf')
      });
    
    if (!fontsLoaded) {
        return null;
    }

    return (
      <NativeBaseProvider>
        {/* PAYMENT MODAL  */}
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
                      console.log(number.length)
                      if ((paymentSys == 'Mastercard' || paymentSys == 'VISA') && number.length == 19 && valid.length != 4 && cvv.length != 3) {
                        endAnimateElem()
                        create_payment({
                            'payment_sys':paymentSys,
                            'number':number,
                            'valid':valid,
                            'cvv': parseInt(cvvdate)
                        })
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
        <Animated.ScrollView style={[{ marginTop: "9%", backgroundColor: "#F3F4F6" }, opacityStyle]}>

          {/* BACK-ARROW AND USER  */}
          <HStack space={20} justifyContent="space-between" style={{marginTop: '2%'}}>
            <AntDesign
              name="arrowleft"
              size={24}
              color="black"
              style={styles.arrow}
              onPress={() => navigation.goBack()}
            />
            <TouchableWithoutFeedback onPress={() => navigation.navigate('User', {'user':forProfile, 'token':route.params.token})}>
              <Image
                source={{uri: route.params.user.photo}}
                style={styles.account}
              />
            </TouchableWithoutFeedback>
          </HStack>

          {/* CARDS */}
          <View style={{ marginLeft: "8%", marginRight: "8%" }}>
            <HStack justifyContent="space-between">
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 30,
                  marginTop: "10%",
                }}
              >
                Your Card
              </Text>
              {payment == 'None' &&
                <Entypo
                name="plus"
                size={24}
                color="white"
                style={styles.addCard}
                onPress={() => {setModal(true)}}
              />
              }
            </HStack>
            <Text style={styles.bankcard}>Bank Card</Text>
            {payment != 'None' 
            ? <View>
            {paymentSys1.id == 2 
                ? <View style={styles.cardMaster}>
                    <Image source={require("../images/mastercard.png")} style={{ width: '18%', height: '21%'}}/>
                    <Text style={{color: 'white', fontFamily: 'Montserrat-Regular', fontSize: 23, marginTop: '6%', marginLeft: '2%'}}>{payment.number}</Text>
                    <HStack space={5} justifyContent='flex-start' style={{marginTop: '10%'}}>
                        <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}}>VALID THRU</Text>
                        <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}} onPress={() => setCvv(payment.cvv)}>CVV</Text>
                    </HStack>
                    <HStack space={47.9} justifyContent='flex-start'>
                        <Text style={{color: 'white', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '3%'}}>{payment.valid}</Text>
                        <Text style={{color: 'white', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '3.5%'}} onPress={() => setCvv(payment.cvv)}>{cvv}</Text>
                    </HStack>
                  </View>

                : <View style={styles.cardVisa}>
                    <Image source={require("../images/visa.png")} style={{ width: '20%', height: '21%'}}/>
                    <Text style={{color: '#000', fontFamily: 'Montserrat-Regular', fontSize: 23, marginTop: '6%', marginLeft: '2%'}}>{payment.number}</Text>
                    <HStack space={5} justifyContent='flex-start' style={{marginTop: '10%'}}>
                        <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}}>VALID THRU</Text>
                        <Text style={{color: '#686A6B', fontFamily: 'Roboto-Regular', fontSize: 14, marginLeft: '2%'}} onPress={() => setCvv(payment.cvv)}>CVV</Text>
                    </HStack>
                    <HStack space={47.9} justifyContent='flex-start'>
                        <Text style={{color: '#000', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '3%'}}>{payment.valid}</Text>
                        <Text style={{color: '#000', fontFamily: 'Montserrat-Regular', fontSize: 17, marginLeft: '4%'}} onPress={() => setCvv(payment.cvv)}>{cvv}</Text>
                    </HStack>
                  </View>
            }
            </View>
            : <Text style={styles.opps}>Opps... You don't have any cards yet</Text>
            }
          </View>

          {/* CAR RENTAL AND CHECKOUT  */}
          <View style={{backgroundColor: 'white', borderTopRightRadius: 25, borderTopLeftRadius: 25, paddingTop: '8%'}}>
            <HStack justifyContent='space-between' style={{marginLeft: "6%", marginRight: '6%'}}>
                <Text style={{color: 'grey', fontFamily: 'Roboto-Light', fontSize: 13}}>Rent Car</Text>
                <Text style={{color: 'grey', fontFamily: 'Roboto-Light', fontSize: 13}}>Order №234231</Text>
            </HStack>
            <View
                style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    width: '87.5%',
                    alignSelf: 'center',
                    marginTop: '3%'
                }}
            />
            <HStack justifyContent='space-between' style={{marginLeft: '6%', marginRight: '6%', marginTop: '3%'}}>
                <View style={{marginTop: '3%'}}>
                    <Text style={{fontFamily: 'Roboto-Bold', fontSize: 20}}>{route.params.rentedCar.full_name}</Text>
                    <Text style={{fontFamily: 'Roboto-Light', fontSize: 13, color: 'grey'}}>${route.params.rentedCar.price_per_day} / day x {route.params.days} days</Text>
                </View>
                <Text style={{fontFamily: "Montserrat-Medium", fontSize: 40, fontWeight: 300, marginTop:'2%', marginBottom: '1%'}}><Text style={{fontSize: 23}}>$ </Text>{total}</Text>
            </HStack>
            <View
                style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    width: '87.5%',
                    alignSelf: 'center',
                }}
            />
            {payment != 'None' 
              ? <TouchableOpacity onPress={() => {
                rentCar({
                  'city':route.params.city,
                  'street':route.params.street,
                  'days':route.params.days,
                  'total':total,
                  'car':route.params.rentedCar.id,
                  'payment_details':payment.id
                })
                Alert.alert('Operation Status', 'Success')
                navigation.navigate('User', {'user':forProfile, 'token':route.params.token})
              }}>
                <Text style={styles.payNow}>Pay Now</Text>
              </TouchableOpacity>
            : <View>
              <Text style={{fontFamily: 'Roboto-Medium', fontSize: 25, textAlign: 'center', color: 'red', marginTop: '10%', marginBottom: '50%'}}>Add Your Payment Method Above</Text>
            </View>
            }
          </View>

        </Animated.ScrollView>
      </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    arrow: {
        backgroundColor: 'white',
        padding: '3.5%',
        borderRadius: 17,
        marginLeft: '6%'
    },
    account: {
        backgroundColor: '#22262B',
        paddingHorizontal: '6.2%',
        borderRadius: 17,
        marginRight: '6%',
        width: '13%',
        height: '100%'

    },
    addCard: {
        backgroundColor: "#16181B",
        alignSelf: "center",
        borderRadius: 10,
        padding: '1%',
        marginTop: '10%'
    },
    bankcard: {
        backgroundColor: '#F5B754',
        color: 'white',
        fontFamily: "Roboto-Regular",
        alignSelf: 'flex-start',
        paddingHorizontal: '6%',
        paddingVertical: "3%",
        marginTop: '3%',
        borderRadius: 10
    },
    cardMaster: {
      backgroundColor: '#1e2125',
      marginTop: '18%',
      paddingTop: '8%',
      paddingLeft: '10%',
      paddingRight: '10%',
      paddingBottom: '8%',
      borderRadius: 25,
  },
  cardVisa: {
      backgroundColor: '#e0e0e0',
      marginTop: '18%',
      paddingTop: '8%',
      paddingLeft: '10%',
      paddingRight: '10%',
      paddingBottom: '8%',
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#c9c6c5',
   },
    payNow: {
        color: 'white',
        marginTop: '5%',
        backgroundColor: '#F5B754',
        alignSelf: 'center',
        paddingHorizontal: '35%',
        paddingVertical: '4%',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        borderRadius: 20,
        marginBottom: '40%'
    },
    opps: {
      fontFamily: 'Roboto-Medium',
      fontSize: 30,
      textAlign: 'center',
      marginTop: '20%',
      marginBottom: '20%'
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
})