import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Audio } from 'expo-av';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../../config/colors';

type Props = { audioUrl?: string };

const WAVE_HEIGHTS = [6, 10, 16, 12, 20, 14, 22, 18, 26, 20, 18, 24, 16, 20, 14, 18, 12, 16, 10, 8];

const Waveform = ({ progress }: { progress: number }) => {
  const activeCount = Math.floor(progress * WAVE_HEIGHTS.length);
  return (
    <Svg width={WAVE_HEIGHTS.length * 10} height="28" viewBox={`0 0 ${WAVE_HEIGHTS.length * 10} 28`}>
      {WAVE_HEIGHTS.map((h, i) => (
        <Rect
          key={i}
          x={i * 10 + 2}
          y={(28 - h) / 2}
          width="4"
          height={h}
          rx="2"
          fill={i <= activeCount ? colors.gold : colors.textLight}
          opacity={i <= activeCount ? 1 : 0.3}
        />
      ))}
    </Svg>
  );
};

export const AudioPlayer = ({ audioUrl }: Props) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  const onStatus = (status: any) => {
    if (status.isLoaded) {
      setProgress((status.positionMillis || 0) / (status.durationMillis || 1));
      if (status.didJustFinish) { setIsPlaying(false); setProgress(0); }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) {
      const { sound: s } = await Audio.Sound.createAsync({ uri: audioUrl! }, { shouldPlay: true }, onStatus);
      setSound(s);
      setIsPlaying(true);
      return;
    }
    if (isPlaying) { await sound.pauseAsync(); setIsPlaying(false); }
    else { await sound.playAsync(); setIsPlaying(true); }
  };

  if (!audioUrl) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <View style={styles.waveArea}>
          <Waveform progress={progress} />
          <Text style={styles.label}>NARRATION DU GRIOT</Text>
        </View>
      </View>
      <View style={styles.accentLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: colors.indigo,
    paddingBottom: 20,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    gap: 20,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 16, color: colors.white },
  waveArea: { flex: 1 },
  label: { 
    fontFamily: 'Poppins_700Bold', 
    fontSize: 9, 
    color: colors.gold, 
    letterSpacing: 2, 
    marginTop: 8,
    opacity: 0.8,
  },
  accentLine: {
    height: 2,
    width: '100%',
    backgroundColor: colors.primary,
    opacity: 0.3,
  }
});
