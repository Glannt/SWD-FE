# AI Chatbot ACC - Frontend

## Tổng quan

Frontend application cho hệ thống AI Chatbot ACC (Admission Career Counseling) được xây dựng bằng React 19 + TypeScript.

## Công nghệ sử dụng

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Cài đặt

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm hoặc pnpm

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình environment

1. Copy file `env.example` thành `.env`

```bash
cp env.example .env
```

2. Cập nhật các biến môi trường trong `.env`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_NODE_ENV=development
```

### Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## Cấu trúc dự án

```
src/
├── components/          # React components
├── context/            # React Context providers
├── hooks/              # Custom hooks
│   ├── useAuth.ts      # Authentication hook
│   └── useChat.ts      # Chat management hook
├── pages/              # Page components
├── services/           # API services
│   ├── auth.service.ts # Authentication service
│   ├── chat.service.ts # Chat service
│   ├── campus.service.ts # Campus service
│   └── index.ts        # Service exports
├── types/              # TypeScript types
│   └── api.ts          # API types
├── utils/              # Utility functions
│   └── api.ts          # Axios configuration
└── App.tsx             # Main App component
```

## API Services

### Authentication Service

```typescript
import { authService } from "./services";

// Login
await authService.login({ email, password });

// Register
await authService.register({ email, password, fullName });

// Logout
await authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();
```

### Chat Service

```typescript
import { chatService } from "./services";

// Ask question to AI
const response = await chatService.askQuestion({ question: "Hello" });

// Get chat sessions
const sessions = await chatService.getChatSessions();

// Create new session
const session = await chatService.createChatSession("New Chat");
```

### Campus Service

```typescript
import { campusService } from "./services";

// Get all campuses
const campuses = await campusService.getCampuses();

// Get programs
const programs = await campusService.getPrograms();
```

## Custom Hooks

### useAuth Hook

```typescript
import { useAuth } from "./hooks/useAuth";

const { user, isAuthenticated, login, logout } = useAuth();
```

### useChat Hook

```typescript
import { useChat } from "./hooks/useChat";

const { messages, sendMessage, sessions } = useChat();
```

## Axios Configuration

Axios được cấu hình với:

- **Base URL**: Tự động từ environment variable
- **Request Interceptor**: Tự động thêm JWT token
- **Response Interceptor**: Xử lý lỗi authentication và redirect
- **Error Handling**: Tự động redirect về login khi token hết hạn

## Development

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Tích hợp với Backend

Frontend được thiết kế để tích hợp với backend NestJS tại:

- **Development**: `http://localhost:3000/api`
- **Production**: Cấu hình qua `VITE_API_URL`

### API Endpoints chính

- `/auth/*` - Authentication
- `/chatbot/*` - Chatbot services
- `/chatsession/*` - Chat session management
- `/campus/*` - Campus information

## Troubleshooting

### Lỗi CORS

Đảm bảo backend đã cấu hình CORS cho frontend domain.

### Lỗi Authentication

Kiểm tra JWT token trong localStorage và cấu hình backend.

### Lỗi API Connection

Kiểm tra `VITE_API_URL` và đảm bảo backend đang chạy.

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License
