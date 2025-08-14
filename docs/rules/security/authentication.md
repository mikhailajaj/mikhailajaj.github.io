# Authentication Guidelines

Authentication is the process of verifying the identity of a user or system. Implementing robust authentication is fundamental to securing the Mikhail Ajaj Portfolio and protecting user accounts and data.

## Current Implementation (Clerk)

The Mikhail Ajaj Portfolio project currently utilizes **Clerk** for authentication. Developers should leverage Clerk's features and adhere to its best practices.

Refer to the existing Clerk setup documentation:
-   `docs/auth/clerk-setup.md`
-   `docs/guides/auth-implementation.md` (May contain relevant details)

## General Authentication Principles (Applicable even with Clerk)

1.  **Use Strong Password Policies**: Enforce minimum length, complexity (mix of character types), and potentially check against breached password lists (Clerk often handles this). Discourage password reuse.
2.  **Secure Password Storage**: Passwords must **never** be stored in plaintext. Use strong, adaptive hashing algorithms with unique salts per user (e.g., bcrypt, Argon2). **Clerk handles this securely.**
3.  **Multi-Factor Authentication (MFA/2FA)**: Strongly encourage or require MFA for enhanced security. Support various methods like TOTP (Authenticator Apps), SMS, or security keys. **Clerk provides MFA options.**
4.  **Secure Session Management**:
    *   Generate cryptographically secure session identifiers.
    *   Store session identifiers securely (e.g., using HttpOnly, Secure, SameSite cookies).
    *   Implement session timeouts (both inactivity and absolute).
    *   Provide secure logout functionality that invalidates the session on the server.
    *   **Clerk manages sessions and provides secure JWTs or session tokens.** Leverage Clerk's session management capabilities.
5.  **Rate Limiting**: Implement rate limiting on login attempts, password reset requests, and account creation to prevent brute-force attacks and denial-of-service. **Clerk often includes rate limiting features.**
6.  **Secure Password Reset**:
    *   Use secure, time-limited, single-use tokens sent via a secure channel (typically email).
    *   Do not confirm whether an email address exists in the system during the reset request (to prevent user enumeration).
    *   Require the user's old password if changing the password while logged in.
    *   **Leverage Clerk's built-in password reset flows.**
7.  **Transport Layer Security (TLS/HTTPS)**: All authentication communication (login forms, token exchanges) **must** occur over HTTPS to prevent eavesdropping.
8.  **Protect Against Credential Stuffing**: Use MFA and monitor for suspicious login patterns.
9.  **OAuth / Social Logins**: If using third-party logins (Google, GitHub, etc.), implement the OAuth 2.0 or OpenID Connect flows correctly, paying close attention to state parameters, redirect URI validation, and secure token handling. **Clerk simplifies social login integration.**

## Mikhail Ajaj Portfolio Specific Guidelines (Using Clerk)

*   **Utilize Clerk Components**: Prefer using Clerk's pre-built UI components (`<SignIn>`, `<SignUp>`, `<UserProfile>`, `<UserButton>`) where appropriate, as they encapsulate best practices.
*   **Backend Authentication**: When accessing protected backend resources (Server Components fetching data, Route Handlers, Server Actions):
    *   Use Clerk's helper functions (`auth()`, `currentUser()`, `getAuth`) available in `nextjs/server` or specific middleware integrations to verify the user's session and retrieve their ID or claims.
    *   **Never** trust user identity information coming directly from the client without server-side verification using Clerk's tools.
*   **API Authentication**: For protecting API routes (`route.ts`), use Clerk's middleware or helper functions to verify the JWT or session token present in the request headers (e.g., `Authorization: Bearer <token>`).
*   **Secrets Management**: Securely store Clerk API keys and secrets. Do not commit them directly to the repository. Use environment variables (`.env.local`, Vercel environment variables).
*   **Webhook Security**: If using Clerk webhooks, verify webhook signatures to ensure requests genuinely originate from Clerk.
*   **Stay Updated**: Keep Clerk dependencies (`@clerk/nextjs`, etc.) updated to benefit from security patches and new features.

By leveraging Clerk's robust features and following these general security principles, we can maintain a secure authentication system for Mikhail Ajaj Portfolio.