/**
 * ChatView - Handles all UI rendering and updates
 * Responsibilities: DOM manipulation, rendering, NO business logic
 */
class ChatView {
  constructor() {
    // Cache DOM elements
    this.chatContainer = document.getElementById('chat-messages');
    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message-input');
    this.messageCount = document.getElementById('message-count');
    this.lastSaved = document.getElementById('last-saved');
    this.exportBtn = document.getElementById('export-btn');
    this.importBtn = document.getElementById('import-btn');
    this.clearBtn = document.getElementById('clear-btn');
    this.importFile = document.getElementById('import-file');

    // Event handlers (will be bound by Controller)
    this.onMessageSubmit = null;
    this.onMessageEdit = null;
    this.onMessageDelete = null;
    this.onClearAll = null;
    this.onExport = null;
    this.onImport = null;
  }

  /**
   * Initialize event listeners
   * Controller will set the handler functions
   */
  bindEvents() {
    // Form submission
    if (this.messageForm && this.onMessageSubmit) {
      this.messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.messageInput.value.trim();
        if (text) {
          this.onMessageSubmit(text);
          this.messageInput.value = '';
          this.messageInput.focus();
        }
      });
    }

    // Clear all button
    if (this.clearBtn && this.onClearAll) {
      this.clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
          this.onClearAll();
        }
      });
    }

    // Export button
    if (this.exportBtn && this.onExport) {
      this.exportBtn.addEventListener('click', () => {
        this.onExport();
      });
    }

    // Import button triggers file input
    if (this.importBtn && this.importFile) {
      this.importBtn.addEventListener('click', () => {
        this.importFile.click();
      });
    }

    // Import file selection
    if (this.importFile && this.onImport) {
      this.importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.onImport(event.target.result);
          };
          reader.readAsText(file);
          // Reset input so same file can be selected again
          e.target.value = '';
        }
      });
    }

    // Event delegation for edit/delete buttons
    if (this.chatContainer) {
      this.chatContainer.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-btn');
        const editBtn = e.target.closest('.edit-btn');
        const saveBtn = e.target.closest('.save-btn');
        const cancelBtn = e.target.closest('.cancel-btn');

        if (deleteBtn) {
          const messageId = deleteBtn.dataset.messageId;
          if (confirm('Delete this message?')) {
            this.onMessageDelete && this.onMessageDelete(messageId);
          }
        } else if (editBtn) {
          const messageId = editBtn.dataset.messageId;
          this._enterEditMode(messageId);
        } else if (saveBtn) {
          const messageId = saveBtn.dataset.messageId;
          this._saveEdit(messageId);
        } else if (cancelBtn) {
          const messageId = cancelBtn.dataset.messageId;
          this._cancelEdit(messageId);
        }
      });
    }
  }

  /**
   * Render all messages
   * @param {Array<Object>} messages - Array of message objects
   */
  renderMessages(messages) {
    if (!this.chatContainer) return;

    // Show empty state if no messages
    if (messages.length === 0) {
      this.chatContainer.innerHTML = `
        <div class="empty-state">
          <p>No messages yet. Start a conversation!</p>
        </div>
      `;
      this._updateStats(0, null);
      return;
    }

    // Clear and render all messages
    this.chatContainer.innerHTML = '';
    messages.forEach(message => {
      const messageElement = this._createMessageElement(message);
      this.chatContainer.appendChild(messageElement);
    });

    // Auto-scroll to latest message
    this._scrollToBottom();

    // Update stats
    const lastMessage = messages[messages.length - 1];
    this._updateStats(messages.length, lastMessage.timestamp);
  }

  /**
   * Create a message element (component-style)
   * @private
   * @param {Object} message - Message object
   * @returns {HTMLElement} Message element
   */
  _createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.dataset.messageId = message.id;

    // Message content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message.text;
    
    contentDiv.appendChild(textDiv);

    // Metadata (timestamp and edited indicator)
    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';