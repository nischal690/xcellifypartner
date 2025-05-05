import { makeAutoObservable } from 'mobx';

class MessageStore {
  messages = [
    {
      id: 1,
      sender: 'John Smith',
      content: 'I have a question about your product pricing',
      timestamp: new Date('2025-05-04T10:30:00'),
      read: false
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      content: 'When will my order be shipped?',
      timestamp: new Date('2025-05-04T14:15:00'),
      read: false
    },
    {
      id: 3,
      sender: 'Michael Brown',
      content: 'Is this product available in blue color?',
      timestamp: new Date('2025-05-03T09:45:00'),
      read: true
    },
    {
      id: 4,
      sender: 'Emily Davis',
      content: 'Can you provide more details about the warranty?',
      timestamp: new Date('2025-05-02T16:20:00'),
      read: true
    },
    {
      id: 5,
      sender: 'Robert Wilson',
      content: 'I need help with installation instructions',
      timestamp: new Date('2025-05-01T11:05:00'),
      read: true
    }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  get unreadCount() {
    return this.messages.filter(message => !message.read).length;
  }

  get allMessages() {
    // Sort messages by timestamp (newest first)
    return [...this.messages].sort((a, b) => b.timestamp - a.timestamp);
  }

  markAsRead(messageId) {
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.read = true;
    }
  }

  markAllAsRead() {
    this.messages.forEach(message => {
      message.read = true;
    });
  }

  addMessage(message) {
    this.messages.push({
      id: this.messages.length + 1,
      ...message,
      timestamp: new Date(),
      read: false
    });
  }

  deleteMessage(messageId) {
    this.messages = this.messages.filter(msg => msg.id !== messageId);
  }
}

export default MessageStore;
