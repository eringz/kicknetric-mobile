import {StyleSheet, Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  
  noDevicesText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },

  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  deviceInfo: {
    fontSize: 14,
    marginLeft: 20,
  },

  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 5,
    borderRadius: 5,
    marginBottom: 20,
    marginRight: 10,
    paddingHorizontal: 18,
  },
  

  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  
});