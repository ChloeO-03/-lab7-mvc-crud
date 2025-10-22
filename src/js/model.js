/**
 * ChatModel - Manages cha data and localStorage persistance
 * Responsibilities: CRUD operations, data validation, storage, events
 */

class ChatModel {
    constructor (storageKey = 'chat-messages') {
        this.storageKey = storageKey;
        this.observers = []; // Obserer pattern for View updates
    }

    /**
     * Observer pattern - Register listeners for data chnages
     * @param {Function} callback - function to call when data changes
     * @returns {Functions} Unscribe function
     */

    subscribe (callback) {
        this.observers.push(callback);
        return () => {
            const index = this.observers.indexOf(callback);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
        };
    }
    /**
     * Notify all oservers of data change
     * @private
     */
    _notifyObservers() {
        const messages = this.getAll();
        this.observers.forEach(callback => {
            try {
                callback(messages);
            } catch (error) {
                console.error('Error in observer:', error);
            }
        });
    }
    /**
     * Create - Add a new message
     * @param {string} text - Message text
     * @param {boolean} isUser - True if user emssage, false if bot
     * @returns {Object} The creates message
     */
    create (text, isUser = true) {
        if(!text || text.trim().length ===0) {
            throw new Error('Messae text cannot be empty');
        }
        const messages = this.getAll();
        const newMessage = {
            id: crypto.randomUUIDD(),
            text: text.trim(),
            isUser: isUser,
            timestamp: Date.now(),
            edited: false
        };

        messages.push(newMessage);
        this._save(messages);
        this._notifyObservers();

        return newMessage;
    }
    /**
     * READ - Get all messages
     * @returns {Array<Object>} Array of message objects
     */

    getAll() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if(!data) return[];

            const parsed = JSON.parse(data);

            //Validate data structure
            if(!Array.isArray(parsed)) {
                console.warn('Invaid data in localStorage, resetting');
                return[];
            }

            return parsed;
        }catch(error) {
            console.error('Error reading from localStorage:', error);
            return[];
        }
    }
    /**
   * READ - Get a single message by ID
   * @param {string} id - Message ID
   * @returns {Object|null} Message object or null
   */
  getById(id) {
    const messages = this.getAll();
    return messages.find(msg => msg.id === id) || null
  }
  /**
   * UPDATE - Edit an existing message
   * @param {string} id - Message ID
   * @param {string} newText - New message text
   * @returns {Object|null} Updated message or null
   */
  update(id, newText) {
    if(!newText || newText.trim().length ===0) {
        throw new Error('Message text cannot be empty');
    }

    const messages = this.getAll();
    const message = messages.find(msg => msg.id === id);

    if(!message) {
        console.warn(`Message with id ${id} not found`);
        return null;
    }
    // Only allow editing user messages
    if(!message.isUser) {
        throw new Error('Cannot edit bot messages');
    }

    message.text = newText.trim();
    message.edited = true;
    message.editedAt = Date.now();

    this._save(messages);
    this._notifyObservers();

    return message;

  }
  /**
   * DELETE - Remove a message by ID
   * @param {string} id - Message ID
   * @returns {boolean} True if deleted, false if not found
   */
  delete(id) {
    const messages = this.getAll();
    const initialLength = messages.length;
    const filtered = messages.filter(msg => msg.id !== id);

    if (filtered.length === initialLength) {
        console.warn(`Message with id ${id} not found`);
        return false;
    }

    this._save(filtered);
    this._notifyObservers();

    return true;
  }
  /**
   * DELETE - Clear all messages
   * @returns {boolean} Always true
   */
  clear() {
    this._save([]);
    this._notifyObservers();
    return true;
  }
  /**
   * Get statistics about messages
   * @returns {Object} Stats object
   */
  getStats () {
    const messages = this.getAll();
    const userMessages = messages.filter(m => m.isUser);
    const botMessages = messages.filter(m => m.isUser === false);
    const editedMessages = messages.filter( m =>m.edited);

    return {
      total: messages.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      editedMessages: editedMessages.length,
      lastMessageTime: messages.length > 0 
        ? messages[messages.length - 1].timestamp 
        : null
    };
  }
  /**
   * Export chat history as JSON string
   * @returns {string} JSON string
   */
  exportToJSON() {
    const messages = this.getAll();
    return JSON.stringify({
        exported: new Date().toISOString(),
        messageCount: messages.length,
        messages: messages
    }, null, 2);

  }
  /**
   * Import chat history from JSON
   * @param {string} jsonString - JSON string to import
   * @returns {boolean} True if successful
   */
  importFromJSON (jsonString) {
    try {
        const data = JSON.parse(jsonString);

        //Validate structure
        if (!data.messages || !Array.isArray(data.messages)) {
            throw new Error ('Invalid import format: missing messages array');
        }

        // Validate each messages has required fields
        const validMessages = data.messages.filter(msgg => {
            return msg.id && msg.text && typeof msg.isUser === 'boolean' && msg.timestamp;
        });
        if(validMessages.legnth !== data.messages.length) {
            console.warn('Some messages were invalid and skipped');
        }

        this._save(validMessages);
        this._notifyObservers();

        return true;

    } catch (error) {
        console.error('Error importing chat:', error);
        throw new Error('Failed to import chat: ' + error.message);
    }
  }

}