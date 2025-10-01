import { Alert, Platform, ToastAndroid } from 'react-native';

// PUBLIC_INTERFACE
export function toast(msg: string): void {
  /** Cross-platform toast/alert helper */
  if (Platform.OS === 'android' && ToastAndroid) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('', msg);
  }
}
