import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../config/colors';
import { BogolanPattern, KoraIcon, TamTamIcon, HutIcon } from '../../components/common/AfricanPattern';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'ÉCOUTER',
    subtitle: 'Gardiens de la Parole',
    description: 'Plongez dans les récits qui ont forgé notre identité. La voix des anciens n’est jamais perdue, elle attend d’être entendue.',
    Icon: KoraIcon,
    accent: colors.primary,
    watermark: 'SAGESSE',
  },
  {
    id: '2',
    title: 'INTERROGER',
    subtitle: 'Mémoire Augmentée',
    description: 'Le DjeliBot fusionne des siècles de tradition avec la puissance du numérique pour répondre à vos quêtes de savoir.',
    Icon: TamTamIcon,
    accent: colors.accentRed,
    watermark: 'ESPRIT',
  },
  {
    id: '3',
    title: 'TRANSMETTRE',
    subtitle: 'Héritage Éternel',
    description: 'Maîtrisez nos langues et nos arts. Devenez, à votre tour, le maillon qui unit hier à demain.',
    Icon: HutIcon,
    accent: colors.gold,
    watermark: 'RACINES',
  },
];

const AnimatedDecor = ({ scrollX }: { scrollX: Animated.Value }) => {
  return (
    <View style={styles.decorContainer}>
      {slides.map((_, i) => {
        const opacity = scrollX.interpolate({
          inputRange: [(i - 0.5) * width, i * width, (i + 0.5) * width],
          outputRange: [0, 0.05, 0],
          extrapolate: 'clamp',
        });
        const translateX = scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [-100, 0, 100],
        });

        return (
          <Animated.View 
            key={i} 
            style={[styles.watermarkContainer, { opacity, transform: [{ translateX }] }]}
          >
            <Text style={styles.watermarkText}>{slides[i].watermark}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

export const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <BogolanPattern opacity={0.03} />
      
      <AnimatedDecor scrollX={scrollX} />

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [50, 0, -50],
          });

          return (
            <View style={styles.slide}>
              <Animated.View style={[styles.iconWrapper, { opacity }]}>
                <item.Icon size={120} color={item.accent} />
                <View style={[styles.accentLine, { backgroundColor: item.accent }]} />
              </Animated.View>
              
              <Animated.View style={[styles.contentWrapper, { opacity, transform: [{ translateY }] }]}>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Text style={[styles.title, { color: item.accent }]}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </Animated.View>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, i) => {
            const scale = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.8, 1.4, 0.8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View 
                key={i} 
                style={[styles.dot, { transform: [{ scale }], opacity, backgroundColor: slides[i].accent }]} 
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'COMMENCER' : 'SUIVANT'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 50,
  },
  accentLine: {
    width: 40,
    height: 4,
    marginTop: 20,
  },
  contentWrapper: {
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.textLight,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 25,
  },
  description: {
    fontFamily: 'Poppins_300Light',
    fontSize: 16,
    color: colors.textMid,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: colors.indigo,
  },
  buttonText: {
    color: colors.white,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 2,
    fontSize: 12,
  },
  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermarkContainer: {
    position: 'absolute',
    width: width,
    alignItems: 'center',
  },
  watermarkText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 120,
    color: colors.indigo,
    opacity: 0.05,
    letterSpacing: 10,
  },
});
