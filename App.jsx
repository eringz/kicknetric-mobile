import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Platform,
  StatusBar,
  FlatList,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {styles} from './src/styles'
import {DeviceList} from './src/DeviceList';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  
  const peripherals = new Map()
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
 
  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
          let peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };

  useEffect(() => {
    // turn on bluetooth if it is not on
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    //start bluetooth manager
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });

    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );

    //Requesting permissions on access fine location based on Platform
    if(Platform.OS === 'android' && Platform.Version >= 23){
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then( result => {
        if(result){
          console.log('Permission is OK');
        }else{
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if(result) {
              console.log('User Accepted');
            } else {
              console.log('User refused');
            }
          })
        }
      })
    }
    
    //stop discover, connect and scan
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };

  }, []);

  // start scan
  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  //connect to peripheral
  const connectToPeripheral = peripheral => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('failed to bond');
      });
  };

  //disconnect from peripheral
  const disconnectFromPeripheral = peripheral => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView>
      <StatusBar 
        barStyle={ isDarkMode ? 'light-conten' : 'dark-content' }
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={[
            styles.title, 
            { color: isDarkMode ? Colors.white : Colors.black }
          ]}
        >
          Kicknetric Caution Device 
        </Text>
        <TouchableOpacity
          activeOpacity={ 0.5 }
          style={ styles.scanButton }
          onPress={ startScan }
        >
          <Text style={styles.scanButtonText}>
            { isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>   
        </TouchableOpacity>
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}
        >
          Paired Devices:
        </Text>
        {connectedDevices.length > 0 ? (
          <FlatList 
            data={connectedDevices}
            renderItem={({item}) => (
              <DeviceList 
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={item => item.id }
          />
        ) : (
          <Text style={styles.noDevicesText}>No connected devices</Text>
        )}
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black },
          ]}
        >
          Available Devices:
        </Text>
        {discoveredDevices.length > 0 ? (
          <FlatList 
            data={ discoveredDevices}
            renderItem={({item}) => (
              <DeviceList 
                peripheral={item}
                connect={connectToPeripheral}
                disconnect={disconnectFromPeripheral}
              />
            )}
            keyExtractor={ item => item.id }
          />
        ) : (
          <Text style={styles.noDeviceText}>No Bluetooth devices found</Text>
        )}
        
      </View>
    </SafeAreaView>
    
  );
};


export default App;