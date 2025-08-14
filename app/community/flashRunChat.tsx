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
        <View style={styles.avatar} />
      )}
      
      <View style={[styles.msgBubble, item.isMe && styles.myMsgBubble]}>
        {!item.isMe && (
          <Text style={styles.msgUser}>{item.user}</Text>
        )}
        <Text style={[styles.msgText, item.isMe && styles.myMsgText]}>
          {item.text}
        </Text>
      </View>

      {item.isMe && (
        <View style={styles.avatar} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* header */}
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>유니스트 앞에서 9시</Text>
          <Text style={styles.participants}>{participants}명 참여중</Text>
        </View>

        <View style={{ width: 26 }} />
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
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        />

        {/* input */}
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
            <Ionicons name="send" size={20} color="#000" />
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
    justifyContent: 'space-between', // This ensures proper spacing
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2C2C2E',
  },
  backBtn: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  participants: {
    color: '#54F895',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
    fontFamily: 'Pretendard-SemiBold',
  },

  /* message container */
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  myMsgContainer: {
    justifyContent: 'flex-end',
  },

  /* avatar */
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8E8E93',
    marginHorizontal: 8,
  },

  /* message bubble */
  msgBubble: {
    maxWidth: '70%',
    padding: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    borderBottomLeftRadius: 4, // Sharp corner for other users (left side)
  },
  myMsgBubble: {
    backgroundColor: '#54F895',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4, // Sharp corner for my messages (right side)
  },

  /* message text */
  msgUser: {
    color: '#54F895',
    marginBottom: 4,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
  },
  msgText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
  },
  myMsgText: {
    color: '#000', // Black text on green bubble
  },

  /* input */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1C1C23',
  },
  input: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#54F895',
    borderRadius: 20,
    padding: 10,
  },
});
