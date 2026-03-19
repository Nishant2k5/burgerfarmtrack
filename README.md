# 🍔 Burger Farm - Delivery Tracking System

A real-time delivery tracking system inspired by Uber, built for Burger Farm using HTML, CSS (Tailwind), and JavaScript with interactive maps.

## Features

### 🗺️ Real-Time Map Tracking
- Interactive map powered by Leaflet.js
- Real-time delivery person location updates
- Animated movement between locations
- Route visualization with dashed lines
- Custom markers for restaurant, delivery person, and customer

### 📊 Order Status Tracking
- Visual progress steps showing order journey
- Real-time status updates (Order Placed → Preparing → On the Way → Delivered)
- Distance and ETA calculations
- Delivery partner information

### 💬 Communication Features
- Call delivery partner button
- Message delivery partner button
- Refresh location button

### 📱 Responsive Design
- Mobile-friendly interface
- Tailwind CSS for modern, clean UI
- Smooth animations and transitions
- Toast notifications for user feedback

### 🎨 UI Components
- Order details with itemized list
- Delivery address display
- Driver information card
- Progress indicators
- Contact buttons

## Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Custom styling and animations
- **Tailwind CSS** - Utility-first CSS framework (CDN)
- **JavaScript** - Interactive functionality and map integration
- **Leaflet.js** - Open-source mapping library
- **OpenStreetMap** - Map tiles

## File Structure

```
burgerfarmtrack/
├── index.html       # Main HTML file with UI structure
├── styles.css       # Custom CSS styles and animations
├── tracking.js      # JavaScript for delivery tracking logic
└── README.md        # Project documentation
```

## How It Works

1. **Map Initialization**: The system initializes a Leaflet map centered on the delivery area
2. **Marker Placement**: Three markers are placed:
   - 🏪 Restaurant (pickup location)
   - 🏍️ Delivery person (current location)
   - 📍 Customer (delivery destination)
3. **Real-Time Updates**: Every 3 seconds, the delivery person's position is updated
4. **Smooth Animation**: The marker smoothly animates between positions
5. **Route Visualization**: A line shows the path from restaurant → delivery person → customer
6. **Progress Tracking**: Distance and ETA are calculated and displayed
7. **Status Updates**: Order status updates automatically based on proximity

## Setup Instructions

### Option 1: Direct Browser
1. Download all files to a folder
2. Open `index.html` in a web browser
3. The tracking interface will load with simulated delivery tracking

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000 in your browser
```

## Features in Detail

### Automatic Tracking
- Delivery person moves automatically towards the customer
- Updates every 3 seconds with smooth animations
- ETA and distance recalculated in real-time

### Interactive Map
- Zoom in/out controls
- Pan around the map
- Click markers for more information
- Responsive on all devices

### Order Progress
- **Order Placed** - Initial order confirmation
- **Preparing** - Restaurant preparing the food
- **On the Way** - Delivery person en route
- **Delivered** - Order successfully delivered

### Visual Feedback
- Animated markers and progress indicators
- Color-coded status badges
- Pulsing animations for active states
- Toast notifications for actions

## Customization

### Change Locations
Edit the `LOCATIONS` object in `tracking.js`:
```javascript
const LOCATIONS = {
    restaurant: [latitude, longitude],
    customer: [latitude, longitude],
    deliveryPerson: [latitude, longitude]
};
```

### Adjust Update Speed
Modify the `CONFIG` object in `tracking.js`:
```javascript
const CONFIG = {
    updateInterval: 3000, // milliseconds
    animationDuration: 3000, // milliseconds
};
```

### Customize Appearance
- Edit `styles.css` for custom styling
- Modify Tailwind classes in `index.html`
- Change marker icons in `tracking.js`

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Real backend integration with API
- [ ] WebSocket for true real-time updates
- [ ] Multiple delivery tracking
- [ ] Historical route playback
- [ ] Push notifications
- [ ] Chat integration
- [ ] Payment integration
- [ ] Rating system
- [ ] Multi-language support

## Demo Order Details

- **Order Number**: #BF12345
- **Items**:
  - Classic Burger x2 - ₹299
  - French Fries x1 - ₹99
  - Coke x2 - ₹80
- **Total**: ₹478
- **Delivery Partner**: Raj Kumar
- **Vehicle**: MH-02-AB-1234

## License

MIT License - Feel free to use and modify for your projects

## Credits

- Map tiles by OpenStreetMap
- Icons: Emoji
- Framework: Tailwind CSS
- Map Library: Leaflet.js

---

**Note**: This is a demo/prototype system. For production use, integrate with a real backend API and GPS tracking system.
