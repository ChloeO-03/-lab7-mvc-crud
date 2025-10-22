# lab7-mvc-crud
CSE 134B Fall 2024

# Lab 7: MVC CRUD Chat Application

## Overview
This project implements a chat application using the Model-View-Controller (MVC) architectural pattern with full CRUD operations. The application features an Eliza-style chatbot with localStorage persistence, demonstrating separation of concerns and the observer pattern.

## Live Demo
- [Deployed Application](https://your-app-url.netlify.app/)
- [GitHub Repository](https://github.com/yourusername/lab7-mvc-crud)

## Technologies Used
- HTML5, CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+ Modules, Classes)
- Web Storage API (localStorage)
- Web APIs (FileReader, Blob)
- Observer Pattern

## Architecture Overview

### Model (model.js)
**Responsibility:** Manages all data and business logic.

- CRUD operations for chat messages
- localStorage persistence
- Observer pattern for data change notifications
- JSON export/import functionality
- Data validation and error handling

**Key Methods:**
- `create(text, isUser)` - Add message
- `getAll()` - Get all messages
- `update(id, newText)` - Edit message
- `delete(id)` - Remove message
- `clear()` - Remove all messages
- `subscribe(callback)` - Register observer
- `exportToJSON()` / `importFromJSON()`

**Does NOT:**
- Touch the DOM
- Know about View or Controller
- Handle user interactions

### View (view.js)
**Responsibility:** Handles all DOM manipulation and presentation.

- Component-based message rendering
- Event binding (form, buttons, clicks)
- UI state management (loading, empty, error)
- Auto-scroll and animations

**Key Methods:**
- `renderMessages(messages)` - Display all messages
- `bindEvents()` - Attach event listeners
- `_createMessageElement(message)` - Build message DOM
- `_formatTimestamp()` - Format time display

**Does NOT:**
- Store or manage data
- Contain business logic
- Access localStorage

### Controller (controller.js)
**Responsibility:** Coordinates Model and View.

- Initializes Model and View
- Handles user actions
- Generates bot responses (Eliza)
- Manages data flow between layers

**Key Methods:**
- `handleSendMessage(text)`
- `handleEditMessage(id, newText)`
- `handleDeleteMessage(id)`
- `handleClearAll()`
- `handleExport()` / `handleImport()`

**Does NOT:**
- Manipulate DOM directly
- Access localStorage directly

## Key Features

### Chat Functionality
- ✅ Real-time Eliza bot responses
- ✅ User messages (right/blue), bot messages (left/gray)
- ✅ Auto-scroll to latest
- ✅ Enter key support
- ✅ Message count display

### CRUD Operations
- ✅ **Create:** Add user/bot messages
- ✅ **Read:** Load from localStorage, display chronologically
- ✅ **Update:** Edit user messages with "(edited)" indicator
- ✅ **Delete:** Remove individual or all messages with confirmation

### Data Management
- ✅ Export chat history as JSON
- ✅ Import from JSON with validation
- ✅ Persist to localStorage
- ✅ Error handling for corrupted data

## File Structure