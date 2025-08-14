const { db } = require('../config/firebase'); // Firebase 설정 파일에서 db 가져오기
const { collection, addDoc, serverTimestamp } = require('firebase/firestore');

const COLLECTION_NAME = 'sneakers';

/**
 * SneakerItem 구조:
 * {
 *   id: string (자동 생성),
 *   image: { uri: string },
 *   likes: number,
 *   rating: number,
 *   backgroundColor: string,
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp
 * }
 */

/**
 * 새로운 스니커 아이템을 Firestore에 저장
 * @param {Object} sneakerData - 스니커 데이터
 * @param {Object} sneakerData.image - 이미지 객체 { uri: string }
 * @param {number} sneakerData.likes - 좋아요 수
 * @param {number} sneakerData.rating - 평점
 * @param {string} sneakerData.backgroundColor - 배경색
 * @returns {Promise<string>} 생성된 문서의 ID
 */
async function createSneaker(sneakerData) {
  try {
    const sneakerItem = {
      image: sneakerData.image,
      likes: sneakerData.likes || 0,
      rating: sneakerData.rating || 0,
      backgroundColor: sneakerData.backgroundColor,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), sneakerItem);
    console.log('스니커가 성공적으로 저장되었습니다. ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('스니커 저장 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 스니커 데이터 검증
 * @param {Object} sneakerData - 검증할 스니커 데이터
 * @returns {boolean} 유효성 검사 결과
 */
function validateSneakerData(sneakerData) {
  if (!sneakerData.image || !sneakerData.image.uri) {
    throw new Error('이미지 URI는 필수입니다.');
  }
  
  if (typeof sneakerData.likes !== 'undefined' && typeof sneakerData.likes !== 'number') {
    throw new Error('좋아요 수는 숫자여야 합니다.');
  }
  
  if (typeof sneakerData.rating !== 'undefined' && (typeof sneakerData.rating !== 'number' || sneakerData.rating < 0 || sneakerData.rating > 5)) {
    throw new Error('평점은 0-5 사이의 숫자여야 합니다.');
  }
  
  if (!sneakerData.backgroundColor) {
    throw new Error('배경색은 필수입니다.');
  }
  
  return true;
}

/**
 * 검증과 함께 스니커 생성
 * @param {Object} sneakerData - 스니커 데이터
 * @returns {Promise<string>} 생성된 문서의 ID
 */
async function createSneakerWithValidation(sneakerData) {
  validateSneakerData(sneakerData);
  return await createSneaker(sneakerData);
}

module.exports = {
  createSneaker,
  createSneakerWithValidation,
  validateSneakerData
};