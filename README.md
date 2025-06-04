# Form Field Mapping Challenge

This project is a coding challenge implementation for Avantos. It demonstrates a React application for visualizing and manipulating directed acyclic graphs (DAGs) of forms, allowing users to establish prefill mappings between form fields.

## Project Overview

This application enables users to:

- View a directed acyclic graph (DAG) of forms
- Configure how form fields from upstream forms can prefill fields in downstream forms
- Select from multiple data sources for field mapping:
  - Direct predecessor form fields
  - Transitive predecessor form fields
  - Global data properties

## Features

- Interactive graph visualization with node and edge display
- Drawer interface for editing node properties and field mappings
- Comprehensive field mapping between forms
- Support for traversing the form DAG to find available source fields
- Dark mode UI with HeroUI components
- Responsive layout

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with HeroUI components
- **Graph Visualization:** XYFlow (ReactFlow)
- **State Management:** React Context API
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint
- **Formatting:** Prettier

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with:

```
VITE_SERVER_URL=your_api_url_here
```

> **Note:** For this demo project, the `.env` configuration is included in the git repository. In a production environment, you should add `.env` files to your `.gitignore` to avoid committing sensitive configuration to version control.

### Development

Start the development server:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Testing

Run tests with:

```bash
npm test
```

## Project Structure

```
src/
├── api/             # API communication layer
├── components/      # Reusable UI components
│   ├── form/        # Form-related components
│   ├── graph/       # Graph visualization components
│   └── loader/      # Loading indicators
├── contexts/        # React contexts for state management
├── hooks/           # Custom React hooks
├── layouts/         # Page layout components
├── pages/           # Top-level page components
├── test/            # Test utilities and setup
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Components

### Graph Canvas

The main visualization component that renders the interactive graph using ReactFlow. Nodes can be clicked to open a drawer for editing.

### Graph Drawer

A slide-in panel that allows editing of node properties and creating field mappings between nodes.

### Form Components

Reusable form components for displaying and selecting fields, with support for both basic and active (mapped) states.

## Architecture

The application uses React Context for state management with the `GraphDrawerContext` providing the central state for the graph editor. The main workflow allows users to:

1. View a graph of connected nodes
2. Click on a node to open the drawer
3. Select fields to map
4. Choose target fields from global or predecessor nodes
5. Create and manage mappings between fields

## Extending with New Data Sources

This application is designed to be easily extended with new data sources for field mapping. To add a new data source:

1. Ensure your data source conforms to the `GraphNode` type structure:

   ```typescript
   type GraphNode = {
     id: string
     title: string
     fields: string[]
     isGlobal: boolean
     predecessorIds?: string[]
     position?: NodePosition
   }
   ```

2. Add your new data source in the context file alongside existing nodes and globalNodes:

   ```typescript
   const nodeMap = getNodeMap([...nodes, ...globalNodes, ...newDataSource])
   ```

3. The application will automatically incorporate your new data source into the available mapping options without requiring changes to the core mapping logic.

## Development Guidelines

- Follow the established component structure
- Add tests for new components
- Use the existing context for state management
- Follow the TypeScript types for consistency
