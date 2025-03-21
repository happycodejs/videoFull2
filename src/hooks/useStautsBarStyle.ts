import {useColorScheme} from 'react-native';

export const useStatusBarStyle = (backgroundColor?: string) => {
  const isDarkMode = useColorScheme() === 'dark';

  // 如果提供了背景色，根据背景色的亮度判断
  if (backgroundColor) {
    // 将十六进制颜色转换为RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // 计算亮度
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // 如果亮度大于 128，使用深色文字
    return brightness > 128 ? 'dark-content' : 'light-content';
  }

  // 如果没有提供背景色，根据系统主题判断
  return isDarkMode ? 'light-content' : 'dark-content';
};
