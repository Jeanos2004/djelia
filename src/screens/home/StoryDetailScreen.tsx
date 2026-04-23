import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, ActivityIndicator, Chip, IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { getStoryById, Story } from '../../services/dataService';
import { AudioPlayer } from '../../components/audio/AudioPlayer';
import { useAppContext } from '../../store/AppProvider';
import { colors } from '../../config/colors';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, 'StoryDetail'>;
};

export const StoryDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params as { id: string };
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, toggleFavorite } = useAppContext();

  const handleToggleFavorite = (storyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(storyId);
  };

  useEffect(() => {
    const fetchStory = async () => {
      const data = await getStoryById(id);
      if (data) setStory(data);
      setLoading(false);
    };
    fetchStory();
  }, [id]);

  if (loading || !story) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isFavorite = favorites.includes(story.id);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: story.imageUrl }} style={styles.coverImage} />
        
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleWrapper}>
              <Text style={styles.meta}>{story.region} • {story.ethnicGroup}</Text>
              <Text style={styles.title}>{story.title}</Text>
            </View>
            <IconButton
              icon={isFavorite ? "heart" : "heart-outline"}
              iconColor={isFavorite ? colors.primary : colors.textMid}
              size={28}
              onPress={() => handleToggleFavorite(story.id)}
            />
          </View>
          
          <View style={styles.divider} />

          <View style={styles.tagsContainer}>
            <Chip style={styles.chip} textStyle={styles.chipText}>{story.category}</Chip>
          </View>

          <Text style={styles.storyContent}>{story.content}</Text>
          
          <View style={styles.signature}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Fin du récit</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>
      </ScrollView>

      {story.audioUrl && (
        <AudioPlayer audioUrl={story.audioUrl} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  coverImage: {
    width: '100%',
    height: 350,
  },
  content: {
    padding: 30,
    backgroundColor: colors.background,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
  },
  meta: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 34,
    color: colors.text,
    lineHeight: 42,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: colors.gold,
    marginVertical: 25,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  chip: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 10,
    color: colors.primary,
  },
  storyContent: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20,
    lineHeight: 36,
    color: colors.text,
    textAlign: 'justify',
  },
  signature: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    opacity: 0.3,
  },
  signatureLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textLight,
  },
  signatureText: {
    marginHorizontal: 20,
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
