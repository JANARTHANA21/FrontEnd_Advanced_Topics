🧠 React Query Practice – Frontend Advanced Topics

This project demonstrates advanced data fetching techniques in React using React Query (@tanstack/react-query). It includes regular fetch, caching, pagination, infinite scroll, and detailed page navigation using React Router.

Built with React + Vite, and styled with basic CSS for clarity.

⸻

🚀 Features Covered

✅ React Query Basics
	•	Controlled data fetching using useQuery
	•	Manual refetch triggers
	•	Error and loading states

✅ Pagination
	•	Page-based navigation using query keys
	•	Caching of previous pages with keepPreviousData

✅ Infinite Scroll
	•	Load more data with a button (fetchNextPage)
	•	Automatic data load on scroll using react-intersection-observer

✅ Detail Page Navigation
	•	Dynamic routes with React Router
	•	Product detail fetch using useParams and React Query

✅ Comparison with Regular Fetch
	•	State management with useState + useEffect
	•	Manual error/loading handling

⸻

🧩 Tech Stack

Tool/Library	Purpose
React + Vite	Frontend Framework & Dev Server
@tanstack/react-query	Data Fetching, Caching & State Mgmt
Axios	HTTP Requests
React Router DOM	Client-side Routing
react-intersection-observer	Infinite Scroll Triggering


⸻

📁 Folder Structure (if applicable)

├── src/
│   ├── App.jsx


│   │   
│   │   
│   ├── main.jsx
│   └── ...


⸻

🌍 Routes Available

Path	Page
/home	Home Page
/regular	Regular Fetch using useEffect
/usequeryfetch	React Query Fetch (manual trigger)
/usequeryfetch/:id	Product Detail Page
/pagination	Paginated Products View
/infinitescroll	Infinite Scroll with Button
/infinitescrollautomate	Auto Infinite Scroll with Observer


⸻

🛠️ How to Run

git clone https://github.com/JANARTHANA21/FrontEnd_Advanced_Topics.git
cd react-query-practice
npm i
npm run dev

Make sure you have Node.js and npm installed.

⸻

📚 Learning Purpose

This repo is meant for:
	•	Practicing advanced React Query usage
	•	Comparing useQuery vs useEffect
	•	Understanding server-state management in React
	•	Building real-world frontend logic like pagination & infinite scroll

⸻

👨‍💻 Author

Developed by @janarthana for mastering React Query as part of frontend advanced practice.

⸻


🙌 Credits
	•	API Source: dummyjson.com
	•	React Query: @tanstack/react-query
