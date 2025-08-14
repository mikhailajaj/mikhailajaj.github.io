# Security Guidelines

Security is paramount for any web application, especially one handling user data and business logic like Mikhail Ajaj Portfolio. This section outlines fundamental security principles and best practices to follow during development.

## Core Principles

-   **Defense in Depth**: Implement security measures at multiple layers (client-side, server-side, infrastructure).
-   **Least Privilege**: Grant users and system components only the minimum permissions necessary to perform their functions.
-   **Secure Defaults**: Configure systems and components with security in mind from the start.
-   **Input Validation**: Never trust user input. Validate and sanitize all data received from clients or external sources.
-   **Secure Dependencies**: Keep dependencies updated and be aware of vulnerabilities in third-party libraries.
-   **Protect Sensitive Data**: Handle sensitive information (passwords, API keys, personal data) securely, both in transit (HTTPS) and at rest (encryption).
-   **Regular Audits & Updates**: Periodically review security practices and keep software up-to-date with security patches.

## Key Areas

This section covers common web security vulnerabilities and best practices:

-   **[Authentication](./authentication.md)**: Verifying user identity securely.
-   **[Authorization](./authorization.md)**: Ensuring users can only access resources and perform actions they are permitted to.
-   **[Data Validation](./data-validation.md)**: Preventing attacks stemming from malicious user input (e.g., injection attacks).
-   **[Cross-Site Scripting (XSS) Prevention](./xss-prevention.md)**: Protecting against injection of malicious client-side scripts.
-   **[Cross-Site Request Forgery (CSRF) Prevention](./csrf-prevention.md)**: Preventing attackers from tricking users into performing unwanted actions.
-   **(Future)** Dependency Management: Keeping libraries up-to-date.
-   **(Future)** Secrets Management: Handling API keys and credentials securely.
-   **(Future)** Rate Limiting & Brute Force Protection.

Refer to the specific documents linked above for detailed rules and implementation guidance. Security is an ongoing process, and these guidelines should be reviewed and updated regularly.