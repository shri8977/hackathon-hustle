

## Mobile Layout Plan

The sidebar is currently fixed at 264px with no mobile responsiveness. The main content has a hardcoded `ml-64` margin.

### Changes

**1. Sidebar.tsx — Add mobile drawer behavior**
- Accept `isOpen` and `onClose` props
- On mobile (`md:` breakpoint): render as a full-screen overlay with backdrop, slide-in from left
- On desktop: keep current fixed sidebar
- Add a hamburger menu button visible only on mobile
- Auto-close sidebar when a tool is selected on mobile

**2. Index.tsx — Manage mobile sidebar state**
- Add `sidebarOpen` state
- Add a top bar with hamburger button visible on `md:hidden`
- Change `ml-64` to `md:ml-64 ml-0`
- Pass open/close handlers to Sidebar

**3. HomeView.tsx — Responsive grid**
- Check if tool cards grid needs responsive columns (likely already handled but will verify)

No new dependencies needed. Uses Tailwind responsive classes and existing framer-motion.

