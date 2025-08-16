import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

export default function SignUpAppbar() {
    const handleBackPress = () => {
        router.back();
    };
    return (
        <View style={{
            justifyContent: 'center',
            flexDirection: 'row',
            paddingTop:10,
            paddingBottom:15,
            position: 'relative',
        }}>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    left: 15,
                    top: 10,
                    bottom: 15,
                }} onPress={handleBackPress}>
                <Ionicons name="chevron-back" size={35} color={Colors.white} />
            </TouchableOpacity>
            <ThemedText type="sub1" style={{
                alignSelf: 'center',
                color: Colors.white,
            }}>회원가입
            </ThemedText>
        </View>
    );
}