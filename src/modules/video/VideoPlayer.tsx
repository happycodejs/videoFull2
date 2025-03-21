import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import {useRoute, useNavigation} from '@react-navigation/native';

const VideoPlayer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const route = useRoute<any>();
  const navigation = useNavigation();
  const {url} = route.params;

  useEffect(() => {
    // 设置3秒超时
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
        ToastAndroid.show('视频加载超时，请检查网络连接', ToastAndroid.SHORT);
      }
    }, 5000);

    // 清理定时器
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Video
        source={{uri: url}}
        style={styles.video}
        controls={true}
        resizeMode="contain"
        onError={error => {
          console.log('视频错误:', error);
          setHasError(true);
          setIsLoading(false);
          ToastAndroid.show(
            '视频加载失败，请检查链接是否正确',
            ToastAndroid.SHORT,
          );
        }}
        onLoad={() => {
          setIsLoading(false);
          setHasError(false);
        }}
        onLoadStart={() => {
          setIsLoading(true);
          setHasError(false);
        }}
      />
      {isLoading && !hasError && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>视频加载中...</Text>
        </View>
      )}

      {hasError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>视频加载失败</Text>
          <Text style={styles.errorSubText}>请检查网络或视频链接是否正确</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>返回</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  errorSubText: {
    color: '#999',
    fontSize: 14,
  },
});

export default VideoPlayer;
