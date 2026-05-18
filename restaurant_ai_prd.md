# Product Requirements Document (PRD)
**Ai Sales Forecasting and Revenue Prediction System**

## Table of Contents
1. [Project Vision & Goals](#1-project-vision--goals)
2. [User Roles & Personas](#2-user-roles--personas)
3. [User Stories](#3-user-stories)
4. [Detailed Functional Requirements (User Interface)](#4-detailed-functional-requirements-user-interface)
5. [Detailed Functional Requirements (Admin Interface)](#5-detailed-functional-requirements-admin-interface)
6. [Data Schema Requirements](#6-data-schema-requirements)
7. [Data Flow Diagram Description](#7-data-flow-diagram-description)
8. [Non-Functional Requirements](#8-non-functional-requirements)

---

## 1. Project Vision & Goals

**Objective:**
To empower restaurant managers and administrators with predictive insights to optimize staffing, transactions, inventory, and marketing strategies. By leveraging historical and real-time data, the system will anticipate demand fluctuations, leading to reduced waste, optimized labor costs, and maximized revenue.

**Design Language:**
*   Mobile-friendly and fully responsive layout.
*   Native Dark Mode support.
*   Modern, intuitive, and data-driven visualization components.

**Tech Stack (Recommended):**
*   **Frontend:** React / Next.js (Tailwind CSS for UI/UX)
*   **Backend:** Python / FastAPI
*   **Database:** MySQL
*   **AI Engine:** Scikit-learn, XGBoost, LSTM (Long Short-Term Memory networks)

---

## 2. User Roles & Personas

**1. Restaurant Manager (User)**
*   **Focus:** Daily operations, local branch forecasting, staff scheduling, and inventory management.
*   **Pain Points:** Over/under-staffing during unexpected rushes, food waste due to poor demand prediction, and lack of actionable data for daily decision-making.
*   **Needs:** Easy-to-understand daily forecasts, actionable AI recommendations, and real-time low-stock alerts.

**2. System Administrator (Admin)**
*   **Focus:** Multi-branch performance analysis, AI model health and accuracy, and system-wide data management.
*   **Pain Points:** Reconciling data across multiple branches, monitoring AI degradation over time, and identifying macro-level trends.
*   **Needs:** High-level KPI aggregations, model evaluation metrics, Explainable AI (XAI) insights, and robust user management.

---

## 3. User Stories

### Restaurant Manager (User)
*   **As a Restaurant Manager**, I want to view my daily, weekly, and monthly revenue and order forecasts on a dashboard so that I can anticipate business volume.
*   **As a Restaurant Manager**, I want to receive actionable AI recommendations (e.g., running specific promotions) so that I can proactively boost sales on predicted slow days.
*   **As a Restaurant Manager**, I want to predict dish-level demand so that I can prepare the right amount of ingredients and minimize food waste.
*   **As a Restaurant Manager**, I want to see a schedule of suggested staff levels based on expected hourly demand so that I can optimize labor costs without sacrificing customer service.
*   **As a Restaurant Manager**, I want to export reports to PDF so that I can share them during weekly management meetings.

### System Administrator (Admin)
*   **As a System Administrator**, I want to view aggregated KPIs across all branches so that I can assess the overall health of the entire restaurant chain.
*   **As a System Administrator**, I want to monitor the accuracy (MAE, RMSE) of the active forecasting models so that I can retrain them when performance degrades.
*   **As a System Administrator**, I want to switch between different AI models (ARIMA, LSTM, XGBoost) so that I can deploy the best-performing algorithm.
*   **As a System Administrator**, I want to see Feature Importance charts (Explainable AI) so that I understand which external factors (e.g., weather, events) are driving the model's predictions.
*   **As a System Administrator**, I want to manage user access and permissions so that branch managers only see data relevant to their specific locations.

---

## 4. Detailed Functional Requirements (User Interface)

**Authentication:** 
Secure login portal featuring Role-Based Access Control (RBAC).

**Sidebar navigation:** 
`Dashboard` | `Forecast` | `AI Recommendation` | `Customer Insights` | `Menu` | `Inventory & Staffing` | `Data Management` | `Logout`

### Main Dashboard Page
*   **Top Bar:** Global search input, Date-filter selector (Today/Week/Month presets), "Export to PDF" button, and Profile dropdown (with Logout).
*   **KPI Cards:** Displaying metrics over the selected period: Total Revenue, Total Orders, Total Customers, and Revenue Growth (%).
    *   *Visual cue:* Dynamic color coding applied (Green ↑ for growth, Red ↓ for decline).

### Forecast Page
*   **Controls:** Granular date-range selector.
*   **Visualizations:**
    *   Predicted Orders vs. Revenue (Line/Bar Chart hybrid).
    *   Hourly breakdown graph illustrating expected foot traffic.
    *   Meal-wise split (Pie/Doughnut chart): Breakfast, Lunch, Dinner.

### AI Recommendation Page
*   **Interface:** A feed of actionable intelligence cards.
*   **Example Card:** "Run 10% discount tomorrow based on predicted low footfall due to heavy rain."
*   **Interactivity:** Include an 'Apply Suggestion' button to log the action or send a webhook to marketing tools.

### Customer Insights Page
*   **Visualizations:**
    *   Average Order Value (AOV) trends over time.
    *   Repeat vs. New Customer ratios.
*   **Listings:** Top 10 High-Value Customers (anonymized or with consent data) based on CLV.

### Menu Page
*   **Features:** Dish-level demand forecasting and popularity predictions.
*   **Guidance:** Inventory prep guidance mapped to specific menu items.
*   **Management:** Add/Edit/Disable menu item functionality.

### Inventory & Staffing Page
*   **Alerts:** Real-time visual alerts for 'Low Stock' items based on prediction vs. current state.
*   **Reorders:** List of suggested reorder quantities.
*   **Scheduling:** Staff-to-demand mapping (e.g., "Reduce staff at 3 PM, increase staff at 6 PM").

### Data Management
*   **Upload:** Secure CSV/Excel upload module for manual data pushes.
*   **Viewer:** Raw dataset tabular viewer with basic sorting and filtering capabilities.

---

## 5. Detailed Functional Requirements (Admin Interface)

**Authentication:** Admin-specific portal access.

**Sidebar navigation:**
`Dashboard` | `Model Management` | `Explainable AI` | `Data Management` | `Alerts Panel` | `Multi-Branch View` | `User Management` | `Logout`

### Admin Dashboard
*   **Aggregated KPIs:** Overall chain performance metrics.
*   **Model Accuracy:** Global percentage indicators.
*   **Platform metrics:** Active system users.
*   **Historical Trends:** Revenue trends (monthly/yearly), Customer Lifetime Value (CLV).
*   **Validation:** Sales vs. Forecast comparison chart to track actuals against predictions.

### Model Management
*   **Controls:** Toggle switches to set the active model (ARIMA, LSTM, XGBoost) per branch or globally.
*   **Metrics Panel:** Real-time display of Mean Absolute Error (MAE) and Root Mean Squared Error (RMSE).
*   **Maintenance:** 'Retrain Model' trigger button and historical accuracy logs.

### Explainable AI (XAI)
*   **Visualizations:** Feature Importance Bar Chart indicating the weight of various inputs on the current predictions (e.g., Weight of Weather influence vs. Weekends vs. Active Discounts).

### Alerts Panel
*   **System Notifications:** Centralized feed for critical alerts regarding sudden sales drops, incoming data anomalies, or model threshold failures.

### Multi-Branch View
*   **Comparisons:** Tabular grids and geospatial maps highlighting the best and worst performing branches based on selected metrics.

### User Management
*   **CRUD Operations:** Create, Read, Update, Delete functionality for user profiles.
*   **Permissions:** Assignment of roles (Manager, Admin) and branch affiliations.

### Data Management
*   **Upload/Viewer:** Similar to the User Interface, but with cross-branch visibility and master dataset management capabilities.

---

## 6. Data Schema Requirements

The system integrates ten distinct primary datasets. The critical features are mapped as follows to drive the AI models:

**1. Forecasting Features (Drivers of Demand):**
*   `Weather_Condition`, `Temperature`, `Local_Events` (Source: `external_factors.csv`)
*   `Day`, `Month`, `Holiday` status (Source: `time_based_inputs.csv`)
*   *Marketing Spend, Current Discounts* (Source: `marketing_inputs.csv`)

**2. Revenue/Order Features (The Target Variables):**
*   `Final_Revenue`, `Total_Amount`, `Order_Type`, `Payment_Method` (Source: `transactional_data.csv`)
*   *Historical Orders* (Source: `order_history.csv`)
*   *Platform Data (UberEats, Doordash, etc.)* (Source: `online_platform_data.csv`)

**3. Operational Features (Constraints & Capacity):**
*   `Number_of_Staff`, `Seating_Capacity`, `Table_Occupancy_Rate` (Source: `operational_inputs.csv`)
*   *Stock Levels, Waste* (Source: `inventory_inputs.csv`)

**4. Entity Data:**
*   *Customer Demographics* (Source: `customer_data.csv`)
*   *Item Prices, Categories* (Source: `menu_pricing_dataset.csv`)

---

## 7. Data Flow Diagram Description

1.  **Ingestion:** Raw data from PoS systems, Staffing software, and external APIs (Weather, Events) are ingested or manually uploaded (via Data Management CSV upload) into the system. The 10 primary datasets are updated in the central **MySQL Database**.
2.  **Preprocessing (Backend API):** The FastAPI backend pulls the raw data, handles missing values, normalizes datasets, and merges features (e.g., joining weather data with transactional data on timestamp).
3.  **Model Inference (AI Engine):**
    *   The processed data pipeline is fed into the active ML Model (e.g., XGBoost for structured cross-sectional data, or LSTM for complex time-series forecasting).
    *   The model generates predictions for upcoming time blocks (Revenue, Item Demand, Footfall).
4.  **Post-Processing & XAI:** The FastAPI backend formulates actionable recommendations based on the predictions (e.g., identifying low threshold predictions to generate "Add discount" recommendations) and extracts feature importance for the Admin XAI view.
5.  **Presentation (Frontend UI):**
    *   The Next.js frontend requests the formatted forecasts, KPIs, and recommendations via secure REST endpoints.
    *   Data is visualized for either the Branch Manager or Admin User based on their JWT authorization scope.
6.  **Feedback Loop:** Actuals (Realized Sales) are continuously appended back into MySQL, triggering Model Accuracy recalculations. If RMSE exceeds failure thresholds, an alert is sent to the Admin Panel for model retraining.

---

## 8. Non-Functional Requirements

*   **Performance:**
    *   AI inference pipeline latency must be `< 2 seconds` for standard dashboard loading constraints.
    *   The frontend UI must maintain a 60fps render rate, particularly on complex charting pages.
*   **Security:**
    *   Stateless JWT (JSON Web Token) implementation for Authentication and Authorization.
    *   All data in transit must be secured via SSL/TLS encryption (HTTPS).
    *   Uploaded CSVs must be sanitized to prevent injection attacks or malicious macros.
*   **UI/UX:**
    *   Strict adherence to a Component-based architecture.
    *   Tailwind CSS is preferred for deterministic styling, rapidly assembling dark-mode variants, and ensuring mobile responsiveness.
    *   Accessibility (a11y) considerations for charting colors (contrast ratios).
