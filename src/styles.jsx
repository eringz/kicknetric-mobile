import {StyleSheet, Dimensions} from 'react-native';

const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
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
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noDevicesText: {
    // textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },

  deviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    
  },
  deviceItem: {
    marginBottom: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 14,
  },
  deviceButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 5,
    marginBottom: 20,
    width: 100,
  },
});