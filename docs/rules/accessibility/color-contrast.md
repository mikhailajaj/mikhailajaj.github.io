# Color Contrast Guidelines

Sufficient color contrast between text and its background is essential for users with low vision and color blindness to perceive content easily. The Mikhail Ajaj Portfolio must adhere to WCAG 2.1 AA contrast requirements.

## WCAG 2.1 AA Requirements (Success Criterion 1.4.3)

-   **Normal Text**: Text smaller than 18pt (or 14pt bold) must have a contrast ratio of at least **4.5:1** against its background.
-   **Large Text**: Text that is 18pt or larger (or 14pt bold or larger) must have a contrast ratio of at least **3:1** against its background.
-   **UI Components & Graphical Objects (Success Criterion 1.4.11 - Non-text Contrast)**: Visual information required to identify user interface components (like input borders, button boundaries) and graphical objects (like icons, parts of charts) must have a contrast ratio of at least **3:1** against adjacent colors.
-   **Focus Indicators**: The visual focus indicator for UI components must also meet the 3:1 contrast ratio against the background.

## Exceptions

-   **Incidental**: Text or images of text that are part of an inactive UI component, purely decorative, not visible to anyone, or part of a picture containing significant other visual content, have no contrast requirement.
-   **Logotypes**: Text that is part of a logo or brand name has no minimum contrast requirement.
-   **Disabled Elements**: Text within disabled controls (e.g., `<button disabled>`) does not strictly need to meet the contrast ratio, but strive for reasonable visibility where possible.

## Implementation Best Practices

-   **Design System**: Define accessible color palettes within the project's design system (see `docs/rules/ui/color-system.md` - *to be created*) that inherently meet contrast requirements for common text/background combinations.
-   **Text on Images/Gradients**: Be cautious when placing text over images or gradients. Ensure sufficient contrast across the entire text area, potentially by adding a solid background overlay behind the text or using text shadows/outlines carefully.
-   **States**: Ensure contrast requirements are met for different component states (e.g., hover, focus, active, selected). Focus indicators are particularly important.
-   **Icons & Graphics**: Ensure meaningful icons and graphical elements meet the 3:1 non-text contrast ratio.
-   **Don't Rely Solely on Color**: Do not use color alone to convey information (e.g., error states, required fields). Provide additional visual cues (icons, text labels, underlines).

## Tools for Checking Contrast

Use tools to verify contrast ratios during design and development:

-   **Browser DevTools**: Most modern browsers have built-in color pickers that show contrast ratios.
-   **WebAIM Contrast Checker**: [https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/)
-   **TPGi Colour Contrast Analyser (CCA)**: Desktop application for Windows and macOS.
-   **Figma Plugins**: Various plugins available (e.g., Stark, A11y - Color Contrast Checker).
-   **Automated Testing Tools**: Tools like Axe DevTools can flag contrast issues in code.

## Testing

-   Regularly check color combinations using the tools listed above.
-   Test in different lighting conditions if possible.
-   Consider testing with users who have low vision or color blindness.

## Resources

- [WCAG Success Criterion 1.4.3 - Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WCAG Success Criterion 1.4.11 - Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [WebAIM - Contrast and Color Accessibility](https://webaim.org/articles/contrast/)