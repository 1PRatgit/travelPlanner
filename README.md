# TravelPlanner

<p align="center">
  <img src="https://img.shields.io/badge/TravelPlanner-Full--Stack--App-blue?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat" />
  <img src="https://img.shields.io/badge/docker-ready-blue?style=flat" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=flat" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat" />
</p>

---

## 🌍 Overview

**TravelPlanner** is a full-stack, containerized travel planning platform featuring a React UI, FastAPI backend, and PostgreSQL database. Built with modern DevOps and cloud deployment workflows.

---

## ⭐ Key Features

* 🧭 **Plan Trips Easily** – Create, edit, and manage travel itineraries.
* ⚡ **FastAPI Backend** – High-performance async API.
* 🎨 **React UI** – Smooth, modern single-page experience.
* 🐘 **PostgreSQL Storage** – Reliable persistent database.
* 🐳 **Full Dockerization** – Production-ready container setup.
* ☁️ **AWS Deployment** – ECR + EC2 architecture for scalable hosting.
* 🔐 **Clean Separation of Frontend/Backend** – Independent deployable services.

---

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📌 Table of Contents

* [🌍 Overview](#-overview)

* [⭐ Key Features](#-key-features)

* [📐 Architecture Diagrams](#architecture-diagrams)

* [🔧 Components](#components)

* [📄 License](#license)


---

## Architecture Diagrams

### 1) Sequence Diagram (Client → Frontend → Backend → DB)

This diagram shows the runtime flow for a typical user action such as creating a trip:

* The browser loads the React application.
* User performs an action in the UI (e.g., Create Trip).
* The React app sends an HTTP API request (e.g., `POST /trips`) to the FastAPI backend.
* FastAPI validates and processes the request, performs business logic, and queries/inserts data into PostgreSQL.
* DB returns the result; FastAPI responds with JSON (success / error).
* The React UI updates with the new data.


<img width="979" height="526" alt="Sequence diagram" src="https://github.com/user-attachments/assets/3ceca406-96bb-4456-9077-28d39e6cd979" />

---

### 2) Deployment Diagram (ECR → EC2 → Containers)

This diagram shows the recommended deployment architecture for a simple, single-host deployment:

* Build frontend and backend Docker images locally (or via CI) and push to **AWS ECR**.
* An **AWS EC2** host runs Docker and Docker Compose and pulls images from ECR.
* Containers running on the EC2 host:

  * React frontend served via Nginx (container)
  * FastAPI backend served via Uvicorn/Gunicorn (container)
  * PostgreSQL 15 (container) with a **persistent Docker volume** for data storage
* The user interacts with the React frontend over HTTP/HTTPS; the frontend communicates with the backend inside the host's network.


<img width="971" height="264" alt="System srchitecture" src="https://github.com/user-attachments/assets/1da93746-bb32-477a-b193-229081f418cd" />



---


## 📄 License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**TravelPlanner** is a simple full-stack travel planning application built with a React frontend, FastAPI backend, and PostgreSQL database. The app is containerized with Docker and intended to be deployed on an AWS EC2 host using Docker Compose. This README explains the architecture, how the pieces interact (sequence + deployment diagrams included), and how to run and deploy the project.

---



## Components

* **React Frontend**: Single-page app (Create / Read / Update / Delete trips). Built and served via Nginx in production.
* **FastAPI Backend**: REST API endpoints for trip management. Uses Pydantic for validation and SQLAlchemy / async DB driver to talk to PostgreSQL.
* **PostgreSQL**: Stores trip data. Deployed as a Docker container with a named, persistent volume.
* **Docker & Docker Compose**: Used for local development and simplifies single-host deployment.
* **AWS ECR**: Container registry for storing built images.
* **AWS EC2**: Host for running containers in production (single-node deployment). Use a t3 / t2 instance type for small deployments.

---

## Getting Started (Local development)

### Prerequisites

* Node.js & npm or yarn
* Python 3.10+
* Docker & Docker Compose
* (Optional) `make` utility for helper commands

### Run locally (without containers)

1. Frontend

```bash
# from project-root/frontend
npm install
npm start
```

2. Backend

```bash
# from project-root/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. Database

Run a local Postgres instance (e.g., via Docker) or use an existing PostgreSQL server. Example using Docker:

Update your backend `.env` / config with the DB connection string.

### Run with Docker Compose (recommended)

This starts frontend, backend and a PostgreSQL container with persistent volume.

```bash
# from project-root
docker compose up --build
```

Open `http://localhost:3000` (or port configured in compose) to use the app.

---

## Build & Push Images to ECR (CI / Manual)

1. Build the images:

```bash
# frontend
docker build -t travelplanner-frontend:latest ./frontend
# backend
docker build -t travelplanner-backend:latest ./backend
```

2. Tag images for ECR and push (example):

```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
docker tag travelplanner-frontend:latest <account>.dkr.ecr.<region>.amazonaws.com/travelplanner-frontend:latest
docker tag travelplanner-backend:latest <account>.dkr.ecr.<region>.amazonaws.com/travelplanner-backend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/travelplanner-frontend:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/travelplanner-backend:latest
```


## Deploy on EC2 (single-host with Docker Compose)

1. Provision an EC2 instance and install Docker & Docker Compose.
2. Pull images from ECR (or build on the host):

```bash
# on EC2
docker pull <account>.dkr.ecr.<region>.amazonaws.com/travelplanner-frontend:latest
docker pull <account>.dkr.ecr.<region>.amazonaws.com/travelplanner-backend:latest
```

3. Start the stack using a `docker-compose.yml` that references the images, and ensure a named volume is defined for Postgres.

4. Configure firewall / security groups to allow HTTP/HTTPS (ports 80/443) and limit SSH to your admin IP.

---


## Database Migrations

Use Alembic (or your migration tool) to manage schema changes. Example:

```bash
# inside backend env
alembic revision --autogenerate -m "create trips table"
alembic upgrade head
```

When using Docker, run migrations from the backend container before starting the app in production.

---

## Troubleshooting

* If containers fail to start, inspect logs:

```bash
docker compose logs -f
```

* DB connection errors: ensure the `DATABASE_URL` host matches the Docker Compose service name (commonly `db`) and the port is correct.

---

