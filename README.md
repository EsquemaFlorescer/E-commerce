# E-commerce Software Architecture

---
## Multiple Application Layers
  - Infrastructure Layer ( Layer which connects to other services )
  - Service Layer ( such services as email delivery, sms verification, authentication )
  - Domain Layer ( doesn't have dependencies, has entities (models), business logic )

---
## Scalability
  - 1° step:
    Node auto-create processes with `cluster` based on CPU number of cores
  <br>

  - 2° step:
    Node auto-scale / auto-distribute CPU power with its processes with `pm2` (Process Manager 2).
  <br>

  - 3° step:
    Using Elixir to manage how much processing power each node server is using and auto-distribute machine resources.
  <br>

  - 4° step:
    Distribute services with processes, each route would have a different process to aliviate response time.
  <br>
  Sources:
    Benchmarks: ``https://www.vizteck.com/post/scaling-node-on-multi-cores-system``
    Proof Example: ``https://www.youtube.com/watch?v=8YJqB4pNNgs``

---
## Hosting Structure
  - **Databases**: 
    - [ ] `Main ( store all data )` | MongoDB / MySQL / PostgreSQL
    - [ ] `Users ( only store users )` | MongoDB
    - [ ] `Posts ( only store posts )` | MySQL / PostgreSQL

  - **Server**: 
    - [ ] `Main ( main processes and workers )` | Node.js ( Heroku )
    - [ ] `Backup ( only use if Main fails )` | Node.js ( Heroku )
    - [ ] `Control Panel ( dashboard of usage )` | Elixir

  - **Front-end**: 
    - [ ] `Main` | Next.js (SSR) ( Heroku / Vercel ) 
    - [ ] `Backup` | React.js (CSR) ( Heroku / Github Pages )

  - **Assets**:
    - [ ] `Main` | Static ( Github Repository )
      - `https://cdn.jsdelivr.net/gh/{userName}/{RepositoryName}/{file}`

---
## Aditional Features
  - **Logging each Request**:
    Log and store in the database every detail of a request in a separate file, which can be a `.log` or `.md`

## TODO:
  - [ ] Dockerize the application ( Docker & Kubernetes )
  - [ ] Create a dashboard
  - [ ] DevOps (CI/CD) with github ( for building the docker image, deploying the application )