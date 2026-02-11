# String Design System

## Color Palette

### Primary Colors
- **String Mint**: `#75F8CC` (RGB: 117, 248, 204)
- **String Dark**: `#33373B` (RGB: 51, 55, 59)
- **String Light**: `#C0F4FB` (RGB: 192, 244, 251)
- **White**: `#FFFFFF`

### Usage Guidelines
- **String Mint**: Primary accent, buttons, highlights, active states
- **String Dark**: Text, backgrounds, headers
- **String Light**: Secondary accents, subtle backgrounds
- **White**: Main backgrounds, cards

## Component Patterns

### Buttons
```tsx
// Primary Button
className="bg-string-mint text-string-dark hover:bg-string-mint-light px-4 py-2 rounded-xl font-medium transition-colors"

// Secondary Button
className="bg-white border border-gray-200 text-string-dark hover:bg-gray-50 px-4 py-2 rounded-xl font-medium transition-colors"

// Text Button
className="text-string-mint hover:text-string-mint-light font-medium transition-colors"
```

### Cards
```tsx
className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-string-mint transition-colors"
```

### Headers
```tsx
// Main Header
className="text-3xl font-bold text-string-dark"

// Section Header
className="text-xl font-semibold text-string-dark"

// Card Header
className="text-lg font-medium text-string-dark"
```

### Interactive Elements
- **Hover states**: Use `hover:border-string-mint` for subtle interactions
- **Active states**: Use `border-string-mint text-string-mint` for selection
- **Transitions**: Always include `transition-colors` or `transition-all duration-200`

## Layout Standards

### Spacing
- **Container max-width**: `max-w-4xl` or `max-w-7xl`
- **Section spacing**: `space-y-6` or `space-y-8`
- **Card padding**: `p-6` or `p-8`
- **Button padding**: `px-4 py-2` or `px-6 py-3`

### Border Radius
- **Cards**: `rounded-xl`
- **Buttons**: `rounded-xl`
- **Small elements**: `rounded-lg`
- **Avatars**: `rounded-2xl`

### Typography
- **Display**: `text-3xl font-bold`
- **Heading**: `text-xl font-semibold`
- **Subheading**: `text-lg font-medium`
- **Body**: `text-sm` or `text-base`
- **Caption**: `text-xs`

## Theme Support
Components should support both light and dark themes using the `t()` helper function:

```tsx
const t = (light: string, dark: string) => isDark ? dark : light;

// Usage
className={`${t('bg-white', 'bg-string-dark')} ${t('text-string-dark', 'text-white')}`}
```