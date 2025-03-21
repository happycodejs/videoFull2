import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  PanResponder,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import {useStatusBarStyle} from '../../hooks/useStautsBarStyle';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

import logo from '../../assets/images/title-pic.png';
import icon_search from '../../assets/icons/icon-player.png';
import icon_add from '../../assets/icons/icon-item.png';
import icon_remove from '../../assets/icons/icon-remove.png';
import {save, load} from '../../utils/Storage';

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState('本地视频');
  const [searchText, setSearchText] = useState('');
  const statusBarStyle = useStatusBarStyle();

  const [videoData, setVideoData] = useState<any>([]);
  const [filteredData, setFilteredData] = useState(videoData);

  const getInitData = async () => {
    const cacheVideoData = await load('videoData');
    if (!cacheVideoData) {
      setVideoData([]);
      setFilteredData([]);
    } else {
      const parse = JSON.parse(cacheVideoData);
      if (parse) {
        setVideoData(parse);
        setFilteredData(parse);
      }
    }
  };

  useEffect(() => {
    getInitData();
  }, []);

  const handleDelete = (id: string) => {
    console.log('id', id);
    const newVideoData = videoData.filter((item: any) => item.id !== id);
    setVideoData(newVideoData);
    setFilteredData(newVideoData);
    save('videoData', JSON.stringify(newVideoData));
  };

  // 添加新的方法来处理新视频
  const handleAddNewVideo = (newVideo: {title: string; url: string}) => {
    console.log('newVideo', newVideo);
    const newVideoItem = {
      id: (videoData.length + 1).toString(),
      title: newVideo.title,
      size: '- MB', // 这里可以根据实际需求设置大小
      url: newVideo.url,
    };
    const newVideoData = [...videoData, newVideoItem];
    setVideoData(newVideoData);
    setFilteredData(newVideoData);
    save('videoData', JSON.stringify(newVideoData));
  };

  const handleLocalVideo = async () => {
    // const hasPermission = await checkMediaPermissions();
    // console.log('hasPermission', hasPermission);

    // if (!hasPermission) {
    //   return;
    // }
    const options: ImageLibraryOptions = {
      mediaType: 'video',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    try {
      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('错误', result.errorMessage);
        return;
      }

      if (result.assets && result.assets[0]) {
        const video = result.assets[0];
        const fileSize = video.fileSize
          ? (video.fileSize / (1024 * 1024)).toFixed(2)
          : '0';

        const newVideoItem = {
          id: (videoData.length + 1).toString(),
          title: video.fileName || '未命名视频.mp4',
          size: `${fileSize} MB`,
          url: video.uri,
        };

        const newVideoData = [...videoData, newVideoItem];
        setVideoData(newVideoData);
        setFilteredData(newVideoData);
        save('videoData', JSON.stringify(newVideoData));
      }
    } catch (error) {
      Alert.alert('错误', '选择视频时出现错误');
      console.error(error);
    }
  };

  const handleAddVideo = () => {
    if (activeTab === '网络视频') {
      navigation.navigate('AddNetVideo', {onSave: handleAddNewVideo});
    } else {
      // 处理添加本地视频的逻辑
      handleLocalVideo();
    }
  };

  const handlePlayVideo = (videoUrl: string) => {
    console.log('videoUrl', videoUrl);
    navigation.navigate('VideoPlayer', {url: videoUrl});
  };

  const renderItem = ({item}: {item: any}) => {
    // 创建一个动画值，初始值为0，用于控制列表项的水平位移
    const rowTranslateAnimatedValue = new Animated.Value(0);
    const deleteButtonOpacityValue = new Animated.Value(0);

    const panResponder = PanResponder.create({
      // 添加这个配置来处理点击事件
      onStartShouldSetPanResponder: () => false,
      // 当用户开始触摸屏幕时，返回true，允许响应手势
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const {dx, dy} = gestureState;
        // 水平移动距离大于垂直移动距离，且水平移动超过5像素时才响应滑动
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5;
      },
      // 当用户移动手指时，更新动画值
      onPanResponderMove: (_, gestureState) => {
        // gestureState.dx 是水平方向的移动距离
        if (gestureState.dx < 0) {
          // 如果用户向左移动，更新动画值
          rowTranslateAnimatedValue.setValue(gestureState.dx);
        }
      },
      // 当用户释放手指时，执行动画
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -15) {
          // 如果用户向左滑动超过50像素，执行动画，将列表项向左移动75像素
          // 使用弹簧动画滑动到-75位置（显示删除按钮）
          Animated.spring(rowTranslateAnimatedValue, {
            toValue: -33,
            useNativeDriver: true,
          }).start();
          Animated.timing(deleteButtonOpacityValue, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        } else {
          // 如果用户向左滑动不超过50像素，执行动画，将列表项恢复到原来的位置
          // 使用弹簧动画滑动到0位置（隐藏删除按钮）
          Animated.spring(rowTranslateAnimatedValue, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          Animated.timing(deleteButtonOpacityValue, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    });

    return (
      <Animated.View
        style={[
          styles.videoItem,
          {
            transform: [{translateX: rowTranslateAnimatedValue}],
          },
        ]}
        {...panResponder.panHandlers}>
        <LinearGradient
          colors={['#C4E2F8', '#FBC6C6']} // 自定义你的渐变色
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.videoItemGradient}>
          <TouchableOpacity
            onPress={() => {
              handlePlayVideo(item.url);
            }}
            activeOpacity={0.7}
            style={styles.videoItemWrapper}>
            <Image source={icon_add} style={styles.videoIcon} />
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoSize}>{item.size}</Text>
            </View>
          </TouchableOpacity>
          <Animated.View
            style={[styles.deleteButton, {opacity: deleteButtonOpacityValue}]}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Image source={icon_remove} style={styles.deleteButtonIcon} />
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    );
  };
  // 白色

  const onSearchPress = () => {
    if (!searchText.trim()) {
      // 如果搜索框为空，显示所有数据
      setFilteredData(videoData);
      return;
    }

    // 根据标题搜索，不区分大小写
    const filtered = videoData.filter((item: any) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor="transparent"
        translucent
      />
      <View>
        <LinearGradient
          colors={['#49B2FB', '#FE5757']} // 自定义你的渐变色
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.headerBoxGradient}>
          <View style={styles.titleBox}>
            <Image source={logo} style={styles.logo} />
          </View>

          <View style={styles.searchContainer}>
            <LinearGradient
              colors={['#7FC5F9', '#E1949F']} // 自定义你的渐变色
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.searchBoxGradient}>
              <Image source={icon_search} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="搜索关键词"
                value={searchText}
                onChangeText={setSearchText}
              />
            </LinearGradient>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={onSearchPress}>
              <Text style={styles.searchButtonText}>搜索</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === '本地视频' && styles.activeTab]}
              onPress={() => setActiveTab('本地视频')}>
              <Text style={styles.tabText}>本地视频</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === '网络视频' && styles.activeTab]}
              onPress={() => setActiveTab('网络视频')}>
              <Text style={styles.tabText}>网络视频</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <TouchableOpacity
        style={styles.addButtonWrapper}
        onPress={handleAddVideo}>
        <LinearGradient
          colors={['#49B2FB', '#FE5757']} // 自定义你的渐变色
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.addButtonGradient}>
          <Text style={styles.addButtonText}>+ 添加{activeTab}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
    paddingTop: 24,
  },
  headerBoxGradient: {
    paddingHorizontal: 10,
  },
  titleBox: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  logo: {
    width: 92,
    height: 20,
    resizeMode: 'cover',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 18,
  },
  searchBoxGradient: {
    flex: 1,
    borderRadius: 4,
    marginRight: 12,
    height: 32,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  searchIcon: {
    width: 20,
    height: 15,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 32,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  searchButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 4,
  },
  searchButtonText: {
    color: '#C70000',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 5,
    opacity: 0.5,
  },
  activeTab: {
    borderBottomWidth: 4,
    borderBottomColor: '#FFFFFF',
    opacity: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  addButtonWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addButtonGradient: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  videoList: {
    flex: 1,
  },
  // 列表项样式
  videoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  videoItemGradient: {
    flex: 1,
    borderRadius: 5,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoItemWrapper: {
    flex: 1,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  videoIcon: {
    width: 54,
    height: 40,
    marginRight: 18,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    color: '#FF5656',
    marginBottom: 5,
  },
  videoSize: {
    fontSize: 14,
    color: '#31ABE3',
  },
  // 滑动删除相关样式
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
  deleteButton: {
    backgroundColor: '#D0021B',
    height: 70,
    width: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0,
  },
  deleteButtonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'cover',
  },
});

export default Home;
