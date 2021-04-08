const firebaseConfig = {
  apiKey: "AIzaSyAjZGN7j00ud_vfpIlt-enOlSAqpjNhWBI",
  authDomain: "peak-physique-a0c48.firebaseapp.com",
  projectId: "peak-physique-a0c48",
  storageBucket: "peak-physique-a0c48.appspot.com",
  messagingSenderId: "278845824422",
  appId: "1:278845824422:web:31464ec47ef880324e4367"
};

firebase.initializeApp(firebaseConfig);

function firebaseUI() {
  var ui = new firebaseui.auth.AuthUI(firebase.auth());

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: async (authResult, redirectUrl) => {
        return true;
      },
      uiShown: function () {
        document.getElementById('loader').style.display = 'none';
      }
    },
    signInSuccessUrl: '../../sign-up-success.html',
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);
}

export { firebaseConfig, firebaseUI };