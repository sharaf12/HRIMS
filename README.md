# HRIMS - Human Resource Information Management System

A modern, full-featured HR management system built with Next.js and React. Manage employee data, track performance metrics, and view comprehensive employee analytics with an intuitive dashboard.

## 🚀 Tech Stack

### Frontend
- **Next.js 15.5.9** - React framework with server-side rendering
- **React 19.2.1** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### UI Components & Libraries
- **Radix UI** - Accessible, unstyled components
- **React Table** (@tanstack/react-table) - Headless table library for data management
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel component
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Recharts** - Data visualization and charts
- **Date-fns** - Date utilities

### Development Tools
- **TypeScript** - Static typing
- **ESLint** - Code linting
- **Turbopack** - Fast bundler

## 📋 Features

### Admin Dashboard
- **Employee Management** - View, edit, add, and delete employees
- **Performance Tracking** - Track KPI scores and performance levels
- **Bonus Management** - Monitor bonus eligibility across employees
- **Excel Operations** - Import and export employee data via Excel/CSV
- **Analytics & Reporting** - View comprehensive performance statistics
- **Department Overview** - Organize and filter employees by department

### Employee Portal
- **Personal Dashboard** - View your profile and key information
- **Performance Metrics** - Check your KPI scores and performance level
- **Bonus Status** - View eligibility for bonuses
- **Retention Insights** - See retention actions and reward types
- **Department Info** - View your supervisor and department details

## 🔐 Default Credentials

### Admin Access
```
Username: admin
Password: admin123
```

### Employee Access
```
Username: <Employee ID> (e.g., E001, E002, E003, etc.)
Password: password123
```

**Available Test Employees:**
- E001, E002, E003, E004, E005, E006, E007, E008, E009, E010
- E011, E012, E013, E014, E015, E016, E017, E018, E019, E020

## 📦 Installation

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Windows PC (tested on Windows 10/11)

### Steps

1. **Clone/Download the Repository**
   ```bash
   # If using git
   git clone <repository-url>
   cd HRIMS
   
   # Or extract the downloaded zip file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify TypeScript Configuration**
   ```bash
   npm run typecheck
   ```

## 🏃 Running the Application

### Development Mode
```bash
# Start the development server on port 9002
npm run dev
```

Once running, open your browser and navigate to:
```
http://localhost:9002
```

### Production Mode
```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Linting & Type Checking
```bash
# Check for code issues
npm run lint

# Type check without building
npm run typecheck
```

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── admin/        # Admin dashboard
│   │   ├── employees/    # Employee management page
│   │   ├── excel/        # Excel import/export page
│   │   ├── page.tsx      # Admin dashboard home
│   │   └── layout.tsx    # Admin layout
│   ├── user/         # Employee portal
│   │   ├── performance/  # Performance metrics page
│   │   ├── page.tsx      # Employee dashboard
│   │   └── layout.tsx    # User layout
│   ├── login/        # Authentication page
│   ├── layout.tsx    # Root layout with providers
│   ├── page.tsx      # Home page (redirects to login)
│   └── globals.css   # Global styles
├── components/       # Reusable React components
│   ├── logo.tsx
│   ├── user-nav.tsx
│   └── ui/          # UI component library
├── hooks/           # Custom React hooks
│   ├── use-auth.tsx              # Authentication context & logic
│   ├── use-employee-data.tsx     # Employee data management
│   ├── use-mobile.tsx            # Mobile detection
│   └── use-toast.ts              # Toast notifications
├── lib/             # Utility functions and types
│   ├── data.ts       # Sample employee data (20 employees)
│   ├── types.ts      # TypeScript type definitions
│   ├── utils.ts      # Utility functions
│   └── placeholder-images.ts # Image assets
└── ai/              # Legacy folder (not in use)
```

## 🔄 Key Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login page for all users |
| `/admin` | Admin Only | Admin dashboard |
| `/admin/employees` | Admin Only | Employee management |
| `/admin/excel` | Admin Only | Excel import/export |
| `/user` | Employees | Employee dashboard |
| `/user/performance` | Employees | Performance metrics |

## 🎯 How to Use

### Login to Admin Account
1. Navigate to `http://localhost:9002`
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click Login
5. Manage employees and view performance analytics

### Login as Employee
1. Navigate to `http://localhost:9002`
2. Enter username: `E001` (or any Employee ID)
3. Enter password: `password123`
4. Click Login
5. View your performance metrics and profile information

## 📊 Employee Data

The system comes preloaded with 20 sample employees from various departments:
- **HR Department** - HR Executives, Assistants, Recruitment Officers
- **Finance Department** - Accounts Executives, Financial Analysts, Payroll Officers
- **IT Department** - System Analysts, Software Engineers, IT Support
- **Marketing Department** - Marketing Officers, Brand Executives, Content Strategists
- **Operations Department** - Operations Executives, Logistics Coordinators, Quality Control
- **Sales Department** - Sales Executives, Business Development

Each employee record includes:
- Employee ID and name
- Department and job title
- Supervisor assignment
- KPI scores (Average KPI %)
- Productivity rates
- Performance levels
- Bonus eligibility status
- Reward types and retention actions

## 🛠️ Troubleshooting

### Port Already in Use
If port 9002 is already in use, you can change it:
```bash
npm run dev -- -p 3000
```

### Dependencies Installation Issues
```bash
# Clear node modules and reinstall
rmdir /s /q node_modules
npm install
```

### Type Errors
```bash
# Check for TypeScript errors
npm run typecheck
```

### Login Not Working
- Ensure you're using the correct credentials (see Default Credentials section)
- Check that session storage is enabled in your browser
- Try clearing browser cache and cookies

## 📝 Architecture Notes

### Authentication & Session Management
- Credentials are validated against hardcoded admin credentials and employee IDs from the data
- User data is stored in browser session storage (cleared on browser close)
- Authentication context manages user state across the application
- No backend server required for basic functionality

### Data Management
- All employee data is stored in-memory from `src/lib/data.ts`
- Employee data context provides global access to data
- Data can be updated via the admin panel (Excel import/CSV upload)
- Changes persist during the session only

### State Management
- React Context API for global state (Auth & Employee Data)
- Local useState for component-specific states
- Session storage for persisting user session between page reloads

## 🔧 Development Tips

- Customize employee data in `src/lib/data.ts`
- Add new columns by updating the data structure in data.ts
- Modify UI components in `src/components/ui/`
- Add new admin features in `src/app/admin/`
- Add new employee features in `src/app/user/`
- Use TypeScript for type safety throughout the codebase
- Test authentication locally with provided credentials

## 📄 License

This project is private and for internal use only.

---

**For Support or Issues:** Contact your IT department or development team.
