# Design Document

## Overview

Dashboard produktivitas berbasis web yang menggabungkan empat komponen utama: header dengan waktu real-time, focus timer, task manager, dan quick links manager. Aplikasi akan dibangun menggunakan HTML, CSS, dan JavaScript vanilla untuk kesederhanaan dan performa optimal.

## Architecture

### Frontend Architecture
- **Single Page Application (SPA)** menggunakan HTML, CSS, dan JavaScript vanilla
- **Component-based structure** dengan setiap widget sebagai modul terpisah
- **Local Storage** untuk persistensi data tasks dan custom links
- **Real-time updates** menggunakan JavaScript intervals

### Layout Structure
```
Dashboard Container
├── Header Component (Time & Greeting)
├── Main Content Grid
│   ├── Focus Timer Component
│   ├── Tasks Component
│   └── Quick Links Component
```

## Components and Interfaces

### 1. Header Component
**Purpose:** Menampilkan waktu real-time dan greeting

**Interface:**
```javascript
class HeaderComponent {
  constructor(container)
  updateTime()
  getGreeting()
  render()
}
```

**Functionality:**
- Update waktu setiap detik menggunakan `setInterval`
- Menentukan greeting berdasarkan jam (Good Morning, Good Afternoon, Good Evening)
- Format waktu: HH:MM:SS
- Format tanggal: Day, Month DD, YYYY

### 2. Focus Timer Component
**Purpose:** Timer pomodoro untuk sesi fokus

**Interface:**
```javascript
class FocusTimer {
  constructor(container)
  start()
  stop()
  reset()
  updateDisplay()
  onTimerComplete()
}
```

**State Management:**
- `currentTime`: waktu saat ini dalam detik
- `isRunning`: status timer
- `intervalId`: reference untuk interval

**Functionality:**
- Default timer: 25 menit (1500 detik)
- Countdown dengan update setiap detik
- Notifikasi ketika timer selesai
- Kontrol start/stop/reset

### 3. Tasks Component
**Purpose:** Manajemen daftar tugas

**Interface:**
```javascript
class TasksComponent {
  constructor(container)
  addTask(taskText)
  deleteTask(taskId)
  renderTasks()
  saveTasks()
  loadTasks()
}
```

**Data Structure:**
```javascript
{
  id: string,
  text: string,
  createdAt: Date
}
```

**Functionality:**
- Input field dengan placeholder "Add a new task..."
- Add task dengan button click atau Enter key
- Delete individual tasks
- Persist tasks di localStorage
- Auto-clear input setelah add

### 4. Quick Links Component
**Purpose:** Manajemen link cepat

**Interface:**
```javascript
class QuickLinksComponent {
  constructor(container)
  addCustomLink(name, url)
  openLink(url)
  renderLinks()
  saveLinks()
  loadLinks()
}
```

**Preset Links:**
- Google: https://google.com
- Gmail: https://gmail.com  
- Calendar: https://calendar.google.com

**Functionality:**
- Form untuk menambah custom links
- Validasi URL format
- Open links di tab baru
- Persist custom links di localStorage

## Data Models

### Task Model
```javascript
{
  id: string,           // unique identifier
  text: string,         // task description
  createdAt: Date       // creation timestamp
}
```

### Link Model
```javascript
{
  id: string,           // unique identifier
  name: string,         // display name
  url: string,          // target URL
  isCustom: boolean     // true for user-added links
}
```

### Timer State
```javascript
{
  currentTime: number,  // seconds remaining
  isRunning: boolean,   // timer status
  defaultTime: number   // reset value (1500 seconds)
}
```

## Error Handling

### Input Validation
- **Task Input:** Trim whitespace, minimum 1 character
- **URL Input:** Basic URL format validation using regex
- **Link Name:** Required field, minimum 1 character

### Storage Errors
- Graceful fallback jika localStorage tidak tersedia
- Error handling untuk JSON parse/stringify operations
- Default values jika stored data corrupt

### Timer Errors
- Cleanup intervals on component destruction
- Prevent multiple intervals running simultaneously
- Handle browser tab visibility changes

## Testing Strategy

### Unit Testing
- **Timer Logic:** Test countdown, start/stop/reset functionality
- **Task Management:** Test add/delete/persist operations
- **Link Management:** Test custom link creation and validation
- **Time Formatting:** Test time and date display functions

### Integration Testing
- **Component Interaction:** Test data flow between components
- **Storage Integration:** Test localStorage save/load operations
- **Event Handling:** Test user interactions and responses

### Manual Testing
- **Cross-browser Compatibility:** Test di Chrome, Firefox, Safari
- **Responsive Design:** Test di berbagai ukuran layar
- **User Experience:** Test workflow lengkap dari user perspective

### Visual Testing
- **Layout Consistency:** Verify card-based layout
- **Color Scheme:** Verify purple gradient background
- **Button States:** Test hover and active states
- **Typography:** Verify font sizes and readability

## Implementation Notes

### CSS Framework
- Custom CSS dengan CSS Grid dan Flexbox untuk layout
- CSS Variables untuk consistent theming
- Responsive breakpoints untuk mobile compatibility

### JavaScript Patterns
- Module pattern untuk component isolation
- Event delegation untuk efficient event handling
- Debouncing untuk input fields jika diperlukan

### Performance Considerations
- Minimal DOM manipulation
- Efficient timer implementation
- Lazy loading jika komponen bertambah kompleks
- Memory cleanup untuk intervals dan event listeners