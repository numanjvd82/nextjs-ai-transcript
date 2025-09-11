# AI Transcript Application Instructions

## Design Guidelines

### Icons

- **Always use Heroicons for all icons in the application**
- Import icons from `@heroicons/react/24/outline` or `@heroicons/react/24/solid` depending on the desired style
- Example usage:

  ```jsx
  import { PlusIcon, UserIcon } from "@heroicons/react/24/outline";

  // Then in your component:
  <PlusIcon className="h-5 w-5" />;
  ```

- Ensure icons have proper accessibility with appropriate aria-labels where needed
- Standard icon sizes:
  - Small: h-4 w-4
  - Medium: h-5 w-5 (default)
  - Large: h-6 w-6
  - Extra large: h-8 w-8

### UI Components

- Use Headless UI for interactive components (Menu, Dialog, etc.)
- Use TailwindCSS for styling all components
- Follow our color scheme:
  - Primary: purple-600 to blue-500 gradient
  - Dark mode background: gray-900
  - Light mode background: white/gray-50
  - Text: gray-800 (light mode), gray-200 (dark mode)

### Forms

- Use React Hook Form for form management
- Use Zod for form validation
- Example pattern:

  ```jsx
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";

  const formSchema = z.object({
    // schema definition
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // defaults
    },
  });
  ```

## File Upload Requirements

- Accept audio and video files with explicit mime types
- Supported formats: mp3, mp4, wav, ogg, webm
- Maximum file size: 100MB
- Provide clear user feedback during upload process

## Authentication

- JWT-based authentication
- Store tokens in cookies with HttpOnly flag
- Implement proper token refresh mechanism
- Protected routes should redirect to /auth when not authenticated

## Codebase Structure

- React components in /src/components
- Pages in /src/app following Next.js App Router convention
- API routes in /src/app/api
- Reusable hooks in /src/hooks
- Types in /src/types or global.d.ts
