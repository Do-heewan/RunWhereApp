import Eclipse from '@/components/EclipseSVG';
import { SendButtonIcon } from '@/components/IconSVG';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../backend/db/firebase'; // db 인스턴스 import 필요

type ChatMessage = {
  id: string;
  uid: string;
  user: string;
  text: string;
  createdAt: string;
};



export default function FlashRunChatPage() {
  const params = useLocalSearchParams();
  const chatTitle = params.title || '번개런 채팅방'; // fallback if missing
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [myUid, setMyUid] = useState('');
  const [myName, setMyName] = useState('');
  const [participants, setParticipants] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const chatRoomId = useLocalSearchParams().chatRoomId;
  const flatListRef = useRef<FlatList>(null);
  const currentParticipants = params.current ? Number(params.current) : participants; // fallback to state (if string: Number())
  const maxParticipantCount = params.max ? Number(params.max) : maxParticipants; // fallback to state



  // 로그인 유저 정보 가져오기
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setMyUid(user.uid);
      // Firestore에서 닉네임 가져오기
      getDoc(doc(db, 'users', user.uid)).then((snap) => {
        if (snap.exists()) setMyName(snap.data().name || '');
      });
    }
  }, []);

  // 참가자 수 가져오기
  useEffect(() => {
    if (!chatRoomId) return;
    const fetchParticipants = async () => {
      const chatRoomRef = doc(db, 'flashRun', String(chatRoomId));
      const chatRoomSnap = await getDoc(chatRoomRef);
      if (chatRoomSnap.exists()) {
        const data = chatRoomSnap.data();
        setParticipants(currentParticipants || 0);
        setMaxParticipants(maxParticipantCount || 0); // maxParticipants 필드가 있다면
      }
    };
    fetchParticipants();
  }, [chatRoomId]);

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

  // Firebase에서 메시지 실시간 구독
  useEffect(() => {
    let messagesCollection = "messages";

    if (chatRoomId !== "general") {
      messagesCollection = `flashRunChatsRooms/${chatRoomId}/messages`;
    }

    const q = query(collection(db, messagesCollection), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: ChatMessage[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: data.uid ?? '', // fallback if uid is missing
          user: data.user ?? '익명',
          text: data.text ?? '',
          createdAt: data.createdAt?.toDate?.().toISOString() ?? '', // convert to ISO string
        };
      });

      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  // 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || !chatRoomId) return;
    const messagesRef = collection(db, 'flashRunChatsRooms', String(chatRoomId), 'messages');
    await addDoc(messagesRef, {
      uid: myUid,
      user: myName,
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
          onPress: async () => {
            if (!chatRoomId || !myUid) {
              router.back();
              return;
            }
            // 1. organizer 배열에서 내 정보 제거
            const chatRoomRef = doc(db, 'flashRunChatsRooms', String(chatRoomId));
            const chatRoomSnap = await getDoc(chatRoomRef);
            if (chatRoomSnap.exists()) {
              const data = chatRoomSnap.data();
              const organizers = Array.isArray(data.organizer) ? data.organizer : [];
              const newOrganizers = organizers.filter((org: any) => org.id !== myUid);
              await updateDoc(chatRoomRef, { organizer: newOrganizers });

              // 2. flashRun participants 필드 업데이트
              const flashRunRef = doc(db, 'flashRun', String(chatRoomId));
              await updateDoc(flashRunRef, { participants: newOrganizers.length });
            }
            // 3. 화면 이동
            router.back();
          }
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

  // ...renderItem 수정
  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMyMessage = item.uid === 'user-uid';
    const avatarColor = getAvatarColor(item.user);

    return (    
    <View style={[styles.msgContainer, item.uid === myUid && styles.myMsgContainer]}>
      {item.uid !== myUid && (
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <ThemedText type="body3" style={styles.avatarText}>
          {item.user.charAt(0)}
        </ThemedText>
      </View>
      )}
      <View style={styles.messageContent}>
        {item.uid !== myUid && (
          <Text style={styles.username}>{item.user}</Text>
        )}
        <View style={[styles.othersMsgBubble, item.uid === myUid && styles.myMsgBubble]}>
          <Text style={[styles.othersMsgText, item.uid === myUid && styles.myMsgText]}>
            {item.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

  return (
    <SafeAreaView style={styles.container}>
      <Eclipse />
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <ThemedText type="sub1" style={styles.title}>
            {chatTitle}
          </ThemedText>
          <ThemedText type="body3" style={styles.participants}>
            ({currentParticipants + 1} / {maxParticipantCount})
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={m => m.id}
            renderItem={renderItem}
            inverted
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 16, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor={Colors.gray2}
              style={[styles.input, { textAlignVertical: 'top' }]}
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

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { 
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
    backgroundColor: Colors.gray1
  },
  leaveBtnText: {
    color: Colors.red,
    padding: 3,
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

  /* input container - SafeAreaView handles safe areas */
  inputContainer: {
    backgroundColor: Colors.blackGray,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.gray1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
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
    width: 42,
    height: 42,
    borderRadius: 20,
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

  /* user message */
  myMsgBubble: {
    backgroundColor: Colors.gray4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,   
    },
  myMsgText: {
    color: Colors.blackGray,
  },

  /* different user message text */
  othersMsgBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderTopLeftRadius: 0,
  },
  username: {
    color: Colors.primary,
    marginBottom: 4,
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  othersMsgText: {
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
    maxHeight: 100,
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
