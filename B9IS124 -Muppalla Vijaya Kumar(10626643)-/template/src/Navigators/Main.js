

// Access Device’s Contact List in React Native App
// https://aboutreact.com/access-contact-list-react-native/

// Import React
import React, {useState, useEffect} from 'react';

// Import all required component
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

import Contacts from 'react-native-contacts';
import ListItem from './components/ListItem';
import { navigate } from './utils';

const MainNavigator = () => {
  let [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        }).then(() => {
          loadContacts();
        }
      );
    } else {
      loadContacts();
    }
  }, []);

  const loadContacts = () => {
    Contacts.getAll()
      .then(contacts => {
        contacts.sort(
          (a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        console.log('contacts -> ', contacts);
        setContacts(contacts);
        console.log('contacts', contacts);
      })
      .catch(e => {
        alert('Permission to access contacts was denied');
        console.warn('Permission to access contacts was denied');
      });
  };

  const search = (text) => {
    const phoneNumberRegex = 
      /\b[\+]?[(]?[0-9]{2,6}[)]?[-\s\.]?[-\s\/\.0-9]{3,15}\b/m;
    if (text === '' || text === null) {
      loadContacts();
    } else if (phoneNumberRegex.test(text)) {
      Contacts.getContactsByPhoneNumber(text).then(contacts => {
        contacts.sort(
          (a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
        console.log('contacts', contacts);
      });
    } else {
      Contacts.getContactsMatchingString(text).then(contacts => {
        contacts.sort(
          (a, b) => a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        setContacts(contacts);
        console.log('contacts', contacts);
      });
    }
  };

  const openContact = (contact) => {
    console.log(JSON.stringify(contact));
    Contacts.openExistingContact(contact);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={{...styles.header,flexDirection: 'row',justifyContent: 'space-between',padding: 10}}> 
        <Text style={[styles.header,{padding:0 }]}>
          Contact List
        </Text>
        <TouchableOpacity onPress={()=> {
          navigate('CameraScreen')
          // ''
        }}>
        <Image style={{height: 30, width: 30,}} source={{uri: 'https://iconarchive.com/download/i75813/martz90/circle/camera.ico'}}/>
        </TouchableOpacity>
        </View>
        <TextInput
          onChangeText={search}
          placeholder="Search"
          style={styles.searchBar}
        />
        <FlatList
          data={contacts}
          renderItem={(contact) => {
            {
              console.log('contact -> ' + JSON.stringify(contact));
            }
            return (
              <ListItem
                key={contact.item.recordID}
                item={contact.item}
                onPress={openContact}
              />
            );
          }}
          keyExtractor={(item) => item.recordID}
        />
      </View>
    </SafeAreaView>
  );
};
export default MainNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4591ed',
    color: 'white',
  
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: Platform.OS === 'android' ? undefined : 15,
  },
});