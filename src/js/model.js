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
    
}