# Meow AI Pro - Cat Expert Chatbot

## Overview

Meow AI Pro is a professional feline consultation chatbot application that integrates multiple AI providers to deliver veterinary-level cat expertise. The application features a React frontend with TypeScript, Express.js backend, and PostgreSQL database with Drizzle ORM. It provides multi-language support (English/Polish) and implements AI provider failover functionality.

## User Preferences

Preferred communication style: Simple, everyday language (Polski).

## Recent Changes (January 29, 2025)

✓ **OAuth-Style Connection System**: Implemented user-friendly modal system for connecting AI provider accounts
✓ **Multi-Provider Failover**: Automatic switching between Claude, OpenAI, Gemini, and Cohere when limits reached
✓ **Professional Cat Expertise**: Veterinary-level advice system with emergency detection
✓ **Multi-Language Support**: Full Polish/English translation system with dynamic language switching
✓ **TypeScript Error Resolution**: Fixed all LSP diagnostics for production-ready code
✓ **Enhanced UI Components**: Added Dialog and Label components for professional user experience

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom cat-themed color palette
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with proper error handling
- **Development**: TSX for TypeScript execution in development

### Database Architecture
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migration Tool**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless connection

## Key Components

### AI Provider Management
- **Multi-Provider Support**: Integrates Claude (Sonnet-4), OpenAI (GPT-4o), Google Gemini (2.5-flash), and Cohere
- **OAuth-Style Connections**: User-friendly modal system with step-by-step API key setup instructions
- **Automatic Failover System**: Seamless switching between providers when limits reached or errors occur
- **Token Tracking**: Real-time monitoring of usage limits and token consumption per provider
- **Provider Status Management**: Visual indicators for connected/disconnected/error states
- **No Pre-configured Keys**: Each user connects their own AI accounts for maximum privacy

### Chat System
- **Session Management**: Persistent chat sessions with language preferences
- **Real-time Messaging**: Streaming responses with typing indicators
- **Quick Prompts**: Pre-built prompts for common cat-related queries
- **Multi-language**: English and Polish language support

### Cat Expert System
- **Veterinary Expertise**: Professional-level cat health and behavior advice
- **Emergency Detection**: Automatic urgency classification for health concerns
- **Contextual Responses**: Enhanced prompts with cat-specific context
- **Safety First**: Always prioritizes cat safety with vet referral recommendations

### Storage Layer
- **In-Memory Storage**: Development storage implementation
- **Database Schema**: Comprehensive models for AI providers, chat sessions, and messages
- **Data Persistence**: Structured storage for chat history and provider configurations

## Data Flow

1. **User Input**: User submits question through React frontend
2. **Session Management**: Backend creates or retrieves chat session
3. **AI Provider Selection**: System selects active AI provider based on availability
4. **Expert Processing**: Question is enhanced with cat expert context and system prompts
5. **AI Response**: Selected provider generates response using veterinary knowledge
6. **Failover Handling**: If provider fails, system automatically switches to backup
7. **Response Delivery**: Formatted response sent back to frontend with provider metadata
8. **Storage**: All messages and provider usage stored in database

## External Dependencies

### AI Providers
- **Anthropic Claude**: Latest Claude-sonnet-4-20250514 model for advanced reasoning
- **OpenAI**: GPT-4o for comprehensive language understanding
- **Google Gemini**: Gemini-2.5-flash for fast responses
- **Cohere**: Alternative provider for redundancy

### UI Framework
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Fast build tool with HMR support
- **TanStack Query**: Server state synchronization
- **Wouter**: Lightweight routing solution

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend running on port 5000
- **Hot Module Replacement**: Real-time code updates without page refresh
- **User-Provided API Keys**: No environment variables needed for AI providers
- **TypeScript Compilation**: Real-time type checking with TSX and zero LSP errors

### Production Build
- **Frontend**: Vite production build with optimized bundles
- **Backend**: ESBuild compilation to ESM format
- **Static Assets**: Served from Express with proper caching headers
- **Database**: PostgreSQL connection via environment variables
- **User Data Privacy**: API keys stored per-session, not in environment

### Configuration Management
- **Database Migrations**: Drizzle Kit for schema versioning
- **User-Controlled Setup**: Each visitor connects their own AI accounts
- **Zero-Configuration Deployment**: Ready for GitHub Pages, Render, or Replit
- **Monitoring**: Request logging and comprehensive error handling

### Key Features for Production
- **No API Key Requirements**: Users provide their own credentials through OAuth-style flow
- **Multi-Language Ready**: Polish and English support with easy extension
- **Professional UI**: Shadcn/ui components with cat-themed design
- **Scalable Architecture**: In-memory storage with easy database migration path

The application is optimized for hosting platforms that don't require pre-configured API keys, making it accessible to any user with their own AI provider accounts.