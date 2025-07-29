# Chat Application @ Unified Mentor

## Demo
[https://winter-f3cb5.web.app](https://winter-f3cb5.web.app)

## Overview
This project is a realtime chat application, built to serve as a reusable template for messaging-based applications.
Emphasizing on firebase's full-stack capabilities, providing Backend-as-a-Service (BaaS) for realtime communication, authentication
and data-persistence.

## Tech Stack
- NextJs (Typescript) + Tailwind + Shadcn UI
- Firebase
    - Firebase Auth
    - Firestore
    - Firebase Hosting
    - Firebase Functions

## Features
1. **Authentication**: Supports email+password and google authentication.
2. **Realtime Messaging**: Supports realtime messaging between users.
3. **Rooms**: Supports creating and joining rooms.
4. **Profile**: Supports updating profile information.

## Technical Details
### Multi-tenancy
Multi tenancy was chosen to allow future expansion into multi-organizational applications.

### Database Schema (Firestore)
```
tenants (collection)
    -- tenant_id (document)
        -- users (sub-collection)
            -- user_id (document)
                -- uid (string)
                -- email (string)
                -- displayName (string)
                -- photoURL (string)
                -- phoneNumber (string)
                -- createdAt (timestamp)
                -- updatedAt (timestamp)
        -- rooms (sub-collection)
            -- room_id (document)
                -- id (string)
                -- name (string)
                -- description (string)
                -- ownerId (string)
                -- createdAt (timestamp)
                -- members (array of users)
        -- messages (sub-collection)
            -- chat_id / room_id (document, compound key)
                -- conversation (sub-collection)
                    -- message_id (document)
                        -- senderId (string)
                        -- content (string)
                        -- senderName (string)
                        -- timestamp (timestamp)
                        -- type (string)
```

### UI/UX Highlights
- Responsive layout with full viewport height
- Content area adjusts to available space without overflow
- Rounded edges for a softer look
- Dynamic theme switching using `next-themes`
- Consistent color palette using Shadcn UI and TailwindCss
