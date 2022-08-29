<!-- GETTING STARTED -->

## Getting Started

Here are the steps to reproduce this on your local machine.

### Prerequisites

Required tools

- npm or yarn
  ```sh
  npm install npm@latest -g
  ```
  ```sh
  npm install yarn@latest -g
  ```
- Docker
  https://www.docker.com/

### Installation

_Install and run_

1. Clone the repo
   ```sh
   git clone https://github.com/LucianoPierdona/tasks.git
   ```
2. Install NPM packages
   ```sh
   yarn
   ```
3. run docker compose (the process to compile Nest.js might take longer on Windows OS)
   ```sh
   docker-compose build && docker-compose up
   ```
4. run migrations (in case you don't see it in the logs)
   ```sh
   yarn migrate:dev
   ```
4. server url
   ```sh
   http://localhost:3001/
   ```

### Initial flow

1. Register at POST /auth/register with the properties:

```
{
    "email": "email",
    "username": "username",
    "password": "password",
    "role": "admin"
}
```

1.5. You can also login at POST /auth/login with the properties:

```
{
    "email": "email",
    "password": "password",
}
```

2. Use the returned bearer token on the other requests

3. Endpoints available for tasks

```
POST /tasks
{
    "title": "title",
    "description": "description",
    "status": "In Progress"
}

PUT /tasks/:id
{
    "title": "title",
    "description": "description",
    "status": "Archived"
}

GET /tasks/:id

GET /tasks/


```
