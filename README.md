# FairFund

**FairFund** is a collaborative budgeting and expense management platform designed for roommates, community groups, nonprofits, and co-ops to transparently track shared expenses and manage group finances.

---

## Features

TBD

---

## Tech Stack

| Layer     | Tech                                      |
|-----------|-------------------------------------------|
| Frontend  | React.js, Tailwind, axios                 |
| Backend   | Node.js, Express.js                       |
| Database  | MongoDB (via Mongoose)                    |
| Auth      | Google OAuth 2.0, JWT                     |
| DevOps    | Azure DevOps (CI/CD)                      |

---

## Project Structure
fairfund-frontend/
├── public/ # contains all static files such as images, html, json, etc.
├── src/api/ # contains all the API services
├── src/components # contains all the components
├── src/context # contains all context files
├── src/pages # contains all the pages
├── src/App.js # main file containing the root component

---

## Environment Variables

Create a `.env` file in the root:

```env

REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```
---

## Install Dependencies 
 ```
 npm install
 ```
---
## Run the frontend
```
npm start
```

## Check out the FairFund frontend
```
http://localhost:3000
```

---