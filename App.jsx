import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Platform,
  StatusBar,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {styles} from './style/styles';


const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  console.log(`Platform: ${Platform.OS}`);
  console.log(`Version: ${Platform.Version}`);

  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const [connectedDevices, setConnectedDevices] = useState([]);

  const handleGetConnectedDevices = () => {
    BleManager.getConnectedPeripherals([]).then(results => {
      if(results.length === 0) {
        console.log('No connected bluetooth devices');
      } else {
        for(let i = 0; i < results.length; i++) {
         ; let peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setConnectedDevices(Array.from(peripherals.values()));
        }
      }
    });
  };

  useEffect(() => {
    //turn on bluetooth if it is not on
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    //start bluetooth manager
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    })

    // 
    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('Scan is stopped');
      }
    );
   
    console.log('Before permission check');
    if(Platform.OS === 'android' && Platform.Version >= 23) {
      console.log('Checking ACCESS_FINE_LOCATION permission');
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if(result) {
          console.log('Permission is OK');
        } else {
          console.log('Requesting ACCESS_FINE_LOCATION permission');
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if(result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          })
        }
      })
    }
    console.log('After permission check');
  }, []);

  const startScan = () => {
    if(!isScanning) {
      BleManager.scan([], 5, true)
      .then(() => {
        console.log('Scanning...');
        setIsScanning(true);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }



  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const RenderItem = ({peripheral}) => {
    const {name, rssi, connected} = peripheral;
    return(
      <>
        {name && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
          }}>
            <View style={styles.deviceItem}>
              <Text style={styles.deviceName}>{name}</Text>
              <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
            </View>
            <TouchableOpacity
              onPress= { () =>
                connected
                ? disconnectFromPeripheral(peripheral)
                : connectToPeripheral(peripheral)
              }
              style={styles.deviceButton}
            >
              <Text
                style={
                  [
                    styles.scanButtonText, 
                    {
                      fontWeight: 'bold', 
                      fontSize: 16
                    }
                  ]
                }
              >
                {connected ? 'Disconnect' : 'Connect'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    )
  }

 
  return (
    <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        bacgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}
        contentContainerStyle={styles.mainBody}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View 
          style={{backgroundColor: isDarkMode ? Colors.darkeer : Colors.lighter,
          marinBottom: 40,}}
        >
          <View>
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
                color: isDarkMode ? Colors.white : Colors.black,
              }}
            >
              Kicknetric Caution Device
            </Text>
            <TouchableOpacity 
              activeOpacity={0.5} 
              style={styles.buttonStyle}
              onPress={startScan}
              >
              <Text style={styles.buttonTextStyle}>
                {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {connectedDevices.length > 0 ? (
          <FlatList
            data={connectedDevices}
            renderItem={({item}) => <RenderItem peripheral={item} />} 
            keyExtractor={item => item.id}
          />
        ) :(
          <Text style={styles.noDevicesText}>No connected devices</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;