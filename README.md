# AI Blog Platform

## 🚀 Overview

A full-stack blog platform built with Next.js and Supabase. It supports authentication, role-based access, and AI-generated summaries for posts using Gemini API.

---

## 🛠 Tech Stack

* Next.js
* Supabase (Auth + Database)
* Google Gemini API
* Vercel (Deployment)

---

## ✨ Features

* User Signup & Login
* Role-Based Access (Admin, Author, Viewer)
* Create, Edit, Delete Posts
* Add Comments
* AI-generated summaries
* Image support using URLs

---

## ⚙️ Setup

```bash
git clone https://github.com/saipriya-3084/blog-platform.git
cd blog-platform
npm install
npm run dev
```

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
GEMINI_API_KEY=your_key
```

---

## 🌍 Deployment

Deployed using Vercel.

---

## 🐞 Issue Faced

Invalid image URLs caused errors in Next.js Image component.
Fixed by using proper direct image links (Unsplash CDN).

---

## 🔗 Live Demo

(Add your deployed link here)

