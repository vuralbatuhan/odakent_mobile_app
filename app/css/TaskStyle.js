import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ebf3f3',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 35,
    paddingTop: 20,
    width: '90%',
    height: 'auto',
    flex: 1,
  },
  container: {
    borderRadius: 10,
    width: '95%',
    padding: 10,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    paddingLeft: 10,
    fontSize: 16,
  },
  selectedTextStyle: {
    paddingLeft: 10,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  searchContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 16,
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  itemContainer: {
    width: '100%',
    minHeight: 80,
    maxHeight: 150,
    height: 'auto',
    minHeight: 100,
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  titleText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 10,
  },
  textAndImageContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    flex: 1,
    width: '80%',
    height: 35,
    fontSize: 14,
  },
  statuButton: {
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '90%',
    width: '90%',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  textInput: {
    width: '95%',
    padding: 15,
    marginTop: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  textInputDescription: {
    width: '95%',
    height: '55%',
    marginTop: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    textAlignVertical: 'top',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  imageCamera: {
    width: 40,
    height: 50,
    marginTop: 15,
  },
  addItemButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: '#ffcccc',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  deleteConfirmContainer: {
    width: '60%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  popUpButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 10,
  },
  popupButtons: {
    width: 80,
    height: 40,
    borderRadius: 3,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6495ed',
  },
  plusText: {
    fontSize: 28,
  },
  statusButton: {
    height: 25,
    width: 25,
    borderRadius: 120,
    padding: 0,
  },
  imagePreview: {
    width: 80,
    height: 80,
    alignSelf: 'flex-start',
  },
  checkboxAllContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  checkboxColumn: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'black',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  redCheckbox: {
    borderColor: 'red',
  },
  yellowCheckbox: {
    borderColor: '#ffff00',
  },
  greenCheckbox: {
    borderColor: 'green',
  },
  blueCheckbox: {
    borderColor: 'blue',
  },
  selectedRed: {
    backgroundColor: 'red',
  },
  selectedYellow: {
    backgroundColor: '#ffff00',
  },
  selectedGreen: {
    backgroundColor: 'green',
  },
  selectedBlue: {
    backgroundColor: 'blue',
  },
  label: {
    fontSize: 14,
    color: 'black',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#ebf3f3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
    paddingVertical: 14,
    alignSelf: 'flex-start',
  },
  logoutText: {
    backgroundColor: '#ebf3f3',
    marginLeft: 8,
    fontSize: 16,
    color: 'black',
  },
  modalOverlayLogout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalLogoutContent: {
    width: '75%',
    height: '25%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  popupLogoutButtons: {
    width: '45%',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  noLogoutButton: {
    width: '45%',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 10,
    marginLeft: 10,
  },
});

export default styles;
