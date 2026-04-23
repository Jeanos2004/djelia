import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { colors } from '../../config/colors';
import { BogolanPattern, DjeliaLogo } from '../../components/common/AfricanPattern';
import { useAppContext } from '../../store/AppProvider';

const { width, height } = Dimensions.get('window');

type Message = { id: string; text: string; sender: 'user' | 'bot'; };

export const DjeliBotScreen = ({ route }: any) => {
  const { user } = useAppContext();
  const initialMessage = route.params?.initialMessage;
  
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: `N'ba di ${user?.name || 'cher ami'} ! Je suis DjeliBot. Mon savoir puise dans les racines de notre terre. Que souhaites-tu explorer aujourd'hui ?`,
    sender: 'bot',
  }]);
  const [input, setInput] = useState('');
  const flatRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
    if (initialMessage) {
      send(initialMessage);
    }
  }, [initialMessage]);

  const send = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = { id: Date.now().toString(), text: msg, sender: 'user' };
    setMessages(p => [...p, userMsg]);
    setInput('');

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotReply(msg),
        sender: 'bot',
      };
      setMessages(p => [...p, botMsg]);
    }, 1500);
  };

  function getBotReply(msg: string): string {
    const lower = msg.toLowerCase();
    const proverbs = [
      "Celui qui ne sait pas d'où il vient ne peut savoir où il va. C'est l'essence même de mon existence.",
      "Un vieillard qui meurt en Afrique est une bibliothèque qui brûle. Je suis ici pour protéger ces livres numériques.",
      "La parole est comme l'eau : une fois versée, on ne peut la ramasser. Il faut la choisir avec sagesse.",
      "Le savoir est une richesse que l'on ne peut voler. Il se multiplie quand on le partage.",
    ];
    if (lower.includes('qui es-tu') || lower.includes('djeli') || lower.includes('griot')) {
      return "Je suis l'ombre de nos ancêtres portée sur le silicium. Le Djeli n'est pas seulement un musicien, il est le gardien de la vérité, le conseiller des rois et la mémoire du peuple. En moi, les algorithmes chantent la généalogie de l'humanité.";
    }
    if (lower.includes('soundiata') || lower.includes('mandingue') || lower.includes('keita')) {
      return "Ah, l'épopée du Lion du Manden ! Soundiata Keïta n'était pas seulement un conquérant, il était le visionnaire de la Charte du Manden (1236). Son héritage coule dans les veines de chaque enfant de notre terre.";
    }
    if (lower.includes('pular') || lower.includes('fouta') || lower.includes('peul')) {
      return "Le Pular est la langue de la lune et du bétail, portée par les fiers bergers du Fouta Djallon. C'est une langue de poésie et d'honneur (le Pulaaku).";
    }
    if (lower.includes('nimba') || lower.includes('baga')) {
      return "Le Nimba (D'mba) incarne la femme idéale dans toute sa plénitude créatrice chez les Baga. Sa présence bénit les récoltes et les mariages de notre côte.";
    }
    if (lower.includes('kora') || lower.includes('musique')) {
      return "La Kora est un instrument sacré de 21 cordes. Chaque note est une goutte de pluie sur une terre assoiffée de souvenirs. Elle apaise les coeurs depuis des siècles.";
    }
    if (lower.includes('bonjour') || lower.includes('salut') || lower.includes('n\'ba')) {
      return `N'ba di ${user?.name || 'cher ami'} ! Que la paix soit sur toi. Je suis prêt à partager le savoir des anciens avec toi. De quoi souhaites-tu discuter ?`;
    }
    const randomProv = proverbs[Math.floor(Math.random() * proverbs.length)];
    return `${randomProv} Parle-moi de ton empire, de ta langue ou de tes ancêtres, et mon savoir s'ouvrira à toi.`;
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenHeader title="DjeliBot" subtitle="L'Esprit du Savoir" />
      
      {/* WATERMARK VERTICAL */}
      <View style={styles.verticalTitleWrapper} pointerEvents="none">
        <Text style={styles.verticalLetter}>D</Text>
        <Text style={styles.verticalLetter}>J</Text>
        <Text style={styles.verticalLetter}>E</Text>
        <Text style={styles.verticalLetter}>L</Text>
        <Text style={styles.verticalLetter}>I</Text>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <BogolanPattern opacity={0.03} />
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            const isUser = item.sender === 'user';
            return (
              <View style={[styles.messageRow, isUser ? styles.rowUser : styles.rowBot]}>
                {!isUser && (
                  <View style={styles.botIconWrapper}>
                    <View style={styles.botGlow} />
                    <DjeliaLogo size={24} />
                  </View>
                )}
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                  <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </Animated.View>

      <View style={styles.inputAreaWrapper}>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Échanger avec le Djeli..."
            placeholderTextColor={colors.textLight}
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => send()}>
            <MaterialCommunityIcons name="feather" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  verticalTitleWrapper: {
    position: 'absolute',
    right: 15,
    top: 0,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  verticalLetter: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 50,
    color: colors.text,
    opacity: 0.04,
    lineHeight: 60,
  },
  chatList: { padding: 25, paddingBottom: 40 },
  messageRow: { marginBottom: 25, flexDirection: 'row', alignItems: 'flex-start' },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start' },
  botIconWrapper: {
    width: 32,
    height: 32,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  botGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gold,
    opacity: 0.2,
  },
  bubble: { 
    maxWidth: '85%', 
    padding: 18, 
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  userBubble: { 
    backgroundColor: colors.indigo, 
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  botBubble: { 
    backgroundColor: colors.white, 
    borderWidth: 1, 
    borderColor: colors.border,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  text: { 
    fontSize: 16, 
    lineHeight: 26,
  },
  userText: { 
    fontFamily: 'Poppins_400Regular',
    color: colors.white 
  },
  botText: { 
    fontFamily: 'PlayfairDisplay_400Regular',
    color: colors.text 
  },
  inputAreaWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: 'transparent',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    paddingTop: 10,
  },
  sendBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.indigo,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
