import {
  View, 
  Text, 
  StyleSheet,
  Platform,
  PermissionsAndroid,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {useState, useEffect} from 'react';
import BleManager from 'react-native-ble-manager';


const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

/**
 * enabling bluetooth
 * scanning the bluetooth peripherals
 * named Kicknetric Caution Device ID: 10:06:1C:41:E7:AA
 * connecting with esp32 with SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b" 
 * pCharacteristic "beb5483e-36e1-4688-b7f5-ea07361b26a8"
 * beb5483e-36e1-4688-b7f5-ea07361b26a8
 * getting data from Kicknetric Caution Device peripheral
 */

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notificationValue, setNotificationValue] = useState(null);

  useEffect(() => {

    /**
     * REQUESTING PERMISSION TO ENABLING BLUETOOTH ONCE THE APP START
     */
    BleManager.enableBluetooth()
    .then(() => {
      //Success code
      console.log('already enabled or user confirm')
    })
    .catch((error) => {
      //failure code
      console.log('refues to enable');
    })

    /**
     * INITIALIZED BLE MODULE
     */
    BleManager.start({ showAlert: false }).then((res) => {
      // Success code
      console.log("Module initialized");
    });

    
    const connectAndSubscribe = async () => {
      try {
        // Connect to the peripheral
        await BleManager.connect("10:06:1C:41:E7:AA");
        setIsConnected(true);
        console.log("Connected to peripheral");

        // Subscribe to notifications
        await BleManager.startNotification(
          "10:06:1C:41:E7:AA", // peripheral UUID
          "4fafc201-1fb5-459e-8fcc-c5c9c331914b", // service UUID
          "beb5483e-36e1-4688-b7f5-ea07361b26a8", // characteristic UUID
          1234 // Optional: Notification identifier (can be any number)
        );
        console.log("Notification started");

        // Success: Handle notification events or perform other actions
      } catch (error) {
        // Failure: Handle errors
        console.error("Error:", error);
      }
    };

    // Call the async function
    connectAndSubscribe();

    // Event listener for characteristic notifications
    const subscription = BleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value }) => {
        // Update notification value
        setNotificationValue(value);
      }
    );



    // Event listener for characteristic notifications
    // const subscription = BleManagerEmitter.addListener(
    //   'BleManagerDidUpdateValueForCharacteristic',
    //   ({ value, peripheral, characteristic, service }) => {
    //     // Handle notification events here
    //     console.log("Received notification:", value);
    //     // Update UI or perform any other actions based on the notification
    //   }
    // );

    // BleManager.scan([], 5, true).then(() => {
    //   // Success code
    //   console.log("Scan started");
    // });

    /**
     * REQUESTING PERMISSION TO ACCESS FINE LOCATION BASED ON PLATFORM
     */
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

    
    return () => {
      subscription.remove();
    };

  }, [])

  
  return(
    <View style={styles.container}>
      {/* View for lights */}
      <View style={[styles.groupBox, styles.lights]}>
        <View style={[styles.box]}></View>
        <View style={[styles.box]}></View>
        <View style={[styles.box]}></View>
      </View>
      {/* View for sensor visuals */}
      <View style={[styles.groupBox, styles.visuals]}>
        {isConnected ? (
          <Text>Kicknetric Caution Device is connected</Text>
        ) : (
          <Text>Kicknetric Caution Device is not connected</Text>
        )}
      </View>
      <View style={[styles.groupBox, styles.datas]}>
        <Text>Notification Value: {notificationValue}</Text>
      </View>
      <View style={[styles.groupBox, styles.footer ]}>
        <Text 
          style={{
            fontSize: 22, 
            color: '#2F9832', 
            }}
        >
          Kicknetric Caution Device
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupBox: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 4,
    borderColor: '#1E1F21',
  },
  box: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#1E1F21',
  },
  lights: {
    // backgroundColor: "red",
    // borderColor: 'red',
    flexGrow: 1,
  },
  visuals: {
    // borderColor: 'green',
    flexGrow: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datas: {
    // borderColor: 'blue',
    flexGrow: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flexGrow: .5,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default App;