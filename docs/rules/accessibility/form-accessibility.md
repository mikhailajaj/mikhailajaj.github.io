# Form Accessibility Guidelines

Forms are critical interaction points in the Mikhail Ajaj Portfolio. Ensuring they are accessible is vital for all users, especially those using assistive technologies like screen readers or keyboard navigation.

## Core Requirements

-   **Labels**: Every form control (`<input>`, `<textarea>`, `<select>`) must have a clearly associated label.
-   **Instructions**: Provide clear instructions for complex inputs or formatting requirements.
-   **Grouping**: Group related controls logically (e.g., address fields, radio button sets).
-   **Required Fields**: Clearly indicate which fields are required.
-   **Error Handling**: Provide clear, accessible error messages when validation fails, and help users correct mistakes.
-   **Keyboard Navigation**: All form controls must be navigable and operable using the keyboard. (See [keyboard-navigation.md](./keyboard-navigation.md))
-   **Screen Reader Compatibility**: Forms must be understandable and operable with screen readers. (See [screen-readers.md](./screen-readers.md))

## Implementation Best Practices

*   **Labels (`<label>`)**:
    *   Use the `<label>` element and associate it with its control using the `for` attribute matching the control's `id`. Example: `<label for="user-email">Email:</label> <input type="email" id="user-email">`.
    *   Avoid using `placeholder` attributes as replacements for labels; placeholders disappear on input and are not consistently announced by all screen readers.
    *   If a visible label is not desired for design reasons, use `aria-label` on the control or visually hidden text within the `<label>`.
*   **Instructions**:
    *   Provide instructions before the relevant input(s).
    *   For specific input formatting (e.g., date format), provide instructions clearly associated with the input, potentially using `aria-describedby`. Example: `<input type="text" id="dob" aria-describedby="dob-format"> <span id="dob-format">Format: YYYY-MM-DD</span>`.
*   **Grouping (`<fieldset>`, `<legend>`)**:
    *   Use `<fieldset>` to group related controls (e.g., radio buttons for a single question, checkbox group, address fields).
    *   Use `<legend>` as the first child of `<fieldset>` to provide a caption for the group. The `<legend>` acts as the label for the entire group.
*   **Required Fields**:
    *   Indicate required fields visually (e.g., with an asterisk `*`) and programmatically.
    *   Include text near the beginning of the form explaining the meaning of the visual indicator (e.g., "* Required fields").
    *   Use the `required` attribute on the input element itself.
    *   Use `aria-required="true"` on the input element for explicit screen reader announcement.
*   **Error Handling**:
    *   **Identification**: Clearly identify which fields have errors (e.g., changing border color, adding an icon). Do not rely on color alone.
    *   **Description**: Provide clear, specific error messages in text.
    *   **Association**: Programmatically associate the error message with the invalid input using `aria-describedby` or `aria-errormessage`. Example: `<input type="email" id="user-email" aria-invalid="true" aria-describedby="email-error"> <span id="email-error" role="alert">Please enter a valid email address.</span>`.
    *   **Focus Management**: Consider moving focus programmatically to the first field with an error upon submission failure.
    *   **Summary (Optional)**: For long forms, consider providing a summary of errors at the top of the form, with links to the respective fields.
    *   **Live Regions**: Use ARIA live regions (`role="alert"` or `aria-live`) to announce errors dynamically, especially for client-side validation.
*   **Buttons**: Use clear and descriptive text for submit buttons (e.g., "Submit Request", "Save Changes" instead of just "Submit").

## Testing Form Accessibility

*   **Keyboard**: Can you navigate to and operate every form control using only the keyboard (Tab, Shift+Tab, Space, Enter, Arrow Keys)?
*   **Screen Reader**:
    *   Are labels announced correctly for each control?
    *   Are field groups (`<fieldset>`) and their legends announced?
    *   Are required fields indicated?
    *   Are instructions (`aria-describedby`) announced?
    *   Are error messages announced clearly and associated with the correct input when validation fails?
*   **Visual Check**: Are labels visually associated with controls? Are required fields visually indicated? Are error states clear without relying solely on color?

## Resources

- [WAI Tutorials - Forms Concepts](https://www.w3.org/WAI/tutorials/forms/)
- [WebAIM - Creating Accessible Forms](https://webaim.org/techniques/forms/)
- [MDN - Accessible Forms](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Forms)
- [WCAG Success Criterion 3.3.1 - Error Identification](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)
- [WCAG Success Criterion 3.3.2 - Labels or Instructions](https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html)
