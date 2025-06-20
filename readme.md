# 🏡 Rentify - A Full-Stack Hotel & Apartment Listing Platform

A full-stack application where users can sign up, list properties (like apartments, villas, hotels), add reviews, and see property locations on a map. It supports authentication, session management, image uploads to Cloudinary, and map rendering using Mapbox.

---

## 📌 Features

### Phase 1: Core Functionality

* 📦 MongoDB database with Mongoose models
* 📝 CRUD for Listings (Create, Read, Update, Delete)
* 🖼️ Upload multiple images per listing
* 💵 Fields include title, description, price, location, and country
* 📃 EJS templates with EJS-Mate for layout reuse
* 🌐 RESTful routes for listings
* ✅ Bootstrap 5 form validation (client-side)

### Phase 2: Advanced Backend & Auth

* ✨ Flash messages for success/failure feedback
* 👥 User Authentication via Passport.js
* 🔐 Authorization (edit/delete only by listing owner)
* 🌍 Reviews on Listings (One-to-Many Mongoose relationship)
* ⏱ Express Sessions and Cookies for login persistence
* 🔑 Custom middleware for route protection (isLoggedIn, isOwner, etc.)

### Phase 3: Enhancements & Deployment Ready

* 📂 MVC architecture: Separate routes, controllers, and models
* ☁️ Image Upload to Cloudinary using Multer
* 🌾 Mapbox integration with GeoCoding for location mapping
* 🧠 JOI Schema Validation (server-side)
* 🌎 MongoDB Atlas + Render for live deployment
* 🌱 Environment Variables with dotenv
* 💾 MongoDB session storage (connect-mongo)

---

## 🗃 Models

### 📌 Listing

```js
{
  title: String,
  description: String,
  image: [ { url: String, filename: String } ],
  price: Number,
  location: String,
  country: String,
  owner: ObjectId,
  geometry: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  reviews: [ObjectId]
}
```

### ✍️ Review

```js
{
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  author: ObjectId
}
```

### 👤 User

```js
{
  username: String,
  email: String,
  password: Hashed String (via passport-local-mongoose)
}
```

---

## 🧪 Tech Stack

* **Frontend**: HTML, CSS, Bootstrap 5, EJS
* **Backend**: Node.js, Express.js, MongoDB, Mongoose
* **Authentication**: Passport.js, Express Sessions
* **Validation**: JOI
* **Maps**: Mapbox
* **Image Upload**: Cloudinary + Multer
* **Deployment**: Render (Backend) + MongoDB Atlas

---

## ⚙️ Getting Started

### 1️⃣ Clone Repository

```bash
git clone 
cd rentify
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Setup

Create `.env` file:

```env
DB_URL=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
MAPBOX_TOKEN=your_mapbox_token
SESSION_SECRET=your_session_secret
```

### 4️⃣ Run Locally

```bash
node app.js
```

Visit: `http://localhost:3000`

---

## 🚀 Deployment on Render

1. Push to GitHub.
2. Login to [Render](https://render.com/)
3. Click "New Web Service" → Connect your GitHub repo
4. Add Environment Variables in Render Dashboard
5. Add Build Command: `npm install`
6. Add Start Command: `node app.js` or `npm start`
7. Set Web Service Region close to your users

---

## 🧬 Folder Structure

```
rentify/
│
├── models/            # Mongoose models (Listing, Review, User)
├── views/             # EJS templates
│   ├── includes/      # Navbar, Flash, Boilerplate
│   └── listings/      # listing views
├── routes/            # Routes (listing, review, user)
├── controllers/       # MVC controllers
├── public/            # Static files (CSS, JS)
├── middleware/        # Custom middleware (auth, validation)
├── utils/             # Utility files like ExpressError, wrapAsync
├── app.js             # Main server file
├── .env               # Secrets and keys
└── README.md
```

---

## ✨ Credits

* [Bootstrap](https://getbootstrap.com/)
* [EJS-Mate](https://www.npmjs.com/package/ejs-mate)
* [Passport.js](http://www.passportjs.org/)
* [Mapbox](https://docs.mapbox.com/)
* [Cloudinary](https://cloudinary.com/)
* [JOI Validation](https://joi.dev/)

---