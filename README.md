# Global Mood Tracker 🌍

A real-time visualization of how the world is feeling, showing mood patterns across continents.

**[🔗 Live Demo](https://global-mood-tracker.vercel.app/)**

## What it does

- Users share their current mood/wellbeing state from 8 different options
- Data is visualized on an interactive world map  
- Each continent shows its dominant mood in real-time
- Geographic mood patterns emerge as more people participate

## Tech Stack

- **Frontend**: React, JavaScript
- **Backend**: Custom Supabase client implementation
- **Database**: Supabase (PostgreSQL)
- **Visualization**: Hand-coded SVG world map
- **Deployment**: Vercel

## Key Features

- 🗺️ **Interactive World Map**: Custom SVG map that colors continents based on dominant moods
- 📊 **Real-time Analytics**: Live continent-by-continent mood breakdown
- 🌍 **Geographic Intelligence**: Automatic city-to-continent mapping for 100+ cities
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Fast Performance**: Optimized for quick loading and smooth interactions

## Interesting Technical Challenges

### Custom Supabase Client
Built a custom Supabase client from scratch when the official SDK wasn't working as expected. Implemented:
- REST API calls with proper authentication
- Promise-based query builder pattern
- Error handling and data formatting

### Geographic Data Processing
Created a comprehensive location mapping system:
- Maps 100+ cities to their respective continents
- Handles various city name formats and spellings
- Includes major cities from all inhabited continents

### Dynamic SVG Visualization
Hand-coded SVG world map with:
- Accurate continent shapes and proportions
- Real-time color updates based on mood data
- Responsive design that scales to any screen size
- Ocean gradients and decorative elements

## Running Locally

```bash
# Clone the repository
git clone https://github.com/zeebie-new/global-mood-tracker.git

# Navigate to project directory
cd global-mood-tracker

# Install dependencies
npm install

# Start development server
npm start
```

## How It Works

1. **Data Collection**: Users select from 8 wellbeing states (Thriving, Flourishing, Content, Balanced, Steady, Uncertain, Overwhelmed, Struggling)
2. **Geographic Processing**: User location is mapped to continent using custom city database
3. **Real-time Aggregation**: Mood data is processed to find dominant feeling per continent
4. **Visualization**: SVG world map updates colors based on continental mood data

## Future Enhancements

- [ ] Historical mood trends and timeline view
- [ ] More granular geographic breakdown (country-level)
- [ ] Anonymous user sessions for tracking personal mood over time
- [ ] Data export capabilities
- [ ] Mobile app version

## Contributing

Feel free to open issues or submit pull requests. This project was built as a learning experience and I'm always open to feedback and improvements!

## Built With ❤️

Created to explore how technology can help us understand global wellbeing patterns and connect people through shared experiences.
