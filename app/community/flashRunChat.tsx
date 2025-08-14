import Eclipse from '@/components/EclipseSVG';
import { SendButtonIcon } from '@/components/IconSVG';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../backend/db/firebase';

type ChatMessage = {
  id: string;
  user: string;
  text: string;
  createdAt: number;
  isMe: boolean;
};

export default function FlashRunChatPage() {
  /* ---------- params ---------- */
  const { chatRoomId, current = '0', max = '0' } = useLocalSearchParams<{
    chatRoomId: string;
    current: string;
    max: string;
  }>();

  // +1 because the user who just joined is now inside
  const initCount = Math.min(parseInt(current, 10) + 1, parseInt(max, 10));
  const [participants, setParticipants] = useState(initCount);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const [currentChatRoom, setCurrentChatRoom] = useState("general");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Firebase에서 메시지 실시간 구독 (루틴별 채팅방 지원)
  useEffect(() => {
    if (!chatRoomId) return;
    const q = query(
      collection(db, `flashRunChats/${chatRoomId}/messages`),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: ChatMessage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        user: doc.data().user,
        text: doc.data().text,
        createdAt: doc.data().createdAt,
        isMe: doc.data().user === 'Me', // 실제 로그인 유저와 비교 필요
      }));
      setMessages(messageList);
    });
    return () => unsubscribe();
  }, [chatRoomId]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || !chatRoomId) return;
    await addDoc(collection(db, `flashRunChats/${chatRoomId}/messages`), {
      user: 'Me', // 실제 로그인 유저로 변경 필요
      text: input.trim(),
      createdAt: Date.now(),
      isMe: true, // 현재 유저가 보낸 메시지
    });
    setInput('');
    setTimeout(() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true }), 50);
  };

  /* ---------- render ---------- */
  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.msgContainer, item.isMe && styles.myMsgContainer]}>
      {!item.isMe && (
        <View style={styles.avatar}>
        </View>
      )}
      
      <View style={styles.messageContent}>
        {!item.isMe && (
          <Text style={styles.msgUser}>{item.user}</Text>
        )}
        <View style={[styles.msgBubble, item.isMe && styles.myMsgBubble]}>
          <Text style={[styles.msgText, item.isMe && styles.myMsgText]}>
            {item.text}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <Eclipse />

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>유니스트 앞에서 9시</Text>
          <Text style={styles.participants}>({participants} / {max})</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* chat area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={renderItem}
          inverted
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* input */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor="#8E8E93"
            style={styles.input}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity 
            onPress={sendMessage} 
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            disabled={!input.trim()}
          >
              <SendButtonIcon width={30} color={input.trim() ? '#303034' : '#8E8E93'}
              />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#15151C' },

  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E',
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
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Pretendard-SemiBold',
    fontWeight: '600',
  },
  participants: {
    color: '#54F895',
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
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
    backgroundColor: '#3A3A3C',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* message content */
  messageContent: {
    flex: 1,
    maxWidth: '75%',
  },

  /* message bubble - FIXED */
  msgBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#54F895',
    borderRadius: 20,
    borderTopLeftRadius: 6, // Sharp corner on the left (near avatar)
  },
  myMsgBubble: {
    backgroundColor: '#D9D9D9',
    borderTopLeftRadius: 20, // Rounded corner on the left
    borderBottomRightRadius: 6,  // Sharp corner at bottom right (pointing down)
  },

  /* message text */
  msgUser: {
    color: '#8E8E93',
    marginBottom: 4,
    marginLeft: 4,
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    fontWeight: '500',
  },
  msgText: {
    color: '#15151C',
    fontSize: 16,
    lineHeight: 21,
    fontFamily: 'Pretendard-Regular',
  },
  myMsgText: {
    color: '#000',
  },

  /* input */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: '#303034',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    maxHeight: 50,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#54F895',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 66,
    minHeight: 50,
  },
  sendBtnDisabled: {
    backgroundColor: '#D9D9D9',
  },
});
