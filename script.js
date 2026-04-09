// Header Component - Real-time clock and greeting
class HeaderComponent {
    constructor() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.dateDisplay = document.getElementById('dateDisplay');
        this.greeting = document.getElementById('greeting');
        this.init();
    }

    init() {
        this.updateTime();
        // Update time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const now = new Date();
        
        // Format time as HH:MM:SS
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Format date as "Day, Month DD, YYYY"
        const dateString = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update displays
        this.timeDisplay.textContent = timeString;
        this.dateDisplay.textContent = dateString;
        this.greeting.textContent = this.getGreeting(now.getHours());
    }

    getGreeting(hour) {
        if (hour < 12) {
            return 'Good Morning';
        } else if (hour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    }
}

// Focus Timer Component
class FocusTimer {
    constructor() {
        this.timerDisplay = document.getElementById('timerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Timer state
        this.defaultTime = 25 * 60; // 25 minutes in seconds
        this.currentTime = this.defaultTime;
        this.isRunning = false;
        this.intervalId = null;
        
        this.init();
    }

    init() {
        this.updateDisplay();
        this.bindEvents();
        this.handleVisibilityChange();
        // Set initial button states
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    handleVisibilityChange() {
        // Handle browser tab visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning) {
                // Tab is hidden, timer continues running
                console.log('Timer continues in background');
            } else if (!document.hidden && this.isRunning) {
                // Tab is visible again, ensure timer is still running
                if (!this.intervalId) {
                    this.start();
                }
            }
        });
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                this.tick();
            }, 1000);
            
            // Update button states
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            
            // Update button states
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
        }
    }

    reset() {
        this.stop();
        this.currentTime = this.defaultTime;
        this.updateDisplay();
        
        // Reset button states
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
    }

    tick() {
        if (this.currentTime > 0) {
            this.currentTime--;
            this.updateDisplay();
        } else {
            // Timer completed
            this.stop();
            this.onTimerComplete();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timerDisplay.textContent = displayTime;
    }

    onTimerComplete() {
        alert('Focus session complete! Time for a break.');
        this.reset();
    }

    // Cleanup method for proper resource management
    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Tasks Component
class TasksComponent {
    constructor() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        
        // Tasks state
        this.tasks = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTasks();
        this.renderTasks();
    }

    bindEvents() {
        // Add task button click
        this.addTaskBtn.addEventListener('click', () => this.handleAddTask());
        
        // Enter key in input field
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddTask();
            }
        });
    }

    handleAddTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText.length > 0 && taskText.length <= 500) {
            this.addTask(taskText);
            this.taskInput.value = ''; // Clear input field
        } else if (taskText.length > 500) {
            alert('Task text is too long. Please keep it under 500 characters.');
        }
    }

    addTask(taskText) {
        const task = {
            id: this.generateId(),
            text: taskText,
            createdAt: new Date()
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
            return;
        }

        const tasksHtml = this.tasks.map(task => `
            <div class="task-item" data-task-id="${task.id}">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="btn btn-delete" onclick="tasksComponent.deleteTask('${task.id}')">Delete</button>
            </div>
        `).join('');

        this.taskList.innerHTML = tasksHtml;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTasks() {
        try {
            localStorage.setItem('dashboard-tasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Failed to save tasks:', error);
        }
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('dashboard-tasks');
            if (savedTasks) {
                this.tasks = JSON.parse(savedTasks);
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
            this.tasks = [];
        }
    }
}

// Quick Links Component
class QuickLinksComponent {
    constructor() {
        this.linkNameInput = document.getElementById('linkName');
        this.linkUrlInput = document.getElementById('linkUrl');
        this.addLinkBtn = document.getElementById('addLinkBtn');
        this.customLinksContainer = document.getElementById('customLinks');
        this.presetButtons = document.querySelectorAll('.btn-preset');
        
        // Links state
        this.customLinks = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadLinks();
        this.renderCustomLinks();
    }

    bindEvents() {
        // Add custom link button
        this.addLinkBtn.addEventListener('click', () => this.handleAddLink());
        
        // Enter key in input fields
        this.linkNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddLink();
            }
        });
        
        this.linkUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddLink();
            }
        });
        
        // Preset buttons
        this.presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const url = button.getAttribute('data-url');
                this.openLink(url);
            });
        });
    }

    handleAddLink() {
        const name = this.linkNameInput.value.trim();
        const url = this.linkUrlInput.value.trim();
        
        if (name.length > 0 && url.length > 0) {
            if (this.isValidUrl(url)) {
                this.addCustomLink(name, url);
                this.linkNameInput.value = '';
                this.linkUrlInput.value = '';
            } else {
                alert('Please enter a valid URL (e.g., https://example.com)');
            }
        } else {
            alert('Please fill in both link name and URL');
        }
    }

    addCustomLink(name, url) {
        const link = {
            id: this.generateId(),
            name: name,
            url: this.formatUrl(url),
            isCustom: true
        };
        
        this.customLinks.push(link);
        this.saveLinks();
        this.renderCustomLinks();
    }

    deleteCustomLink(linkId) {
        this.customLinks = this.customLinks.filter(link => link.id !== linkId);
        this.saveLinks();
        this.renderCustomLinks();
    }

    openLink(url) {
        window.open(url, '_blank');
    }

    isValidUrl(string) {
        try {
            // Add protocol if missing
            const url = string.startsWith('http://') || string.startsWith('https://') 
                ? string 
                : 'https://' + string;
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    formatUrl(url) {
        // Add https:// if no protocol is specified
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return 'https://' + url;
        }
        return url;
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    renderCustomLinks() {
        if (this.customLinks.length === 0) {
            this.customLinksContainer.innerHTML = '';
            return;
        }

        const linksHtml = this.customLinks.map(link => `
            <div class="custom-link-item">
                <a href="${link.url}" target="_blank" class="custom-link">${this.escapeHtml(link.name)}</a>
                <button class="btn btn-delete" onclick="quickLinksComponent.deleteCustomLink('${link.id}')">×</button>
            </div>
        `).join('');

        this.customLinksContainer.innerHTML = linksHtml;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveLinks() {
        try {
            localStorage.setItem('dashboard-links', JSON.stringify(this.customLinks));
        } catch (error) {
            console.error('Failed to save links:', error);
        }
    }

    loadLinks() {
        try {
            const savedLinks = localStorage.getItem('dashboard-links');
            if (savedLinks) {
                this.customLinks = JSON.parse(savedLinks);
            }
        } catch (error) {
            console.error('Failed to load links:', error);
            this.customLinks = [];
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Header Component
    new HeaderComponent();
    
    // Initialize Focus Timer Component
    new FocusTimer();
    
    // Initialize Tasks Component
    window.tasksComponent = new TasksComponent();
    
    // Initialize Quick Links Component
    window.quickLinksComponent = new QuickLinksComponent();
});