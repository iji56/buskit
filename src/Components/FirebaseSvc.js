import firebase from 'firebase';
import uuid from 'uuid';

const config = {
  apiKey: 'AIzaSyDBBoDBj4scMmA6Zk8JHQ8OVBHB0XSxPpU',
  authDomain: 'buskit-2abe3.firebaseapp.com',
  databaseURL: 'https://buskit-2abe3-default-rtdb.firebaseio.com',
  projectId: 'buskit-2abe3',
  storageBucket: 'buskit-2abe3.appspot.com',
  messagingSenderId: '48053070020',
  appId: '1:48053070020:web:aa1a9e4e847c9a18320191',
  measurementId: 'G-890YTL19VE',
};

class FirebaseSvc {
  constructor() {
    this.userId = 0;
    this.otherId = 0;
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log('firebase apps already running...');
    }
  }

  setChatRoom = (userId, otherId) => {
    this.userId = userId;
    this.otherId = otherId;
    return this.roomRef;
  };

  login = async user => {
    console.log('logging in');
    let result = null;
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        result = data;
        console.log('Login user successfully.');
      })
      .catch(error => {
        console.log('got error:' + typeof error + ' string:' + error.message);
      });
    return result;
  };

  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        this.login(user);
      } catch ({message}) {
        console.log('Failed:' + message);
      }
    } else {
      console.log('Reusing auth...');
    }
  };

  createAccount = async user => {
    console.log('Creating in');
    let result = null;
    await firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(data => {
        result = data;
        console.log(
          'created user successfully. User email:' +
            user.email +
            ' name:' +
            user.name,
        );
        this.updateProfile(user.name);
      })
      .catch(error => {
        console.log('got error:' + typeof error + ' string:' + error.message);
      });
    return result;
  };

  updateProfile = name => {
    var userf = firebase.auth().currentUser;
    userf
      .updateProfile({displayName: name})
      .then(() => {
        console.log('Updated displayName successfully.');
      })
      .catch(() => {
        console.warn('Error update displayName.');
      });
  };

  uploadImage = async uri => {
    console.log('got image to upload. uri:' + uri);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = firebase
        .storage()
        .ref('avatar')
        .child(uuid.v4());
      const task = ref.put(blob);

      return new Promise((resolve, reject) => {
        task.on(
          'state_changed',
          () => {
            /* noop but you can track the progress here */
          },
          reject /* this is where you would put an error callback! */,
          () => resolve(task.snapshot.downloadURL),
        );
      });
    } catch (err) {
      console.log('uploadImage try/catch error: ' + err.message); //Cannot load an empty url
    }
  };

  updateAvatar = url => {
    //await this.setState({ avatar: url });
    var userf = firebase.auth().currentUser;
    if (userf != null) {
      userf.updateProfile({avatar: url}).then(
        function() {
          console.log('Updated avatar successfully. url:' + url);
          alert('Avatar image is saved successfully.');
        },
        function(error) {
          console.warn('Error update avatar.');
          alert('Error update avatar. Error:' + error.message);
        },
      );
    } else {
      console.log("can't update avatar, user is not login.");
      alert('Unable to update avatar. You must login first.');
    }
  };

  onLogout = user => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('Sign-out successful.');
      })
      .catch(function(error) {
        console.log('An error happened when signing out');
      });
  };

  // getter for the firebase user(uid) as well as database(messages)
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get globalRef() {
    return firebase.database().ref('Messages');
  }

  get roomRef() {
    return firebase.database().ref(`${this.userId}-${this.otherId}`);
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // parse = snapshot => {
  //   const {timestamp: numberStamp, text, user} = snapshot.val();
  //   const {key: id} = snapshot;
  //   const {key: _id} = snapshot; //needed for giftedchat
  //   const timestamp = new Date(numberStamp);

  //   const message = {
  //     id,
  //     _id,
  //     timestamp,
  //     text,
  //     user,
  //   };
  //   return message;
  // };
  parse = snapshot => {
    const {createdAt, text, user} = snapshot.val();
    const {key: id} = snapshot;
    const {key: _id} = snapshot; //needed for giftedchat

    const message = {
      id,
      _id,
      createdAt,
      text,
      user,
    };
    return message;
  };

  // global ref on messages from server
  refOn = callback => {
    this.globalRef
      .limitToLast(100)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  // chatroom ref on messages from server
  refRoomOn = callback => {
    this.roomRef
      .limitToLast(100)
      .on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  // send global message to the Backend
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.globalRef.push(message);
    }
  };

  // send room message to the Backend
  sendMessage = messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
      this.roomRef.push(message);
    }
  };

  // send single message to the Backend
  sendSingleMessage = (text, user) => {
    const message = {
      text,
      user,
      createdAt: this.timestamp,
    };
    this.roomRef.push(message);
  };

  // global ref off from server
  refOff() {
    this.globalRef.off();
  }

  // chatroom ref off from server
  refRoomOff() {
    this.roomRef.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
