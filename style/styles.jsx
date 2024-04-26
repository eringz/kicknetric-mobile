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
});