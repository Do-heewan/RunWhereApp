import Eclipse from '@/components/EclipseSVG';
import { SendButtonIcon } from '@/components/IconSVG';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { db } from '../../backend/db/firebase';

type ChatMessage = {
  uid: string;
  user: string;
  text: string;
  createdAt: number;
};

export default function FlashRunChatPage() {
  const { chatRoomId, current, max } = useLocalSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  // 메시지 실시간 구독
  useEffect(() => {
    if (!chatRoomId) return;
    const messagesRef = collection(db, 'flashRunChatsRooms', String(chatRoomId), 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          user: data.user ?? '익명',
          text: data.text,
          createdAt: data.createdAt?.toMillis?.() ?? 0,
        };
      });
      setMessages(msgs);
    });
    return unsubscribe;
  }, [chatRoomId]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || !chatRoomId) return;
    const messagesRef = collection(db, 'flashRunChatsRooms', String(chatRoomId), 'messages');
    await addDoc(messagesRef, {
      user: 'me',
      uid: 'user-uid',
      text: input.trim(),
      createdAt: serverTimestamp(),
    });
    setInput('');
  };

  // 나가기 버튼 핸들러
  const handleLeaveChat = () => {
    Alert.alert(
      '채팅방 나가기',
      '정말로 채팅방을 나가시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '나가기', 
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    );
  };

  // Get avatar color based on user name/uid
  const getAvatarColor = (user: string) => {
    const colors = [Colors.primary, Colors.gray2, Colors.gray3, Colors.red];
    const index = user.length % colors.length;
    return colors[index];
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.uid === 'user-uid';
    const avatarColor = getAvatarColor(item.user);

    return (
      <View style={[styles.msgContainer, isMyMessage && styles.myMsgContainer]}>
        {!isMyMessage && (
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <ThemedText type="body3" style={styles.avatarText}>
              {item.user.charAt(0)}
            </ThemedText>
          </View>
        )}

        <View style={styles.messageContent}>
          {!isMyMessage && (
            <ThemedText type="body3" style={styles.msgUser}>
              {item.user}
            </ThemedText>
          )}
          <View style={[styles.msgBubble, isMyMessage && styles.myMsgBubble]}>
            <ThemedText type="body2" style={[styles.msgText, isMyMessage && styles.myMsgText]}>
              {item.text}
            </ThemedText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <Eclipse />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <ThemedText type="sub1" style={styles.title}>
            유니스트 앞에서 9시
          </ThemedText>
          <ThemedText type="body3" style={styles.participants}>
            ({current} / {max})
          </ThemedText>
        </View>

        <TouchableOpacity onPress={handleLeaveChat} style={styles.leaveBtn}>
          <ThemedText type="body3" style={styles.leaveBtnText}>
            나가기
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* chat area */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}      >
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={m => m.uid}
            renderItem={renderItem}
            inverted
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <View style={[
          styles.inputContainer
        ]}>
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor={Colors.gray2}
              style={[styles.input, { textAlignVertical: 'top' }]} // Added
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              onPress={sendMessage} 
              style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
              disabled={!input.trim()}
            >
              <SendButtonIcon 
                width={30} 
                color={input.trim() ? Colors.blackGray : Colors.gray2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: Colors.blackGray 
  },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray1,
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  participants: {
    color: Colors.primary,
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  leaveBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    backgroundColor : Colors.gray1  },
  
    leaveBtnText: {
    color: Colors.red,
    padding:3,
    fontSize: 14,
    fontWeight: '500',
  },

  /* chat container */
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },

  /* input container - Fixed positioning */
  inputContainer: {
    marginBottom:30,
    backgroundColor: Colors.blackGray,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.gray1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },

  /* message container */
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 6,
  },
  myMsgContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  /* avatar */
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  /* message content */
  messageContent: {
    flex: 1,
    maxWidth: '75%',
  },

    msgBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderTopLeftRadius: 6,
  },

  /*user message */
  myMsgBubble: {
    backgroundColor: Colors.gray4,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 6,
  },
    myMsgText: {
    color: Colors.blackGray,
  },

  /* different user message text */
  msgUser: {
    color: Colors.primary,
    marginBottom: 4,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  msgText: {
    color: Colors.blackGray,
    fontSize: 16,
    lineHeight: 21,
  },


  /* input styling */
  input: {
    flex: 1,
    backgroundColor: Colors.gray4,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: Colors.blackGray,
    fontSize: 16,
    maxHeight: 100, // Allow for more lines
    marginRight: 8,
    textAlignVertical: 'center',
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.gray4,
  },
});
