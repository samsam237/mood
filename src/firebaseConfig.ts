// src/firebaseConfig.ts

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDo33bVvWxnSl0jR9pUsWpx5cH5PgT4UdQ",
    authDomain: "actipop-authentication.firebaseapp.com",
    projectId: "actipop-authentication",
    storageBucket: "actipop-authentication.firebasestorage.app",
    messagingSenderId: "300243750008",
    appId: "1:300243750008:web:9fccc0653d155df34af18d",
    measurementId: "G-XN8S0TDRB7"
};

const firebaseConfigAndroid_ = {
    "project_info": {
      "project_number": "300243750008",
      "project_id": "actipop-authentication",
      "storage_bucket": "actipop-authentication.firebasestorage.app"
    },
    "client": [
      {
        "client_info": {
          "mobilesdk_app_id": "1:300243750008:android:2417283185e352ea4af18d",
          "android_client_info": {
            "package_name": "com.actipop.adroid"
          }
        },
        "oauth_client": [
          {
            "client_id": "300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com",
            "client_type": 3
          }
        ],
        "api_key": [
          {
            "current_key": "AIzaSyA1m3Vnt4U0zo0QwHrBENqwCfcjrDFQ2mg"
          }
        ],
        "services": {
          "appinvite_service": {
            "other_platform_oauth_client": [
              {
                "client_id": "300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com",
                "client_type": 3
              }
            ]
          }
        }
      }
    ],
    "configuration_version": "1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
