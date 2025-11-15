# Geo Stats App - Earthquake Data Visualization

A modern React application for visualizing earthquake data from the USGS (United States Geological Survey). Users can view earthquake statistics through interactive charts and data tables, with options to select data from the last day or last month.

_React assessment for Reknowledge Inc_

## Features

- 📊 **Interactive Charts** - Visualize earthquake data with Recharts
- 📋 **Data Tables** - Browse detailed earthquake information in a paginated table
- 🗺️ **Event Details** - Click on any earthquake to view detailed information in a modal
- ⏱️ **Time Period Selection** - Choose between last day or last month data
- 🎨 **Modern UI** - Dark theme with smooth animations and transitions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Technologies Used

### Core Libraries

- **React 19.2.0** - UI framework
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.2.2** - Fast build tool and dev server

### Data & State Management

- **@tanstack/react-query 5.90.9** - Server state management and data fetching
- **Zustand 5.0.8** - Lightweight state management
- **PapaParse 5.5.3** - CSV parsing for earthquake data

### UI & Styling

- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Recharts 3.4.1** - Composable charting library
- **Lucide React 0.553.0** - Beautiful icon library

### Development Tools

- **ESLint 9.39.1** - Code linting
- **TypeScript ESLint 8.46.3** - TypeScript-specific linting rules
- **Autoprefixer 10.4.22** - PostCSS plugin for vendor prefixes

## Project Structure

```
geo-stats-app/
├── src/
│   ├── components/
│   │   ├── ChartPanel.tsx       # Earthquake data visualization
│   │   ├── DataPanel.tsx        # Data table with pagination
│   │   ├── EventDetails.tsx     # Modal for earthquake details
│   │   └── Loading.tsx          # Loading spinner component
│   ├── context/
│   │   └── SelectedContext.tsx  # Context for selected earthquake
│   ├── services/
│   │   └── fetchEarthquakes.ts  # API service for fetching data
│   ├── stores/
│   │   └── selectionStore.ts    # Zustand store for selections
│   ├── types/
│   │   └── earthquake.ts        # TypeScript types
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── package.json
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.cjs          # Tailwind CSS configuration
└── eslint.config.js             # ESLint configuration
```

## Getting Started

### Prerequisites

- **Node.js** (version 18 or higher recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd geo-stats-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or if you use yarn:
   ```bash
   yarn install
   ```

### Running the Application

#### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

#### Production Build

Build the application for production:

```bash
npm run build
```

This will:

1. Type-check your code with TypeScript
2. Build optimized production bundles in the `dist/` folder

#### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

#### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Usage

1. **Select Time Period** - When the app loads, choose between "Last Day" or "Last Month" data
2. **View Charts** - See earthquake statistics visualized in the chart panel
3. **Browse Data** - Scroll through the data table to see individual earthquakes
4. **View Details** - Click on any earthquake row to see detailed information in a modal
5. **Close Modal** - Click the "Close" button, click outside the modal, or press `ESC` to close

## Data Source

The application fetches earthquake data from the USGS Earthquake Hazards Program:

- **Last Day**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.csv`
- **Last Month**: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv`

## Key Features Explained

### Period Selection Overlay

On initial load, users are presented with a centered modal to select their preferred time period. The overlay prevents interaction with the background until a selection is made.

### Event Details Modal

Clicking any earthquake in the data table opens a detailed modal showing:

- Event ID and location
- Timestamp (time and last update)
- Magnitude and type
- Depth and coordinates
- Status and network information

### Responsive Design

The application adapts to different screen sizes:

- Desktop: Side-by-side chart and table layout
- Mobile: Stacked layout for better readability

## Browser Support

The application supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Earthquake data provided by [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/)
- Built with modern React ecosystem tools and best practices
