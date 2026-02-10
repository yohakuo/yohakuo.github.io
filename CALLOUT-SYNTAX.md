# Callout Syntax for Hugo

Hugo natively supports GitHub-style alerts (callouts/admonitions) since version 0.132.0 using the standard `[!TYPE]` format.

## Requirements

- **Hugo version**: 0.132.0 or higher
- **Goldmark**: Default markdown renderer (no additional configuration needed)

## Syntax

Use GitHub Flavored Markdown alert syntax:

```markdown
> [!NOTE]
> Your content here.
```

## Supported Types

- `[!NOTE]` - Blue note callout
- `[!INFO]` - Blue info callout (alias of NOTE)
- `[!TIP]` - Cyan tip callout
- `[!ABSTRACT]` - Cyan abstract callout (alias of TIP)
- `[!SUCCESS]` - Green success callout
- `[!DONE]` - Green done callout (alias of SUCCESS)
- `[!WARNING]` - Orange warning callout
- `[!CAUTION]` - Orange caution callout (alias of WARNING)
- `[!QUESTION]` - Orange question callout
- `[!FAILURE]` - Red failure callout
- `[!DANGER]` - Red danger callout (alias of FAILURE)
- `[!BUG]` - Red bug callout (alias of FAILURE)
- `[!EXAMPLE]` - Purple example callout
- `[!QUOTE]` - Grey quote callout
- `[!IMPORTANT]` - Red important callout

## Custom Titles

Add a custom title after the type:

```markdown
> [!NOTE] Custom Title
> Your content here.
```

## Collapsible Callouts

To make a callout collapsible, add `-` (collapsed default) or `+` (expanded default) after the type.

**Important Note:** Due to Hugo's native alert parsing, `> [!NOTE]-` (without space) may NOT work as expected because Hugo swallows the indicator. 

**Recommended Workarounds:**

1. **Add a space**: Use `> [!NOTE] -`
2. **Use legacy syntax**: Use `> [NOTE]-` (no exclamation mark)

Examples:

```markdown
> [!WARNING] -
> This is collapsed by default (using space).

> [TIP]+
> This is expanded by default (works if Hugo parses passingly).
```

You can also combine custom titles with collapse indicators:

```markdown
> [!IMPORTANT]- Click to Expand
> This has a custom title and is collapsed by default.
```

## Features

- **Icons**: Each callout type has a unique icon
- **Colors**: Type-specific colors for quick visual identification
- **Dark Mode**: Full support with optimized colors
- **Collapsible**: Interactive expand/collapse with smooth animations
- **Keyboard Accessible**: Use Tab, Enter, and Space to navigate and toggle
- **Nested Content**: Full support for lists, code blocks, images, and more
