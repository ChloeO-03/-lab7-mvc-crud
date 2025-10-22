/**
 * ChatController - Coordinates between Model and View
 * Responsibilities: Handle user actions, update Model, refresh View
 * NO direct DOM manipulation, NO direct data storage
 */

import ChatModel from "./model.js";
import ChatView from "./view.js";
import { getBotResponse } from "./eliza.js";

class ChatController {
    constructor () {
        this.model = new ChatModel('eliza-chat-messages');
        this.view = new ChatView();

        this._initialize();
    }
    /**
   * Initialize the application
   * @private
   */
  _initialize() {
    this.view.onMessageSubmit = this.handleSendMessage.bind(this);
    this.view.onMessageEdit = this.handleEditMessage.bind(this);
    this.view.onMessageDelete = this.handleDeleteMessage.bind(this);
    this.visew.onClearAll = this.handleClearAll.bind(this);
    this.view.onExport = this.handleExport.bind(this);
    this.view.onImport = this.handleImport.bind(this);
    this.view.onCancelEdit = this.handleCancelEdit.bind(this);

    //Set up view event listeners
    this.view.bindEvents;

    //Subscribe to Model cnages (Observer pattern)
    this.model.subscribe((messages) => {
        this.view.renderMessages(messages);
    });

    //Initial render
    this._loadInitialMessages();

    console.log('ChatController initialized');
  }
  /**
   * Load and display initial messages
   * @private
   */

  _loadInitialMessages() {
    try {
        this.view.showLoading();
        const messages = this.model.getAll();
        this.view.renderMessages(messages);
    } catch (error) {
        console.error('Error loading messages:', error);
        this.view.showError('Failed to load messages');
    }
  }
  /**
   * Handle sending a new message
   * @param {string} text - User's message text
   */

  handleSendMessage(text) {
    try {
        // Add user message
        this.model.create(text, true);

        // Get bt response using Eliza
        const getBotResponse = getElizaResponse(text);

        // Add bot response after a short delay
        setTimeout(() => {
            this.model.create(botResponse, false);
        }, 500);

    } catch (error) {
        console.error('Error sending message: ', error);
        this.view.showError('Failed to send message');
    }
  }
  /**
   * Handle editing a message
   * @param {string} messageId - ID of message to edit
   * @param {string} newText - New message text
   */

  handleEditMessage (messageID, newText) {
    try {
        const updated = this.model.update(messageId, newText);

        if(updated) {
            this.view.showSuccess('Message updated');
        } else {
            this.view.showError('Message not found');
        }
    } catch (error) {
        console.error('Error editing message:', error);
        this.view.showError(error.message);
    }
  }
  /**
   * Handle deleting a message
   * @param {string} messageId - ID of message to delete
   */

  

}