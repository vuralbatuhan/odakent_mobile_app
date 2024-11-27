import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginVertical: 10,
    textAlign: 'center',
  },
  chatBackground: {
    height: 550,
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  chatContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  messageRow: {
    marginVertical: 5,
  },
  ownMessageRow: {
    alignSelf: 'flex-end',
  },
  messageBox: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#d1f7d6',
  },
  ownMessage: {
    maxWidth: 250,
    backgroundColor: '#bae1ff',
  },
  otherMessage: {
    maxWidth: 250,
    backgroundColor: '#f7d6d6',
  },
  chatImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'right',
  },
  messageTime: {
    marginTop: 5,
    fontSize: 10,
    color: 'black',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  iconButton: {
    marginLeft: 5,
    padding: 10,
  },
  iconText: {
    fontSize: 20,
    color: '#007aff',
  },
  sendButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    padding: 10,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ownUsername: {
    color: 'blue',
    alignSelf: 'flex-end',
  },
  otherUsername: {
    color: 'green',
    alignSelf: 'flex-start',
  },
  fileText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
  buttonStatuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonStatu: {
    borderRadius: 10,
    marginRight: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonStatuText: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainerDelete: {
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
    color: '#ff4c4c',
  },
  modalDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 10,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#dcdcdc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  button: {
    width: 120,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    zIndex: 1,
  },
});
