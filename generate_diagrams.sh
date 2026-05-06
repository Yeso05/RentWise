cat << 'M1' > rw_diagrams/fig1_arch.mmd
graph TD
  Client[React/Vite Frontend Client Tier]
  API[Node.js/Express API Application Tier]
  DB[(PostgreSQL DB Data Tier)]
  Client -- HTTP / JSON --> API
  API -- pg-pool / SQL --> DB
M1

cat << 'M2' > rw_diagrams/fig2_dfd.mmd
graph LR
  User((User))
  Auth[Auth Controller]
  Local[(Local Storage)]
  Protect[Protected Route]
  API[Protected Controllers]
  DB[(PostgreSQL)]

  User -->|Email/Pass| Auth
  Auth -->|JWT Token| Local
  User -->|Navigate| Protect
  Protect -->|Read Token| Local
  Protect -->|Access| API
  API -->|SQL Queries| DB
M2

cat << 'M3' > rw_diagrams/fig3_er.mmd
erDiagram
  USERS ||--o{ PROPERTIES : owns
  USERS ||--o| TENANTS : has_profile
  PROPERTIES ||--o{ TENANTS : houses
  TENANTS ||--o{ PAYMENTS : makes
  PROPERTIES ||--o{ PAYMENTS : receives
  TENANTS ||--o{ MAINTENANCE_REQUESTS : submits
  PROPERTIES ||--o{ MAINTENANCE_REQUESTS : has
  TENANTS ||--o{ LEASE_DOCUMENTS : signs
  PROPERTIES ||--o{ LEASE_DOCUMENTS : has
  USERS ||--o{ NOTIFICATIONS : receives
M3

cat << 'M4' > rw_diagrams/fig4_rbac.mmd
graph TD
  User((User))
  Login[Login]
  JWT{JWT Role}
  Landlord[Landlord Portal]
  Tenant[Tenant Portal]

  User --> Login
  Login --> JWT
  JWT -->|role landlord| Landlord
  JWT -->|role tenant| Tenant
M4

cat << 'M5' > rw_diagrams/fig5_state.mmd
stateDiagram-v2
  [*] --> Unauthenticated
  Unauthenticated --> Authenticating : Login Request
  Authenticating --> Authenticated : Valid Credentials
  Authenticating --> Unauthenticated : Invalid Credentials
  Authenticated --> SessionExpired : Token Expires/Invalid
  Authenticated --> Unauthenticated : Logout
  SessionExpired --> Unauthenticated : Redirect to Login
M5

cat << 'M6' > rw_diagrams/fig6_backend.mmd
graph TD
  Router[Express Routers]
  Controller[Controllers]
  Pool[pg Pool]
  DB[(PostgreSQL)]

  Router -->|Dispatches req| Controller
  Controller -->|pool.query| Pool
  Pool -->|SQL| DB
M6

cat << 'M7' > rw_diagrams/fig7_frontend.mmd
graph TD
  App[App]
  Router[react-router-dom]
  Protect[ProtectedRoute]
  Layout[AppLayout]
  Landlord[Landlord Pages]
  Tenant[Tenant Pages]

  App --> Router
  Router --> Protect
  Protect --> Layout
  Layout --> Landlord
  Layout --> Tenant
M7

npx -y @mermaid-js/mermaid-cli -i rw_diagrams/fig1_arch.mmd -o rw_diagrams/fig1_arch.png -b transparent
npx -y @mermaid-js/mermaid-cli -i rw_diagrams/fig2_dfd.mmd -o rw_diagrams/fig2_dfd.png -b transparent
npx -y @mermaid-js/mermaid-cli -i rw_diagrams/fig3_er.mmd -o rw_diagrams/fig3_er.png -b transparent
npx -y @mermaid-js/mermaid-cli -i rw_diagrams/fig4_rbac.mmd -o rw_diagrams/fig4_rbac.png -b transparent
npx -y @mermaid-js/mermaid-cli -i rw_diagrams/fig5_state.mmd -o rw_diagrams/fig5_state.png -b transparent
npx -y @mermaid-js/mermaid-cli -i rw_diagrams/fig6_backend.mmd -o rw_diagrams/fig6_backend.png -b transparent
npx -y @mermaid-js/mermaid-cli -i rw_diagrams/fig7_frontend.mmd -o rw_diagrams/fig7_frontend.png -b transparent

node BuildRentWise.js
