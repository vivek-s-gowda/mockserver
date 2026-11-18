# Day 11 of 30: Building a Dev Tool Every Single Day 🚀

How often is your frontend development completely blocked because the backend API team hasn't finished the endpoints yet, or the staging server is down for maintenance?

Spinning up local mock servers usually means wrestling with bloated configuration files, setting up Node proxies, or hardcoding mock JSON files directly into your frontend code (which inevitably leaks into production).

For **Day 11 / 30**, I built **MockServer Studio** — a dynamic in-browser HTTP API mocking, scenario simulator, and contract generator built in **React 19** with the retro-aesthetic **Vaporwave Dream** theme (pastel lavender `#c084fc`, neon coral `#fb7185`, and deep mauve `#1a1026`).

Here is what it does:
• ⚡ **Dynamic In-Browser HTTP Router**: Define endpoints across GET, POST, PUT, PATCH, and DELETE with parameterized path matching (e.g. `/api/v1/products/:id`) and query string handling.
• 🎲 **Dynamic Faker-like Templating Engine**: Inject live synthetic mock data with dynamic tokens (`{{faker.name}}`, `{{faker.email}}`, `{{faker.uuid}}`, `{{faker.date}}`, `{{faker.company}}`, and `{{param.id}}`).
• ⏱️ **Configurable Latency Simulation**: Test frontend loading spinners, skeleton screens, and timeout handlers by dialing in simulated network delays from 0ms to 1200ms.
• 💻 **Live Interactive Request Console**: Dispatch simulated in-browser fetch requests, inspect exact round-trip response times, HTTP status codes, response headers, and formatted JSON output in real time.
• 📋 **1-Click Contract & Handler Exporter**:
  - **OpenAPI 3.0.0 Spec**: Complete JSON contract definitions with parameters, schemas, and response examples.
  - **MSW 2.0 (Mock Service Worker)**: Drop-in `http.get()` and `http.post()` browser and Node handlers.
  - **Express.js Router**: Production-ready `router.get()` handlers with simulated delays.
• 🧪 **9/9 Passing Automated Unit Tests**: Comprehensive test suite covering parameterized routing, token interpolation, latency dispatching, and spec generators via Node's native test runner (`node --test`).
• 🚀 **Sub-250ms Vite Engine**: Compact, production-optimized Vite 8 build deployed to Firebase Hosting.

### ⚙️ Architecture & Tech Stack
• **Architecture**: Modular React 19 structure (`Header`, `RouteListSidebar`, `RouteEditorPanel`, `InteractiveTesterPanel`, `ContractExportModal`, `Toast`).
• **Aesthetic**: Vaporwave Dream retro console with instant runtime switching to Cyberpunk Neon, Tokyo Night, and Nordic Glacier.
• **Zero Day Badges**: Clean commercial-grade presentation.

Check out the 4 snapshots below:
1️⃣ Hero Overview — 3-column workspace with endpoint list, route editor & live request console
2️⃣ Core Workflow — Dynamic parameterized routing (`/api/v1/products/:id`) and Faker token injection
3️⃣ Feature Deepdive — High-latency checkout simulation with custom HTTP status codes
4️⃣ Export Results — 1-click OpenAPI 3.0.0 and MSW 2.0 handler export

👉 For frontend & fullstack developers: When developing new features, do you prefer mocking APIs with MSW in the browser, or setting up a dedicated mock backend service?

#buildinpublic #30daychallenge #softwareengineering #webdevelopment #react #javascript #api #openapi #msw #frontend #coding
