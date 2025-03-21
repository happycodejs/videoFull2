import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useStatusBarStyle} from '../../hooks/useStautsBarStyle';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';

import icon_back from '../../assets/icons/icon-back.png';
import icon_save from '../../assets/icons/icon-save.png';

const AddNetVideo = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [videoName, setVideoName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const statusBarStyle = useStatusBarStyle();

  const route = useRoute<any>();
  const {onSave} = route.params;

  const handleSave = () => {
    // 验证输入
    if (!videoName.trim() || !videoUrl.trim()) {
      Alert.alert('提示', '请输入视频名称和地址');
      return;
    }

    // 调用父组件传入的保存方法
    onSave({
      title: videoName.trim(),
      url: videoUrl.trim(),
    });

    // 返回上一页
    navigation.goBack();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={['#4B91F7', '#FF6B6B']}
        style={styles.header}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image source={icon_back} style={styles.backButtonIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>添加网络视频</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Image source={icon_save} style={styles.saveButtonIcon} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="输入网络视频名称"
          placeholderTextColor="#CCCCCC"
          value={videoName}
          onChangeText={setVideoName}
        />
        <TextInput
          style={[styles.input, styles.urlInput]}
          placeholder="输入网络视频地址..."
          placeholderTextColor="#CCCCCC"
          value={videoUrl}
          onChangeText={setVideoUrl}
          multiline
          numberOfLines={6}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 26,
  },
  backButton: {
    padding: 8,
  },
  backButtonIcon: {
    width: 16,
    height: 16,
    resizeMode: 'cover',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonIcon: {
    width: 58,
    height: 28,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFC6C6',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
    height: 44,
  },
  urlInput: {
    height: 182,
    textAlignVertical: 'top',
  },
});

export default AddNetVideo;
