🤖 AI Personal Assistant

An intelligent personal assistant powered by AI — schedule tasks, set reminders, and get daily news summaries, all in one place.

<img width="897" height="550" alt="image" src="https://github.com/user-attachments/assets/b58ec1b1-3924-43ac-bb42-725ec4cc1391" />
<img width="875" height="582" alt="image" src="https://github.com/user-attachments/assets/365d172e-7279-485a-b4a8-479e4057ce54" />
<img width="1112" height="700" alt="image" src="https://github.com/user-attachments/assets/b7024958-ac25-420a-96aa-d49fb8d4d8e6" />
<img width="875" height="750" alt="image" src="https://github.com/user-attachments/assets/338abb4f-95e5-4495-bd9b-9c1137a820f2" />
<img width="925" height="750" alt="image" src="https://github.com/user-attachments/assets/94db3b1f-3baa-4cfe-81ee-a0a68d2da2e1" />


📌 Project Description
AI Personal Assistant is a smart web application that helps you stay organized and informed. It leverages Artificial Intelligence to let you:

Schedule and manage your tasks effortlessly
Set reminders so you never miss anything important
Get AI-generated daily news summaries personalized for you

Built with React, Firebase, and Tailwind CSS, this app delivers a fast, clean, and responsive experience.

✨ Features

🗓️ Task Scheduling — Create, update, and manage tasks with due dates and priorities
⏰ Smart Reminders — Get notified about upcoming tasks and events
📰 Daily News Summaries — AI-curated news delivered in concise, readable summaries
🔐 User Authentication — Secure login and signup via Firebase Auth
☁️ Real-time Database — Data synced instantly using Firebase Firestore
📱 Responsive Design — Works beautifully on desktop and mobile


🛠️ Tech Stack
TechnologyPurposeReact.jsFrontend UIFirebase AuthUser AuthenticationFirebase FirestoreReal-time DatabaseFirebase HostingDeploymentTailwind CSSStyling & Responsive DesignAI/News APINews Summaries

📸 Screenshots

🚧 Screenshots coming soon — stay tuned!

<!-- Once you have screenshots, add them like this:
![Dashboard](./public/screenshots/dashboard.png)
![Task Manager](./public/screenshots/tasks.png)
![News Feed](./public/screenshots/news.png)
-->

🌐 Live Demo

🚀 Coming Soon — Will be deployed on Firebase Hosting


⚙️ Installation & Setup
Follow these steps to run the project locally:
1. Clone the Repository
bashgit clone https://github.com/barais111/Personal_Assistant_Project.git
cd Personal_Assistant_Project
2. Install Dependencies
bashnpm install
3. Set Up Environment Variables
Create a .env file in the root directory and add your Firebase config:
envREACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_NEWS_API_KEY=your_news_api_key
4. Start the Development Server
bashnpm start
Open http://localhost:3000 in your browser.
5. Build for Production
bashnpm run build

🚀 Deployment (Firebase Hosting)
bashnpm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy

📂 Folder Structure
Personal_Assistant_Project/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # App pages/screens
│   ├── firebase/         # Firebase config & setup
│   └── App.js            # Main app entry
├── .firebaserc           # Firebase project config
├── firebase.json         # Firebase hosting config
├── tailwind.config.js    # Tailwind CSS config
├── package.json          # Project dependencies
└── README.md

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.

📬 Contact
Your Name
📧 your.email@gmail.com
💼 LinkedIn
🐙 GitHub
