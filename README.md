# Student Finance Tracker

A responsive web app that allows users to track income and expenses in the browser. Built for the ALU course “Building Responsive Interfaces.”

## Chosen Theme
Smart Finance Management  
Focuses on helping users manage money through a simple, clear, and accessible interface.

## Features
- Add, edit, and delete transactions  
- Data stored in localStorage  
- Search by text or regular expressions  
- Regex validation for date, amount, and description  
- Responsive on all devices  
- Keyboard and screen-reader accessible  
- Displays financial summaries

## Regex Catalog

| Purpose | Pattern | Example | Description |
|----------|----------|----------|-------------|
| Date | `/^\d{4}-\d{2}-\d{2}$/` | `2025-10-16` | Checks for YYYY-MM-DD format |
| Amount | `/^\d+(\.\d{1,2})?$/` | `120.50` | Accepts integers or decimals |
| Description | `/^[A-Za-z0-9\s,.'-]{3,50}$/` | `Bus fare` | Allows 3–50 character text |
| Search | `/\b(term)\b/i` | `rent` | Finds a word regardless of case |

## Keyboard Map

| Key | Action |
|------|--------|
| Tab | Move between elements |
| Enter | Submit forms |
| Escape | Cancel or close |
| Ctrl + F | Focus on search field |
| Alt + N | Jump to new record form |

## Accessibility Notes
- Semantic HTML (header, main, section, footer)  
- ARIA labels and live regions used  
- Skip to main content link included  
- Clear focus outlines  
- Meets color contrast standards  
- Works with screen readers  

## How to Run Tests
1. Open `index.html` in a browser.  
2. Add, edit, and delete records to verify functions.  
3. Reload to check data persistence.  
4. Use the search bar with regex patterns.  
5. Resize the window to test responsiveness.  
6. Navigate using only the keyboard.  

**Validation:**  
- Use W3C HTML and CSS Validators.  
- Run Lighthouse accessibility audit.  
- Check console for JavaScript errors.  

**Regex Tests (in console):**
```js
validateDate("2025-10-16");  
validateAmount("45.00");  
validateText("Lunch"); 
