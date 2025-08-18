import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

const TAB_BAR_HEIGHT = 75
const TAB_BAR_BOTTOM = 10
const ADD_BUTTON_SPACING = 30

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.blackGray },
  header: { paddingHorizontal: 20, paddingBottom: 5, paddingTop:5 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.white, textAlign: 'center', marginBottom: 20 },

  addbutton: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM + TAB_BAR_HEIGHT + ADD_BUTTON_SPACING,
    right: 30,
    zIndex: 20,
    width: 60,
    height: 60,
    aspectRatio: 1,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 6,
  },
  tabBar: { flexDirection: 'row', borderRadius: 25 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 25 },
  tabActive: { 
    backgroundColor: Colors.gray1 },
  tabTxt: { color: Colors.gray2, fontSize: 22, fontWeight: '600', textAlign: 'center' },
  tabTxtActive: { color: Colors.primary, fontSize: 22, fontWeight: '600', textAlign: 'center' },
  scrollArea: { flex: 1, paddingHorizontal: 10, paddingBottom: 20 },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: { width: '48%', marginBottom: 20 },
  cardInner: {
    borderRadius: 25,
    height: 130,
    position: 'relative',
    overflow: 'hidden', // Important: this ensures the image doesn't overflow the rounded corners
  },
  shoeImg: {
    position: 'absolute', // Ensures it fills the parent
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Keeps aspect ratio and fills space
  },
  likeContent: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  likeBox: {
    position: 'absolute', 
    bottom: 8, 
    right: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 20, 
    backgroundColor: 'rgba(21, 21, 28, 0.50)', 
    minWidth: 50
  },
  
  likeTxt: { color: Colors.primary, fontSize: 16, fontWeight: '600', marginRight: 2 },
  starRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },

  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginTop: 15 },
  galleryTile: { width: '32%', aspectRatio: 1, overflow: 'hidden', margin: 2 },
  galleryImg: { width: '100%', height: '100%', borderWidth: 1, borderColor: Colors.gray4, backgroundColor: Colors.gray2 },

  // FlashRun tab/grid
  flashRunGrid: { padding: 20, zIndex: 1 },

  flashRunCard: {
    backgroundColor: Colors.gray1,
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    zIndex: 1,
    elevation: 2,
  },
  flashRunHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  flashRunTitleSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  flashRunTitle: { color: Colors.white, fontSize: 18, fontWeight: '600', marginLeft: 10 },
  flashRunTime: { color: Colors.gray2, fontSize: 12 },
  flashRunPaceContainer: { borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10, justifyContent: 'center', alignSelf: 'flex-start', marginVertical: 4, flexShrink: 1 },
  flashRunPaceText: { color: Colors.blackGray, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  flashRunDescription: { color: Colors.white, fontSize: 15, marginBottom: 16, lineHeight: 20 },
  hashRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  hashTag: { color: Colors.primary, fontSize: 14, marginRight: 6 },

  joinButton: {
    borderRadius: 30,
    paddingVertical: 19,
    paddingHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonActive: {
    color: Colors.primary,
  },
  joinButtonFull: {
   color: Colors.disableButton,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  joinButtonTextActive: { 
    color: Colors.blackGray 
  },
  joinButtonTextFull: { 
    color: Colors.gray3 
  },
  
  // Location/Filter section styles
  locationSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  locationInfo: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flex: 1, marginRight: 12 },
  locationInfoText: { color: Colors.primary, fontSize: 24, fontWeight: '600' },
  filterDropdownButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderRadius: 10, minWidth: 26 },
  filterDropdownText: { alignItems: 'center', color: Colors.gray4, fontSize: 14, fontWeight: '500', marginRight: 6 },

  // Modal / dropdown menu styles
  modalBackDrop: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 180, paddingRight: 25 },
  dropdownMenu: { alignItems: 'center', backgroundColor: Colors.gray3, borderRadius: 10, borderTopRightRadius: 0, borderColor: Colors.gray1, minWidth: 80, zIndex: 10000, elevation: 20 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.gray1 },
  dropdownItemText: { color: Colors.black, fontSize: 14 },

  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTxt: { color: Colors.gray2, fontSize: 16 },

  bottomPadding: { height: 80 },
});