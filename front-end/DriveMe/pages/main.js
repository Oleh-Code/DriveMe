import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NativeBaseProvider } from 'native-base';


export const Main = ({navigation}) => {

    // FONTS STUFF
    const [fontsLoaded] = useFonts({
        'Roboto-Bold': require('../fonts/Roboto-Bold.ttf'),
        'Roboto-Light': require('../fonts/Roboto-Light.ttf'),
        'Roboto-Black': require('../fonts/Roboto-Black.ttf'),
        'Roboto-Regular': require('../fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('../fonts/Roboto-Medium.ttf'),
      });
    
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
    
    if (!fontsLoaded) {
        return null;
    }
    // -----------------------------------------------------------------------------------------

    return (
        <NativeBaseProvider>
            <View onLayout={onLayoutRootView} style={{backgroundColor: '#24262D'}}>
                <View style={{marginLeft: '5%', marginTop: '20%', marginBottom: '10%'}}>
                    <Text style={{ fontFamily: 'Roboto-Bold', fontSize: 40, color: 'white'}}>Drive Me</Text>
                    <Text style={{ fontFamily: 'Roboto-Light', fontSize: 20, color: 'grey', width: '65%' }}>Rent the car of your dreams with home delivery</Text>
                </View>
                <View>
                    <Image source={require('../images/mustang.png')} style={{width: '175%', height: '69%'}}/>
                    <TouchableOpacity onPress={() => navigation.navigate('List')}>
                        <Text style={styles.getStarted}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    getStarted: {
        color: 'black',
        textAlign: 'center',
        fontFamily: 'Roboto-Black',
        fontSize: 20,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: '3.8%',
        width: '90%',
        alignSelf: 'center',
        marginTop: '5%'
    }
})
