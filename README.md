# Back To Top Auto Button

A lightweight, dependency-free JavaScript component that automatically injects a **Back to Top** button into every page, with smooth scrolling, fade behavior, mobile support, and zero HTML markup required.

The button:

- Appears automatically when scrolling  
- Fades when scroll activity stops  
- Disappears when at the top of the page  
- Stays visible during hover, focus, or touch  
- Works reliably on desktop + mobile  
- Uses namespaced CSS variables (`--bttop-*`) to avoid conflicts  
- Requires **no HTML changes** — injected entirely via script  

---

## 🚀 Features

- ✔ Automatic injection (no HTML needed)  
- ✔ Smooth scroll-to-top  
- ✔ Auto fade when inactive  
- ✔ Auto hide at top  
- ✔ Mobile-safe behavior  
- ✔ Keyboard-accessible  
- ✔ Namespaced CSS variables  
- ✔ Lightweight & dependency-free  
- ✔ Modern browser compatible  

---

## 📦 Installation

Add the script to your site:

### **Step 1 — Global JS file**
```js
// back-to-top.js
// (Paste the full JS component here)
```

### **Step 2 - Add as a separate file**
```html
<script src="/path/to/back-to-top.js" defer></script>
```

That's all — the script inserts the button and CSS automatically.

## Usage

Once the script loads:

1. Injects its CSS into <head>

2. Injects the button into <body>

3. Monitors scrolling (with requestAnimationFrame optimization)

4. Handles visibility, fading, and interaction logic

5. Works on every page with zero setup

You don't need to include any HTML or CSS manually.

## Customization

You can customize the look simply by overriding the namespaced CSS variables:
```css
:root {
  --bttop-size: 60px;
  --bttop-gap: 18px;
  --bttop-bg: #111;
  --bttop-fg: #fff;
  --bttop-shadow: 0 4px 14px rgba(0,0,0,0.3);
  --bttop-fade-opacity: 0.05;
}
```

## CSS Variable Reference
| Variable Name          | Description                | Default                          |
| ---------------------- | -------------------------- | -------------------------------- |
| `--bttop-size`         | Button width/height        | `52px`                           |
| `--bttop-gap`          | Distance from bottom/right | `20px`                           |
| `--bttop-bg`           | Button background color    | `rgba(50,50,60,0.95)`            |
| `--bttop-fg`           | Icon color                 | `#fff`                           |
| `--bttop-shadow`       | Drop shadow                | `0 6px 18px rgba(0,0,0,0.28)`    |
| `--bttop-fade-opacity` | Opacity when faded         | `0.4`                           |
| `--bttop-transition`   | Animation timing           | `220ms cubic-bezier(.2,.9,.3,1)` |
| `--bttop-z`            | Z-index                    | `9999`                           |


## Behavior Overview

**Appears when scrolling**<br/>
The button becomes visible once the user scrolls down.

**Fades when scrolling stops**<br/>
After a short delay (700ms by default), the button fades.

**Remains fully visible during user interaction**<br/>
Covers hover, focus, and mobile touch states.

**Smooth scroll to top**<br/>
Clicking triggers a smooth scroll animation.

**Auto-hide at the top**<br/>
When the scroll position reaches the top, the button hides completely.

**Fully mobile-compatible**<br/>
Handles touch and pointer events consistently across iOS and Android.

## Performance

- Uses requestAnimationFrame throttling

- Passive scroll/touch listeners

- No forced reflows

- Lightweight and fast


## License

Free to use in commercial and personal projects.