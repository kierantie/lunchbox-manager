# Lunchbox Manager

ADHD-friendly lunch planning app for children with personalized preferences and smart recommendations.

## Features

### 🍱 Smart Lunch Planning
- Generate randomized lunch plans for today/tomorrow
- Separate plans for each child with personalized ratings
- Structured meal components: recess snacks, crunch & sip, main meal, veggies, extras
- Individual item swapping to customize plans
- Visual confirmation for packing lunches

### 📊 Food Management
- Add/edit/delete food items across 4 categories: snacks, fruits, mains, veggies
- Star ratings (1-5) for each child's preferences plus health rating
- Prep level indicators (none/low/medium/high)
- Serving count tracking with low stock alerts
- Tag system for food variety (fruity, savoury, crunchy, etc.)

### 📚 Organization Features
- Lunch history tracking (last 14 days)
- Archive system for out-of-stock items
- Tag management system
- Visual badges for prep level, health rating, and food attributes

### 🎯 ADHD-Friendly Design
- Clear visual categorization with color coding
- Time-constrained eating windows (10 min recess/lunch)
- Randomized suggestions to reduce decision fatigue
- Visual stock alerts and serving tracking

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd lunchbox-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

## Usage

1. **Generate a Plan**: Click "Generate Plan" to get randomized lunch suggestions
2. **Customize**: Use the "Swap" buttons to replace items you don't want
3. **Pack Lunches**: Click "Pack These Lunches!" to save to history
4. **Manage Foods**: Add new foods, edit ratings, and track inventory
5. **View History**: See what was packed on previous days

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library

## Project Structure

```
lunchbox-manager/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Designed specifically for children with ADHD
- Built with love for Amelia & Hazel
- Icons by [Lucide](https://lucide.dev/)