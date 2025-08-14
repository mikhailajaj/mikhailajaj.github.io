# Keyboard Navigation Guidelines

Ensuring all interactive elements and functionality within the Mikhail Ajaj Portfolio are accessible and operable via keyboard is crucial for users who cannot use a mouse, including those with motor disabilities and screen reader users.

## Core Requirements (WCAG 2.1.1, 2.1.2, 2.4.7)

1.  **All Functionality Available**: Every action that can be performed with a mouse must also be achievable using only the keyboard. This includes navigating, activating controls (buttons, links, form elements), expanding/collapsing sections, etc.
2.  **No Keyboard Trap**: Users must be able to navigate *away* from any element they can navigate *to* using the keyboard. Focus should not get stuck within a component (e.g., a modal dialog or complex widget).
3.  **Visible Focus Indicator**: It must be clear which element currently has keyboard focus. Browsers provide default focus indicators, but these should be enhanced for better visibility if necessary, ensuring they meet color contrast requirements against the background. Avoid removing outlines (`outline: none;`) without providing a clear alternative focus style.
4.  **Logical Focus Order**: The order in which elements receive focus when tabbing through the page should be logical and predictable, typically following the visual reading order (left-to-right, top-to-bottom in English).

## Implementation Best Practices

*   **Use Semantic HTML**: Native HTML elements like `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>` are keyboard accessible by default. Prefer these over generic `<div>` or `<span>` elements with added click handlers.
*   **`tabindex` Attribute**:
    *   Use `tabindex="0"` to make non-interactive elements (that have become interactive via JavaScript, like custom controls built with `div`s) focusable and include them in the natural tab order.
    *   Use `tabindex="-1"` to make elements programmatically focusable (using `element.focus()`) but *not* part of the natural tab order. Useful for managing focus within complex widgets or moving focus after an action (e.g., to an error message or a newly opened modal).
    *   **Avoid positive `tabindex` values** (e.g., `tabindex="1"`, `tabindex="2"`). These disrupt the natural focus order and create maintenance issues.
*   **Custom Widgets (ARIA)**: For complex custom components (like dropdowns, tabs, sliders, modals) that don't have native HTML equivalents:
    *   Use appropriate ARIA roles (e.g., `role="dialog"`, `role="tablist"`, `role="menu"`).
    *   Implement expected keyboard interaction patterns as defined by the ARIA Authoring Practices Guide (APG). For example, arrow keys for navigating within menus or tab panels, `Escape` to close dialogs.
    *   Manage focus appropriately within the widget (e.g., trapping focus within a modal dialog until it's closed).
*   **Links vs. Buttons**:
    *   Use `<a>` elements for navigation (changing the URL or view).
    *   Use `<button>` elements for actions that occur on the current page (submitting forms, opening modals, toggling UI elements).
    *   Ensure both are focusable and activatable with `Enter` (and `Space` for buttons).
*   **Skip Links**: Provide a "Skip to main content" link at the beginning of the page for keyboard users to bypass repetitive navigation blocks.

## Testing Keyboard Navigation

*   **Tab Key**: Navigate forward through all interactive elements. Check if the focus order is logical.
*   **Shift + Tab**: Navigate backward. Ensure it mirrors the forward order.
*   **Enter Key**: Activate links and buttons.
*   **Space Key**: Activate buttons, checkboxes, radio buttons. Select options in `<select>` dropdowns.
*   **Arrow Keys**: Navigate within components like radio groups, menus, sliders, tab panels, etc., according to expected patterns.
*   **Escape Key**: Dismiss modals, menus, or tooltips.
*   **Focus Visibility**: Ensure the focus indicator is always visible and clear.
*   **Keyboard Traps**: Verify you can tab into *and* out of all components, including modals and complex widgets.

## Resources

- [WCAG - Keyboard Accessible (Guideline 2.1)](https://www.w3.org/WAI/WCAG21/Understanding/keyboard-accessible.html)
- [WebAIM - Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [MDN - Keyboard-navigable JavaScript widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) - Provides patterns for keyboard interaction in common widgets.