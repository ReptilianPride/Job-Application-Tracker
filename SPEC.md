# Job Application Tracker - Specification

## 1. Project Overview
- **Project Name**: Job Application Tracker
- **Type**: Desktop GUI Application (Electron)
- **Core Functionality**: Log and manage job descriptions for companies the user is applying to, with insertion and retrieval capabilities
- **Target Users**: Job seekers tracking their applications

## 2. UI/UX Specification

### 2.1 Layout Structure
- **Window**: Single main window (1200x800 default, min 900x600)
- **Components**:
  - Tab control at top with 2 tabs: "Insert Job" and "Job List"
  - Tab content area below tabs

### 2.2 Visual Design

#### Color Palette
- **Primary**: #2563eb (Blue - buttons, active tabs)
- **Secondary**: #1e293b (Dark slate - headers)
- **Accent**: #10b981 (Green - success states)
- **Background**: #f8fafc (Light gray - main background)
- **Surface**: #ffffff (White - cards/panels)
- **Text Primary**: #1e293b (Dark)
- **Text Secondary**: #64748b (Gray)
- **Border**: #e2e8f0 (Light border)

#### Typography
- **Font Family**: "Segoe UI", system-ui, sans-serif
- **Headings**:
  - Tab titles: 16px, font-weight 600
  - Section headers: 14px, font-weight 600
- **Body**: 14px, font-weight 400
- **Labels**: 13px, font-weight 500
- **Input text**: 14px

#### Spacing
- **Base unit**: 8px
- **Padding**: 16px (containers), 12px (inputs)
- **Gap**: 12px (between form fields)
- **Border radius**: 6px (inputs, buttons), 8px (panels)

#### Visual Effects
- **Box shadow**: 0 1px 3px rgba(0,0,0,0.1) for cards
- **Focus ring**: 2px solid #2563eb with 2px offset
- **Transition**: 150ms ease for hover states

### 2.3 Components

#### Tab 1 - Insert Job Form
- **Fields**:
  1. Company Name: Text input (required)
  2. Job Title: Text input (required)
  3. Job Description: Textarea (rows: 4, resizeable vertically)
  4. Notes: Textarea (rows: 3, resizeable vertically)
  5. Date: Read-only input showing current date (auto-filled)
- **Save Button**: Primary blue button, text "Save Job"
- **Clear Button**: Secondary outlined button, text "Clear"

#### Tab 2 - Job List
- **Search Bar**: Text input with placeholder "Search by company name..."
- **Table**: Scrollable with columns:
  - Company Name
  - Job Title
  - Date Applied
  - Actions (Edit/Delete icons)
- **Table rows**: Double-click to edit cells inline
- **Empty state**: Message "No jobs found. Add your first job in the Insert tab."

### 2.4 Component States
- **Buttons**:
  - Default: bg #2563eb, text white
  - Hover: bg #1d4ed8
  - Active: bg #1e40af
  - Disabled: bg #94a3b8, cursor not-allowed
- **Inputs**:
  - Default: border #e2e8f0
  - Focus: border #2563eb, ring
  - Error: border #ef4444
- **Table rows**:
  - Default: bg white
  - Hover: bg #f1f5f9
  - Selected: bg #dbeafe

## 3. Functional Specification

### 3.1 Core Features
1. **Add Job Entry**: Insert new job with all fields, auto-date
2. **View Job List**: Display all saved jobs in table format
3. **Search Jobs**: Filter list by company name (real-time)
4. **Edit Job**: Double-click cell to edit inline, save on Enter/blur
5. **Delete Job**: Delete button with confirmation
6. **Data Persistence**: Save to local JSON file

### 3.2 User Interactions
- **Tab switching**: Click tab to switch content
- **Form submission**: Click Save or press Ctrl+Enter
- **Search**: Type in search bar, list filters as user types
- **Inline editing**: Double-click cell → becomes input → Enter to save, Escape to cancel
- **Delete**: Click delete icon → confirm dialog → remove

### 3.3 Data Handling
- **Storage**: JSON file in app data directory
- **Data structure**:
```json
{
  "jobs": [
    {
      "id": "uuid",
      "companyName": "string",
      "jobTitle": "string",
      "jobDescription": "string",
      "notes": "string",
      "dateApplied": "YYYY-MM-DD"
    }
  ]
}
```
- **Auto-save**: On every change

### 3.4 Edge Cases
- Empty company name: Show validation error
- Empty job title: Show validation error
- No jobs: Show empty state message
- Search no results: Show "No matching jobs" message
- Large list: Scrollable table maintains performance
- Concurrent edits: Last save wins (single user app)

## 4. Acceptance Criteria

### 4.1 Success Conditions
- [ ] Application launches without errors
- [ ] Both tabs render correctly and switch properly
- [ ] Can add new job with all fields
- [ ] Date automatically filled with current date
- [ ] Job appears in list after saving
- [ ] Search filters list by company name
- [ ] Double-click enables inline editing
- [ ] Edited changes persist after restart
- [ ] Delete removes job with confirmation
- [ ] Data persists between app restarts

### 4.2 Visual Checkpoints
- [ ] Window opens at 1200x800
- [ ] Tabs clearly show active state
- [ ] Form fields have proper labels and spacing
- [ ] Table columns properly aligned
- [ ] Scrollbar appears when list exceeds viewport
- [ ] Focus states visible on all interactive elements