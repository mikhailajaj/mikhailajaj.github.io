# Screen Reader Compatibility Guidelines

Screen readers are essential assistive technologies for users who are blind or have low vision. Ensuring the Mikhail Ajaj Portfolio works effectively with screen readers is critical for accessibility. This involves using semantic HTML, ARIA attributes where necessary, and providing clear textual information.

## Core Principles

- **Semantic Structure**: Use HTML elements according to their semantic meaning (`<h1>`-`<h6>` for headings, `<nav>` for navigation, `<main>` for main content, `<button>` for buttons, etc.). Screen readers rely on this structure to convey information and allow navigation.
- **Text Equivalents**: Provide text alternatives for all non-text content (images, icons, charts) using `alt` attributes or ARIA labels.
- **Programmatic Association**: Ensure relationships between elements are programmatically defined (e.g., associating labels with form controls using `for` and `id`).
- **Dynamic Content Updates**: Announce changes in content (e.g., error messages, loading states, search results) using ARIA live regions.
- **Clear Link Text**: Link text should be descriptive on its own, avoiding generic phrases like "Click Here" or "Learn More".

## Implementation Best Practices

*   **Headings (`<h1>`-`<h6>`)**: Use headings to structure content logically. Ensure heading levels are nested correctly (don't skip levels, e.g., `<h1>` followed by `<h3>`). Screen reader users often navigate by headings.
*   **Landmarks (HTML5 & ARIA)**: Use HTML5 landmark elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`) or ARIA landmark roles (`role="banner"`, `role="navigation"`, `role="main"`, etc.) to define major page regions. This allows users to quickly jump between sections.
*   **Images (`<img>`)**:
    *   Provide descriptive `alt` text for informative images.
    *   Use an empty `alt=""` for purely decorative images so screen readers ignore them.
    *   For complex images like charts or graphs, provide a longer description nearby or via `aria-describedby`.
*   **Links (`<a>`)**:
    *   Link text should clearly indicate the destination or purpose of the link when read out of context.
    *   If a link opens in a new tab/window, indicate this visually and programmatically (e.g., `aria-label="Project Details (opens in new window)"`).
*   **Buttons (`<button>`)**:
    *   Button text should clearly describe the action performed.
    *   For icon-only buttons, provide a text alternative using `aria-label` or visually hidden text.
*   **Forms (`<form>`, `<input>`, `<label>`, etc.)**:
    *   Explicitly associate labels with their form controls using `<label for="inputId">` and `id="inputId"`.
    *   Use `<fieldset>` and `<legend>` to group related controls (e.g., radio buttons, checkboxes).
    *   Provide clear instructions and indicate required fields (e.g., using `aria-required="true"`).
    *   Announce validation errors clearly and associate them with the relevant input using `aria-describedby` or `aria-errormessage`. (See [form-accessibility.md](./form-accessibility.md))
*   **ARIA (Accessible Rich Internet Applications)**:
    *   Use ARIA attributes sparingly and correctly, primarily when semantic HTML is insufficient (e.g., for custom widgets).
    *   **`aria-label` / `aria-labelledby`**: Provide accessible names for elements when visible text labels are absent or insufficient.
    *   **`aria-describedby`**: Associate descriptive text with an element (e.g., explaining input format).
    *   **`aria-hidden="true"`**: Hide elements from assistive technologies (use with caution, e.g., for purely visual elements or off-screen content).
    *   **ARIA Roles**: Define the purpose of custom widgets (e.g., `role="tab"`, `role="dialog"`).
    *   **ARIA States & Properties**: Indicate the state of interactive elements (e.g., `aria-expanded`, `aria-selected`, `aria-current`, `aria-disabled`).
*   **Live Regions (`aria-live`, `aria-atomic`, `aria-relevant`)**: Use ARIA live regions to announce dynamic content updates (e.g., notifications, status messages, search results) without shifting focus.
    *   `aria-live="polite"`: Announce updates when the user is idle (most common).
    *   `aria-live="assertive"`: Announce updates immediately (use for critical errors or alerts).

## Testing with Screen Readers

*   Test using common screen readers:
    *   **NVDA** (Windows - Free)
    *   **JAWS** (Windows - Paid)
    *   **VoiceOver** (macOS/iOS - Built-in)
    *   **TalkBack** (Android - Built-in)
*   Navigate using common screen reader commands (e.g., navigating by headings, links, forms, landmarks).
*   Listen to how content is announced. Is it clear? Is the structure logical? Are interactive elements properly identified? Are dynamic updates announced?
*   Perform common tasks using only the screen reader and keyboard.

## Resources

- [WebAIM - Designing for Screen Reader Compatibility](https://webaim.org/techniques/screenreader/)
- [MDN - ARIA Basics](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques)
- [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/)
- [Deque University - Screen Reader Keyboard Shortcuts and Gestures](https://dequeuniversity.com/screenreaders/)