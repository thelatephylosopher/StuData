# Design Guidelines for Studata - Student Dropout Prediction Dashboard

## Design Approach
**Utility-Focused Data Dashboard**: This is an administrative tool prioritizing data clarity, quick scanning, and decision support. The design follows established dashboard patterns with clear visual hierarchy and color-coded risk indicators.

## Core Design Elements

### A. Color Palette

**Primary Theme**: Cream + Beige foundation
- Background: Cream (45 25% 95%)
- Secondary background: Beige (40 20% 88%)
- Surface cards: White with subtle beige tint (40 15% 97%)

**Risk Category Colors (Critical for Data Visualization)**:
- **Critical/High Risk**: Red (0 75% 50%) - Bold, demands attention
- **Medium Risk/Extension Likely**: Orange (30 85% 55%) - Warning tone
- **Low Risk/On Track**: Green (140 55% 45%) - Success indicator

**Text & UI Elements**:
- Primary text: Dark gray (0 0% 20%)
- Secondary text: Medium gray (0 0% 45%)
- Borders/dividers: Light beige (40 15% 85%)

### B. Typography

**Font Stack**: System fonts for optimal readability
- Primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- Headings: Semibold (600)
- Body: Regular (400)
- Data/numbers: Medium (500)

**Sizes**:
- Page titles: text-3xl (30px)
- Section headers: text-xl (20px)
- Table headers: text-sm font-semibold
- Body text: text-base (16px)
- Data labels: text-sm (14px)

### C. Layout System

**Spacing Primitives**: Consistent spacing using Tailwind units of 4, 6, 8, 12, 16
- Card padding: p-6
- Section spacing: space-y-8
- Component gaps: gap-4 or gap-6
- Page margins: px-8 py-6

**Container Widths**:
- Main content: max-w-7xl mx-auto
- Cards/panels: Full width within container
- Data tables: w-full with horizontal scroll if needed

### D. Component Library

**Navigation Bar** (Fixed Top):
- Height: h-16
- Background: White with subtle shadow
- Left: Logo/brand "Studata"
- Center: Navigation links (Homepage, About)
- Right: Profile section with avatar (w-10 h-10 rounded-full), name, and role

**Bottom Disclaimer Bar** (Fixed Bottom):
- Background: Beige (40 20% 88%)
- Border top: subtle orange tint for caution
- Padding: py-3 px-6
- Text: Small, centered, cautionary message with warning icon

**Search & Filter Bar**:
- Prominent search input with icon
- Filter dropdowns: Course, Program, Cohort, Individual Names, Dropout Risk
- Filters arranged horizontally with clear labels
- Apply/clear filter buttons

**Pie Chart Visualization**:
- Three segments for Low/Medium/High risk
- Colors matching risk categories
- Legend with counts below chart
- Total students display prominently
- Size: Responsive, 300-400px diameter on desktop

**Welcome Text Box**:
- Card with subtle shadow
- Cream/beige background
- Padding: p-8
- Title "Welcome to Studata" in text-2xl
- Description text in text-base with comfortable line-height

**Risk Category Tiles** (3 across):
- Grid layout: grid-cols-3
- Each tile shows: Category label, count, icon
- Background colors match risk categories (subtle, not full saturation)
- Hover state: slight elevation

**Data Table**:
- Above table: Configurable display showing "showing the top [dropdown:10] students in the [dropdown:Critical] category"
- Filter controls above table
- Headers: Sticky, bold, sortable indicators
- Columns: Student Name, Course, Program, Cohort, Current GPA, Predicted Risk
- Risk column: Color-coded badges (red/orange/green)
- Rows: Hover background change, clickable
- Zebra striping: Subtle alternating rows
- Pagination: Bottom center

**Student Detail Dashboard**:
- Top section: Student info card (name, course, year of joining, ideal graduation year) in horizontal layout
- Three metric tiles adjacent: 
  - Credits Completed (X/Y format with progress indicator)
  - Current GPA (large number display)
  - Last Semester GPA (large number display)
- Current semester courses: Table with course code, name, credits, grade
- GPA Line Graph: Full width, responsive, x-axis (semesters), y-axis (GPA 0-4.0), grid lines, data points with hover tooltips
- Model Prediction Section (Right of graph or below):
  - Title: "Model Prediction"
  - Result in large text with appropriate color (red/orange/green)
  - Explanation text below
  - "Learn More" expandable section with chevron icon
  - Expanded view shows top 5 factors with percentage bars and disclaimer text

**Buttons**:
- Primary: Solid backgrounds with appropriate colors
- Secondary: Outline style
- Sizes: text-sm with px-4 py-2 padding
- Rounded: rounded-md

### E. Data Visualization

**Pie Chart**: Use Chart.js or similar library
- Donut style with center count
- Animated on load
- Interactive tooltips

**Line Graph (GPA over time)**:
- Clean grid lines
- Data points visible with hover states
- Smooth curve interpolation
- Y-axis: 0-4.0 scale
- X-axis: Semester labels
- Responsive width

**Progress Indicators** (Credits completed):
- Horizontal bar showing X/Y completion
- Color transitions from orange to green as completion increases

### F. Interactions & States

- Table rows: Hover with subtle background change, cursor pointer
- Dropdowns: Clear active states, smooth transitions
- Clickable risk badges: Open detail page
- Expandable sections: Smooth accordion animation
- Loading states: Skeleton screens for data tables and charts

### G. Responsive Behavior

**Desktop (lg+)**: 
- Full horizontal layout
- Three-column risk tiles
- Side-by-side dashboard elements

**Tablet (md)**:
- Two-column risk tiles
- Stacked dashboard sections

**Mobile (base)**:
- Single column layout
- Horizontal scrolling for tables
- Stacked metric tiles

## Images

**No Hero Images**: This is a data-focused admin dashboard with no marketing content. All visuals are data-driven (charts, graphs, tables).

**Profile Pictures**: Small circular avatars (40x40px) in navigation bar and potentially in student detail pages.

**Icons**: Use Heroicons for UI elements (search, filter, warning, chevrons, etc.)

## Critical Implementation Notes

1. **Color Consistency**: Red color for "Critical" category MUST be used consistently across all views
2. **Disclaimer Bar**: MUST appear on every page without exception
3. **Navigation**: Profile section always visible in top-right
4. **Data Integrity**: All student data must be clickable to navigate to detail pages
5. **Risk Visualization**: Color-coding is non-negotiable for quick risk identification
6. **Accessibility**: Ensure color combinations meet WCAA standards, especially for critical red elements