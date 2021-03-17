//Sprint 1: ...
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAjZGN7j00ud_vfpIlt-enOlSAqpjNhWBI",
    authDomain: "peak-physique-a0c48.firebaseapp.com",
    projectId: "peak-physique-a0c48",
    storageBucket: "peak-physique-a0c48.appspot.com",
    messagingSenderId: "278845824422",
    appId: "1:278845824422:web:31464ec47ef880324e4367"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());

      var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
          },
          uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
          }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: '/sign-up-success.html',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
        //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: '<your-tos-url>',
        // Privacy policy url.
        privacyPolicyUrl: '<your-privacy-policy-url>'
      };
  
      // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);