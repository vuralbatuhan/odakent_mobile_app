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
    padding: 10,
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
    backgroundColor: '#bae1ff',
  },
  otherMessage: {
    backgroundColor: '#f7d6d6',
  },
  chatImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 14,
    color: 'black',
  },
  messageTime: {
    fontSize: 10,
    color: '#777',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
});
