import {Platform, Alert, Linking} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

export const checkMediaPermissions = async () => {
  try {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });

    if (!permission) {
      return false;
    }

    const result = await check(permission);

    switch (result) {
      case RESULTS.GRANTED:
        return true;
      case RESULTS.DENIED:
        const requestResult = await request(permission);
        return requestResult === RESULTS.GRANTED;
      case RESULTS.BLOCKED:
        Alert.alert('权限被拒绝', '请在系统设置中允许访问相册权限', [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '去设置',
            onPress: () => {
              // 打开应用设置
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
        ]);
        return false;
      default:
        return false;
    }
  } catch (error) {
    console.error('权限检查错误:', error);
    return false;
  }
};
