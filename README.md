# lab7-mvc-crud
COMP 305 Fall 2025

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

## Data Structure

**Message Object:**
```javascript
{
  id: crypto.randomUUID(),    // Unique UUID
  text: "Hello!",             // Content
  isUser: true,               // true=user, false=bot
  timestamp: Date.now(),      // Unix timestamp
  edited: false               // Edit status
}
```

**localStorage:**
```javascript
// Key: 'eliza-chat-messages'
// Value: Array of message objects
```

## Design Patterns

### Model-View-Controller
- **Benefits:** Clear separation, testable components, team collaboration
- **Trade-offs:** More complex than single-file, requires understanding patterns

### Observer Pattern
- **Benefits:** Loose coupling, reactive updates, scalable
- **Trade-offs:** Indirect flow can be harder to debug

## User Guide

**Send Message:** Type text → Press Enter or click Send  
**Edit Message:** Hover → Click Edit → Enter new text  
**Delete Message:** Hover → Click Delete → Confirm  
**Export:** Click "📥 Export Chat" → JSON downloads  
**Import:** Click "📤 Import Chat" → Select JSON file  
**Clear All:** Click "🗑️ Clear All" → Confirm  

## Challenges Encountered

### ES6 Module Loading
**Problem:** Modules require HTTP server, don't work with `file://`  
**Solution:** Required local server, documented setup clearly  
**Learning:** ES6 modules need proper server configuration

### Observer Pattern Implementation
**Problem:** View not updating when Model changed  
**Solution:** Implemented subscribe/notify pattern  
**Learning:** Observer pattern creates reactive architecture

### Event Delegation
**Problem:** Edit/delete buttons didn't work on dynamic elements  
**Solution:** Used event delegation on parent container with `closest()`  
**Learning:** Event delegation handles dynamic content efficiently


### localStorage Corruption
**Problem:** Invalid JSON crashed app on load  
**Solution:** Try-catch blocks, data validation, graceful fallbacks  
**Learning:** Always handle data corruption gracefully

## Key Reflections

### MVC Benefits
- **Separation of Concerns:** Each layer has one responsibility
- **Testability:** Components can be tested independently
- **Maintainability:** UI changes don't affect data logic
- **Team Collaboration:** Clear boundaries for parallel work

### Observer Pattern Benefits
- **Loose Coupling:** Model doesn't know View exists
- **Reactive Updates:** UI automatically reflects data changes
- **Scalability:** Easy to add new observers (analytics, logging)

## Testing localStorage

**View Data:**
1. DevTools (F12) → Application → Local Storage
2. Find key: `eliza-chat-messages`
3. View JSON array

**Test Persistence:**
1. Send messages → Refresh page
2. Messages should reload

**Test Error Handling:**
1. Manually corrupt JSON in localStorage
2. Refresh → Should handle gracefully

## Key Takeaways

1. **MVC Provides Structure:** Clear separation makes complex apps manageable
2. **Observer Pattern Enables Reactivity:** Loose coupling creates flexible code
3. **Component-Based Thinking:** Self-contained elements improve maintainability
4. **Error Handling is Critical:** Always validate and handle storage errors
5. **Architectural Patterns Are Tools:** Choose patterns based on project needs
6. **Progression from Lab 6:** Lab 6 taught component UI, Lab 7 teaches full app architecture

## Comparison with Lab 6

**Lab 6:** Component-based UI (Web Components, Shadow DOM)  
**Lab 7:** MVC architecture (data management, separation of concerns)  
**Together:** Foundation for building maintainable web applications

## License
This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for
details.

## Author
Chloe Ogamba

## References
- [MDN - Model-View-Controller](https://developer.mozilla.org/en-US/docs/Glossary/MVC)
- [MDN - Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [MDN - localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN - ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
