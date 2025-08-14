# WCAG Compliance Guidelines

This document outlines the guidelines for ensuring the Mikhail Ajaj Portfolio meets the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.

## Target Level: WCAG 2.1 AA

All new features and components developed for the Mikhail Ajaj Portfolio must strive to meet WCAG 2.1 Level AA conformance. This ensures a high level of accessibility for users with various disabilities.

## Key Principles (POUR)

WCAG is organized around four main principles (POUR):

1.  **Perceivable**:
    *   Provide text alternatives for non-text content (e.g., `alt` text for images).
    *   Provide captions and other alternatives for multimedia.
    *   Create content that can be presented in different ways (e.g., simpler layout) without losing information or structure.
    *   Make it easier for users to see and hear content including separating foreground from background (e.g., sufficient color contrast).

2.  **Operable**:
    *   Make all functionality available from a keyboard.
    *   Give users enough time to read and use content.
    *   Do not design content in a way that is known to cause seizures (e.g., flashing content).
    *   Provide ways to help users navigate, find content, and determine where they are (e.g., clear headings, focus indicators).

3.  **Understandable**:
    *   Make text content readable and understandable (e.g., specify page language).
    *   Make web pages appear and operate in predictable ways.
    *   Help users avoid and correct mistakes (e.g., clear error messages, input assistance).

4.  **Robust**:
    *   Maximize compatibility with current and future user agents, including assistive technologies (e.g., use valid HTML, ARIA attributes correctly).

## Specific AA Requirements Checklist (Examples)

This is not an exhaustive list, but highlights common AA requirements relevant to our application:

*   **Color Contrast (1.4.3)**: Ensure a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. (See [color-contrast.md](./color-contrast.md))
*   **Keyboard (2.1.1)**: All functionality must be operable through a keyboard interface without requiring specific timings. (See [keyboard-navigation.md](./keyboard-navigation.md))
*   **No Keyboard Trap (2.1.2)**: If keyboard focus can be moved to a component, it must be possible to move focus away using only the keyboard.
*   **Headings and Labels (2.4.6)**: Headings and labels describe topic or purpose. Use semantic HTML (`<h1>`-`<h6>`, `<label>`).
*   **Focus Visible (2.4.7)**: Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.
*   **Language of Page (3.1.1)**: The default human language of each Web page can be programmatically determined (e.g., `<html lang="en">`).
*   **Error Identification (3.3.1)**: If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.
*   **Labels or Instructions (3.3.2)**: Labels or instructions are provided when content requires user input. (See [form-accessibility.md](./form-accessibility.md))
*   **Parsing (4.1.1)**: Content implemented using markup languages has complete start and end tags, elements are nested according to their specifications, elements do not contain duplicate attributes, and any IDs are unique.
*   **Name, Role, Value (4.1.2)**: For all user interface components, the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set; and notification of changes is available to assistive technologies. (Use ARIA where necessary).

## Tools & Testing

*   **Automated Tools**: Use tools like Axe DevTools, Lighthouse, WAVE.
*   **Manual Testing**: Perform keyboard-only navigation testing, screen reader testing (NVDA, VoiceOver, JAWS).
*   **User Testing**: Involve users with disabilities in testing where possible.

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [How to Meet WCAG (Quick Reference)](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM WCAG 2 Checklist](https://webaim.org/standards/wcag/checklist)
