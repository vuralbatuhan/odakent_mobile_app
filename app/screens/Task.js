import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../css/TaskStyle';
import {Dropdown} from 'react-native-element-dropdown';
import {Button} from 'react-native-elements';
import {Buffer} from 'buffer';

import {
  fetchProblems,
  fetchItems,
  fetchAllItems,
  fetchRoomGroupName,
  addItem,
} from '../api/TaskApiFunctions.js';
import {pickFile} from '../utils/Utils.js';
import {logout} from '../utils/Logout';
import RNFS from 'react-native-fs';

const Task = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [problems, setProblems] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('ODAKENT+WEB');
  const [roomGroupName, setRoomGroupName] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(true);
  const [modalLogout, setModalLogout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocus, setIsFocus] = useState(true);
  const [statu, setStatu] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [statusCounts, setStatusCounts] = useState({
    status1: 0,
    status2: 0,
    status3: 0,
  });
  const [imageUri3, setImageUri3] = useState('');
  const {username, isChecked} = route.params;
  useEffect(() => {
    if (isChecked) {
      setVisibleLogout(true);
    } else {
      setVisibleLogout(false);
    }
  }, [isChecked]);
  const handleCheckboxPress = index => {
    setSelectedIndex(index);
    let filteredList = [];

    switch (index) {
      case 0:
        filteredList = items.filter(item => item.statu_id === 1);
        break;
      case 1:
        filteredList = items.filter(item => item.statu_id === 2);
        break;
      case 2:
        filteredList = items.filter(item => item.statu_id === 3);
        break;
      default:
        filteredList = items;
        break;
    }

    setFilteredItems(filteredList);
  };

  useEffect(() => {
    let backHandler;
    if (isChecked) {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();
        return true;
      });
    }

    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [isChecked]);

  useEffect(() => {
    const getRoomGroupName = async () => {
      try {
        const data = await fetchRoomGroupName(username);
        setRoomGroupName(data.room);
        navigation.setOptions({
          title: `${data.room} görevler`,
        });
        fetchProblemList();
      } catch (error) {
        console.error('Hata oluştu:', error);
      }
    };

    getRoomGroupName();
  }, [username, navigation]);

  useEffect(() => {
    handleCheckboxPress(3);
  }, [selectedProblem]);

  const fetchProblemList = async () => {
    const problemsData = await fetchProblems();
    setProblems(problemsData);
  };

  const fetchData = async problem => {
    try {
      let data;
      if (selectedProblem === 'all') {
        data = await fetchAllItems(roomGroupName);
        setVisible(false);
      } else {
        data = await fetchItems(selectedProblem, roomGroupName);
        setVisible(true);
        //console.log('evet', data.image.data);
      }
      setItems(data);
      setFilteredItems(data);
      const statuList = data.map(item => ({statu: item.statu}));
      setStatu(statuList);
      const statusCountsData = {
        status1: data.filter(item => item.statu_id === 1).length,
        status2: data.filter(item => item.statu_id === 2).length,
        status3: data.filter(item => item.statu_id === 3).length,
      };

      setStatusCounts(statusCountsData);
    } catch (error) {}
  };

  useEffect(() => {
    if (roomGroupName) {
      fetchData(selectedProblem);
    }
  }, [roomGroupName, selectedProblem]);

  const convertImageToBase64 = async filePath => {
    try {
      const base64Data = await RNFS.readFile(filePath, 'base64'); // Dosyayı base64'e çevir
      return `data:image/jpeg;base64,${base64Data}`; // Base64 formatında URL oluştur
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const imageUri2 =
    'file:///data/user/0/com.socketapp2/cache/rn_image_picker_lib_temp_a426f8a1-93a8-44a5-bb37-1ab7af0b03b1.jpg';

  convertImageToBase64(imageUri2).then(base64Uri => {
    console.log('Base64 URI:', base64Uri);
    // Bu base64Uri'yi bir <Image> bileşeninde gösterebilirsiniz
  });

  const handleAddItem = async () => {
    const result = await addItem(
      title,
      text,
      selectedProblem,
      imageUri,
      roomGroupName,
    );
    if (result) {
      console.log(imageUri);
      fetchData(selectedProblem);
      setTitle('');
      setText('');
      setImageUri('');
      setModalVisible(false);
    } else {
      alert('Error adding item.');
    }
  };

  const closeAndReset = () => {
    setTitle('');
    setText('');
    setImageUri('');
    setModalVisible(false);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filteredItems = items.filter(item => {
      const title = item.title ? item.title.toLowerCase() : '';
      const description = item.description
        ? item.description.toLowerCase()
        : '';

      return (
        title.includes(lowercasedQuery) || description.includes(lowercasedQuery)
      );
    });

    setFilteredItems(filteredItems);
  };

  const handleRowPress = item => {
    navigation.navigate('Detail', {
      title: item.title,
      description: item.description,
      image: item.image,
      id: item.id,
      room: item.room,
      username: username,
      room_id: item.room_id,
      problem_id: item.problem_id,
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        {visibleLogout && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setModalLogout(true)}>
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        )}
        <Dropdown
          style={[styles.dropdown]}
          selectedValue={selectedProblem}
          onValueChange={itemValue => {
            setSelectedProblem(itemValue);
            fetchItems(itemValue);
          }}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={problems}
          search
          maxHeight={300}
          width={'100%'}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={selectedProblem}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedProblem(item.value);
            setIsFocus(false);
            fetchData();
          }}
        />
        <View style={styles.checkboxAllContainer}>
          <View style={styles.checkboxColumn}>
            {['Yapılacaklar', 'Devam edenler'].map((label, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxContainer}
                onPress={() => handleCheckboxPress(index)}>
                <View
                  style={[
                    styles.checkbox,
                    index === 0 && styles.redCheckbox,
                    index === 1 && styles.yellowCheckbox,
                    selectedIndex === index &&
                      (index === 0
                        ? styles.selectedRed
                        : styles.selectedYellow),
                  ]}
                />
                <Text style={styles.label}>
                  {label} (
                  {index === 0 ? statusCounts.status1 : statusCounts.status2})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.checkboxColumn, {marginLeft: 20}]}>
            {['Bitenler', 'Hepsi'].map((label, index) => (
              <TouchableOpacity
                key={index + 2}
                style={styles.checkboxContainer}
                onPress={() => handleCheckboxPress(index + 2)}>
                <View
                  style={[
                    styles.checkbox,
                    index === 0 ? styles.greenCheckbox : styles.blueCheckbox,
                    selectedIndex === index + 2 &&
                      (index === 0
                        ? styles.selectedGreen
                        : styles.selectedBlue),
                  ]}
                />
                <Text style={styles.label}>
                  {label} (
                  {index === 0
                    ? statusCounts.status3
                    : statusCounts.status1 +
                      statusCounts.status2 +
                      statusCounts.status3}
                  )
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Ara..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={filteredItems}
          keyExtractor={item =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          renderItem={({item}) => {
            let base64String = '';
            if (item.image?.data) {
              const buffer = Buffer.from(item.image.data);
              base64String = buffer.toString('base64');
            }

            let imageUri = '';
            if (base64String) {
              console.log('hepsi', base64String);
              imageUri = `data:image/jpeg;base64,${base64String}`;
            }

            return (
              <TouchableOpacity onPress={() => handleRowPress(item)}>
                <View style={styles.itemContainer}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  <View style={styles.textAndImageContainer}>
                    {imageUri ? (
                      <Image
                        source={{
                          uri: `file://${base64String}`,
                        }}
                        style={styles.imagePreview}
                      />
                    ) : (
                      <Text>No image available</Text>
                    )}
                    <Text style={styles.itemText}>{item.description}</Text>
                    <Text
                      style={{
                        marginEnd: -22,
                        marginTop: -85,
                        color: 'blue',
                      }}>
                      {item.room}
                    </Text>
                    <View style={styles.statuButton}>
                      {item.statu_id === 1 ? (
                        <Button
                          title="Y"
                          buttonStyle={styles.statusButton}
                          titleStyle={{
                            color: 'black',
                          }}
                          disabled={true}
                          disabledStyle={{
                            backgroundColor: '#ed5250',
                          }}
                          disabledTitleStyle={{
                            fontSize: 14,
                            color: 'black',
                          }}
                        />
                      ) : item.statu_id === 2 ? (
                        <Button
                          title="D"
                          buttonStyle={styles.statusButton}
                          titleStyle={{
                            color: 'black',
                            fontSize: 14,
                          }}
                          disabled={true}
                          disabledStyle={{
                            backgroundColor: '#ffd700',
                          }}
                          disabledTitleStyle={{
                            color: 'black',
                          }}
                        />
                      ) : item.statu_id === 3 ? (
                        <Button
                          title="B"
                          buttonStyle={styles.statusButton}
                          titleStyle={{
                            color: 'black',
                            fontSize: 14,
                          }}
                          disabled={true}
                          disabledStyle={{
                            backgroundColor: '#25e00f',
                          }}
                          disabledTitleStyle={{
                            color: 'black',
                          }}
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {visible && (
        <TouchableOpacity
          style={styles.addItemButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      )}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                closeAndReset();
              }}></TouchableOpacity>
            <TextInput
              placeholder="Görev başlığı"
              value={title}
              onChangeText={setTitle}
              multiline
              style={styles.textInput}
            />
            <TextInput
              placeholder="Açıklama"
              value={text}
              onChangeText={setText}
              multiline
              style={styles.textInputDescription}
            />
            {imageUri ? (
              <Image source={{uri: imageUri}} style={styles.imagePreview} />
            ) : null}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.imageCamera}
                onPress={() => pickFile(setImageUri, 0)}>
                <Text>buraya bas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popupButtons}
                onPress={handleAddItem}>
                <Text>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modalLogout}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalLogout(false)}>
        <View style={styles.modalOverlayLogout}>
          <View style={styles.modalLogoutContent}>
            <Text style={styles.modalTitle}>ÇIKIŞ YAP</Text>
            <Text style={styles.modalDescription}>
              Çıkış yapmak istiyor musunuz ?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  logout(navigation);
                  setModalLogout(false);
                }}
                style={[styles.button, styles.popupLogoutButtons]}>
                <Text style={styles.buttonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalLogout(false)}
                style={[styles.button, styles.noLogoutButton]}>
                <Text style={styles.buttonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
  // return (
  //   <View>
  //     <Text>Task</Text>
  //   </View>
  // );
};

export default Task;
