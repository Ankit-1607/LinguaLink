# LinguaLink

![React](https://img.shields.io/badge/Frontend-ReactJS-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-teal)

A social language-exchange platform that connects learners and native speakers based on shared interests and complementary language goals. Powered by real-time chat and video calling via GetStream.io, LinguaLink fosters meaningful practice and cultural exchange.

---

## 🔍 Features

* **Dynamic Matching**: Pair users learning the same language or match learners with native speakers based on interest tags and proficiency levels.
* **Real‑Time Communication**: Seamless text chat and video calls powered by [Stream](https://getstream.io/).
* **User Authentication**: Secure signup/login flow with JWT-based sessions.
* **Responsive Design**: Responsive layout built with Tailwind CSS, adapting gracefully to any screen size.
* **Profiles & Interests**: Showcase learning goals, native languages, interests, and availability.
* **Notifications**: In‑app notifications for new messages, incoming/outgoing friend requests.
  
---

🌐 Come check it out youself: [LinguaLink](https://lingualink-nz32.onrender.com/)

---

## 🛠️ Tech Stack

* **Frontend**: ReactJS, Tailwind CSS, Stream Chat & Video React SDKs
* **Backend**: Node.js, ExpressJS
* **Database**: MongoDB (Atlas)
* **Real‑Time Engines**: GetStream.io for chat & video
* **Authentication**: JSON Web Tokens (JWT)
* **Deployment**: Render

---

## 🔧 Usage

1. Register with your email.
2. Complete your profile: select native and learning languages, set proficiency, when you are available, your time zone and all set.
3. Browse suggested matches.
4. Start chatting or schedule a video call directly in-app.

---

## 🏗️ Architecture Overview

```
React Client  <-->  Express API  <-->  MongoDB
       │                 │
       └── Stream SDK ───┘
```

* **Stream SDK** handles socket connections for chat channels and video sessions.
* **Express API** exposes REST endpoints for user management, matching and notifications.
* **MongoDB** stores user profiles and requests.

### 📸 In-app screenshots

> Login Page

![image](https://github.com/user-attachments/assets/65b57b0f-231a-4ed0-b12f-ee7bbac4742c)

> SignUp Page

![image](https://github.com/user-attachments/assets/faa62db1-3d50-46ec-af0a-ded7781f69c9)

> Home Page

![image](https://github.com/user-attachments/assets/6f33a1a9-8905-4cb8-aea0-5df084de00d9)

Explore more here: [LinguaLink](https://lingualink-nz32.onrender.com/)

---

#### Made with ❤️ for language enthusiasts around the world!
