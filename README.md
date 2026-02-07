# Personal Portfolio Website

Source code for my personal portfolio website.

**Live site:** [joydeep.io](https://joydeep.io)

## Tech Stack

- HTML, CSS, vanilla JavaScript
- No frameworks, no build tools
- Configuration-based content management

## File Structure

```
├── index.html          # Main HTML structure
├── main.css           # Styles and theme
├── config.js          # Personal data and content
├── app.js             # Application logic
└── README.md          # This file
```

## Development

All content is managed through `config.js` for easy updates.

### Updating Content

1. Edit `config.js` with your changes
2. Run `./update-versions.sh` to update cache-busting version numbers
3. Commit and push your changes

The version update script automatically timestamps all CSS/JS files to prevent browser caching issues.

---

© 2026 Joydeep Bhattacharya
