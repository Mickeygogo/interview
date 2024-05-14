import { useRef } from 'react';

const usePlayAudio = () => {
  // 播放音频的实例
  const currentAudio = useRef(null);

  const stopAudioFn = (cd) => {
    if (currentAudio.current) {
      cd?.();
      currentAudio.current.pause(); // 暂停当前播放
      currentAudio.current.currentTime = 0; // 将播放位置重置到开始
      // currentAudio?.current
      currentAudio.current.removeEventListener('loadeddata', handleAudioLoad);
      currentAudio.current.removeEventListener('ended', stopAudioFn);
      currentAudio.current = null; // 清除对当前音频对象的引用
    }
  };

  const handleAudioLoad = () => {
    // 当音频数据足够开始播放时尝试播放
    if (currentAudio.current.readyState >= 2) {
      currentAudio.current.play();
    }
  };

  const playAudio = (url, cd) => {
    // 如果当前有音频对象，先移除事件监听器
    if (currentAudio.current) {
      currentAudio.current.removeEventListener('loadeddata', handleAudioLoad);
      currentAudio.current.current = null;
    }

    currentAudio.current = new Audio(url);
    currentAudio.current?.addEventListener('loadeddata', handleAudioLoad);
    currentAudio.current?.addEventListener('ended', stopAudioFn.bind(this, cd));
  };

  return {
    playAudio,
    stopAudioFn,
    currentAudio: currentAudio.current,
  };
};

export default usePlayAudio;
