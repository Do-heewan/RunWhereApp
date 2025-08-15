import Eclipse from '@/components/EclipseSVG';
import { SendButtonIcon } from '@/components/IconSVG';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
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
import { db } from '../../backend/db/firebase'; // db 인스턴스 import 필요

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

  const flatListRef = useRef<FlatList>(null);

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
      user: 'me', // 실제 로그인 유저 정보로 대체 필요
      uid: 'user-uid', // 실제 로그인 유저 ID로 대체 필요
      text: input.trim(),
      createdAt: serverTimestamp(),
    });
    setInput('');
  };

  /* ---------- render ---------- */
  const renderItem = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.msgContainer, item.uid === 'user-uid' && styles.myMsgContainer]}>
      {!item.uid === 'user-uid' && (
        <View style={styles.avatar}>
        </View>
      )}
      
      <View style={styles.messageContent}>
        {!item.uid === 'user-uid' && (
          <Text style={styles.msgUser}>{item.user}</Text>
        )}
        <View style={[styles.msgBubble, item.uid === 'user-uid' && styles.myMsgBubble]}>
          <Text style={[styles.msgText, item.uid === 'user-uid' && styles.myMsgText]}>
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
          <Text style={styles.title}>채팅방</Text>
          <Text style={styles.participants}>({current} / {max})</Text>
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
