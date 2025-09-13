# SocialTech - Youth Connection Platform

A simple Firebase NoSQL project for surveying youth about connection difficulties and enabling basic matchmaking.

## 🎯 Project Overview

SocialTech helps young people make genuine connections by:
- Surveying youth about their connection difficulties
- Creating user profiles with interests
- Enabling swipe-based discovery
- Matching users with similar interests
- Storing all data in Firebase Firestore (NoSQL)

## 🔥 Firebase Setup Instructions

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "socialtech-app"
4. Disable Google Analytics (not needed for this project)
5. Click "Create project"

### Step 2: Enable Firestore Database
1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select your preferred location
5. Click "Done"

### Step 3: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname "SocialTech Web"
5. Copy the `firebaseConfig` object
6. Replace the config in `firebase-config.js`

### Step 4: Set Firestore Rules (for development)
1. Go to Firestore Database > Rules
2. Replace the rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click "Publish"

⚠️ **Note**: These rules allow all access - only use for development!

## 📊 Database Structure (NoSQL Design)

### Collections:

#### `users` Collection
```javascript
{
  name: "John Doe",
  age: 22,
  bio: "Love music and hiking",
  interests: ["music", "sports", "travel"],
  timestamp: serverTimestamp(),
  isActive: true
}
```

#### `surveys` Collection
```javascript
{
  challenge: "social-anxiety",
  loneliness: "sometimes",
  suggestions: "More group activities",
  timestamp: serverTimestamp(),
  userId: "user123"
}
```

#### `swipes` Collection
```javascript
{
  swiperId: "user123",
  targetId: "user456",
  action: "like", // or "reject"
  timestamp: serverTimestamp()
}
```

#### `matches` Collection
```javascript
{
  user1: "user123",
  user2: "user456",
  timestamp: serverTimestamp(),
  status: "active"
}
```

## 🚀 How to Run

1. Complete Firebase setup above
2. Open `index.html` in a web browser
3. Start with the Survey tab
4. Create your profile in Profile tab
5. Discover people in Discover tab
6. View matches in Matches tab

## 🎨 Features

- **Cream-themed UI** - Warm, welcoming design
- **Survey System** - Collect youth connection data
- **Profile Creation** - Dynamic user profiles
- **Interest Selection** - Up to 5 interests per user
- **Swipe Interface** - Like/pass on profiles
- **Match System** - Mutual likes create matches
- **Real-time Data** - Firebase Firestore integration

## 📱 NoSQL Concepts Demonstrated

1. **Document-based Storage** - Flexible user profiles
2. **Collections** - Organized data structure
3. **Real-time Updates** - Live match notifications
4. **Query Optimization** - Efficient profile loading
5. **Scalable Design** - NoSQL best practices

## 🔍 Key Firebase Queries Used

- **Profile Discovery**: `users.where('isActive', '==', true).limit(10)`
- **Match Detection**: `swipes.where('swiperId', '==', targetId).where('action', '==', 'like')`
- **User Matches**: `matches.where('user1', '==', currentUser)`

## 📈 Future Enhancements

- User authentication
- Chat system for matches
- Advanced matching algorithms
- Profile photos
- Location-based matching

## 🎓 Learning Objectives

This project demonstrates:
- Firebase Firestore setup and configuration
- NoSQL database design principles
- Real-time data synchronization
- Simple matchmaking algorithms
- Survey data collection and storage

Perfect for second-year computer science students learning NoSQL databases!
