# INNLUXE - Luxury Real Estate Website

A pure HTML/CSS/JavaScript implementation of the INNLUXE luxury real estate website. No frameworks, no build tools - just clean, modern web development.

## Features

- **5 Pages:**
  - Home (index.html) - Hero section with carousel, how it works, property showcase
  - Sell (sell.html) - Multi-step form for property selling
  - Buy (buy.html) - Property listings with filters and sorting
  - Repairs (repairs.html) - Renovation services with before/after slider
  - About (about.html) - Company info with contact form and map

- **Database Integration:**
  - All forms submit to Supabase REST API
  - Tables: `sell_form_submissions`, `contact_form_submissions`, `renovation_form_submissions`

- **Interactive Features:**
  - Responsive navigation with mobile menu
  - Image carousel on homepage
  - Multi-step form with progress bar (Sell page)
  - Property filters and sorting (Buy page)
  - Before/After image slider (Repairs page)
  - Google Maps integration (About page)
  - Form validation and submission

## File Structure

```
finalwebsite/
├── index.html          # Homepage
├── sell.html           # Sell property form
├── buy.html            # Property listings
├── repairs.html        # Renovation services
├── about.html          # About & contact
├── css/
│   └── styles.css      # All styles in one file
├── js/
│   └── main.js         # All JavaScript functionality
├── assets/             # Images
│   ├── hero-city.jpg
│   ├── Pont-neuf.jpg
│   ├── property-1.jpg
│   ├── property-2.jpg
│   ├── repairs-hero.jpg
│   ├── Renovation_1.jpg
│   ├── Place-dauphine.jpg
│   └── Droneshot.jpg
└── README.md
```

## How to Use

### Local Development

1. **Open the website:**
   - Simply open `index.html` in a web browser
   - Or use a local server like Live Server (VS Code extension)
   - Or use Python: `python -m http.server 8000`
   - Or use PHP: `php -S localhost:8000`

2. **Navigate the site:**
   - Click on navigation links to explore different pages
   - Forms will submit data to Supabase database

### Deployment

1. **Upload to any web host:**
   - Upload all files to your web server
   - No build process required
   - Works with GitHub Pages, Netlify, Vercel, or any static hosting

2. **For GitHub Pages:**
   ```bash
   # Create a new repository on GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   
   # Enable GitHub Pages in repository settings
   # Set source to main branch / root
   ```

## Database Configuration

The website connects to Supabase for form submissions. The configuration is in `js/main.js`:

```javascript
const SUPABASE_URL = 'https://rqdhwrtkweeuiqjrvbrd.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Required Supabase Tables:

1. **sell_form_submissions**
   - name, email, phone, address, city
   - contact_method, best_time
   - property_type, surface_area, bedrooms, bathrooms
   - year_built, condition, features, urgency
   - desired_price, mortgage, viewing_availability
   - additional_info, created_at

2. **contact_form_submissions**
   - name, email, phone, message, created_at

3. **renovation_form_submissions**
   - name, email, phone, address, city
   - repair_type, urgency, description, created_at

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features Explained

### Homepage (index.html)
- Hero section with rotating images
- How it works section with 3 steps
- Quick form for lead capture
- Featured properties carousel
- Renovation services teaser

### Sell Page (sell.html)
- 3-step form with progress indicator
- Step 1: Contact & location info
- Step 2: Property details
- Step 3: Financial information
- Success message after submission

### Buy Page (buy.html)
- 6 property listings
- Search by location
- Filter by price, type, bedrooms
- Sort by various criteria
- Real-time filtering with JavaScript

### Repairs Page (repairs.html)
- Interactive before/after image slider
- 3 service tiers explained
- Service request form
- Success message after submission

### About Page (about.html)
- Company values with icons
- Company story
- Contact information
- Contact form
- Google Maps integration
- Drone shot image

## Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --background: #ffffff;
  --foreground: #262626;
  --primary: #171717;
  /* ... more colors */
}
```

### Images
Replace images in the `assets/` folder with your own.

### Content
Edit the HTML files directly to change text, links, etc.

### Forms
Modify form fields in HTML and update the corresponding JavaScript handlers in `main.js`.

## Performance

- No external dependencies
- Optimized CSS with minimal specificity
- Lazy loading for images (where appropriate)
- Efficient JavaScript with event delegation
- Fast page loads (< 1s on good connection)

## Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text for images
- ARIA labels for buttons
- Keyboard navigation support
- Focus states for interactive elements

## SEO

- Proper meta tags in all pages
- Descriptive page titles
- Alt text for images
- Semantic HTML structure
- Fast loading times

## License

All rights reserved. INNLUXE © 2025

## Support

For questions or issues, contact: cedric@innluxe.fr

