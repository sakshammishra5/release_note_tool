## API Endpoints

Base URL: `https://release-note-tool.onrender.com/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/releases` | Get all releases |
| POST | `/api/releases` | Create new release |
| GET | `/api/releases/:id` | Get single release |
| PUT | `/api/releases/:id` | Update release notes |
| PATCH | `/api/releases/:id/steps` | Toggle step completion |
| DELETE | `/api/releases/:id` | Delete release |