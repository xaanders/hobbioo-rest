# Session-Based Authentication 

In a session-based authentication system, the typical flow is as follows:

## Login:

- The server validates the user's credentials (e.g., username and password), and if successful, it creates a session ID.
- The session ID is stored on the server (in a cache/memory), along with metadata such as the expiration time and user information.
- The session ID is sent to the client, typically stored in a cookie or custom header.

## Protected Routes:

- For every subsequent request, the client sends the session ID (usually via a cookie or header).
- The server checks whether the session ID is valid, has not expired, and belongs to the correct user.
- If valid, the server processes the request. If not, the server rejects the request, typically returning a 401 Unauthorized status.

## Logout: 

- When the user logs out, the session ID is removed or marked as expired on the server (in the cache or database), and the session information is also cleared from the client (e.g., by removing the cookie).