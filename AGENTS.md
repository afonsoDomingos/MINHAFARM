# MINHAFARM - Agent Development Guide

## Project Overview
MINHAFARM is a digital platform connecting people seeking medications with registered pharmacies in Mozambique. The platform allows users to search for medicines, find available pharmacies, and place orders.

## Tech Stack
- **Frontend**: Next.js 16 (React 19), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Password Hashing**: bcryptjs

## Development Commands

### Start Development Server
```bash
npm run dev
```
Server runs on http://localhost:3000

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Linter
```bash
npm run lint
```

### Create Admin User
```bash
npm run create-admin
```
This creates an admin user with email: admin@minhafarm.co.mz and password: admin123

## Environment Variables
Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb://localhost:27017/minhafarm
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Database Models

### User
```typescript
{
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'pharmacy' | 'admin';
  favorites: ObjectId[];
}
```

### Pharmacy
```typescript
{
  name: string;
  email: string;
  password: string;
  logo?: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  openingHours: string;
  location?: { type: 'Point', coordinates: [number, number] };
  userId: ObjectId;
  status: 'pending' | 'approved' | 'suspended';
  rating?: number;
}
```

### Medicine
```typescript
{
  name: string;
  description?: string;
  category: string;
  dosage?: string;
  manufacturer?: string;
  requiresPrescription: boolean;
  active: boolean;
}
```

### PharmacyMedicine
```typescript
{
  pharmacyId: ObjectId;
  medicineId: ObjectId;
  price: number;
  available: boolean;
  quantity: number;
}
```

### Order
```typescript
{
  userId: ObjectId;
  pharmacyId: ObjectId;
  items: {
    medicineId: ObjectId;
    medicineName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'received' | 'analyzing' | 'confirmed' | 'ready' | 'completed' | 'rejected';
  rejectionReason?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  notes?: string;
}
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth authentication

### Medicines
- `GET /api/medicines/search?q=query` - Search medicines

### Pharmacies
- `GET /api/pharmacies` - List all approved pharmacies
- `GET /api/pharmacies/:id` - Get pharmacy details
- `GET /api/pharmacies/:id/medicines` - Get pharmacy medicines
- `POST /api/pharmacies/register` - Register new pharmacy
- `GET /api/pharmacies/my-pharmacy` - Get current user's pharmacy
- `PATCH /api/pharmacies/my-pharmacy` - Update pharmacy info
- `GET /api/pharmacies/my-pharmacy/medicines` - Get pharmacy medicines
- `POST /api/pharmacies/my-pharmacy/medicines` - Add medicine to pharmacy
- `PATCH /api/pharmacies/my-pharmacy/medicines/:id` - Update pharmacy medicine
- `DELETE /api/pharmacies/my-pharmacy/medicines/:id` - Remove medicine from pharmacy
- `GET /api/pharmacies/my-pharmacy/orders` - Get pharmacy orders
- `PATCH /api/pharmacies/my-pharmacy/orders/:id` - Update order status

### Orders
- `POST /api/orders` - Create new order

### Users
- `GET /api/users/my-orders` - Get current user's orders

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/pharmacies` - List all pharmacies
- `PATCH /api/admin/pharmacies/:id` - Update pharmacy status

## Key Components

### Header
- Navigation menu
- User authentication status
- Role-based navigation

### Footer
- Platform links
- Legal links
- Contact information

### PharmacyDashboardNav
- Navigation for pharmacy dashboard
- Tabs: Overview, Medicines, Orders, Settings

## Design System

### Colors
- Primary: Green (#16a34a)
- Dark Green: #15803d
- Light Green: #22c55e
- Background: White (#ffffff)
- Text: Gray (#171717)

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, dark gray
- Body: Regular, dark gray
- Secondary: Light gray

### Components
- Buttons: Green background, white text, rounded corners
- Cards: White background, subtle border, shadow
- Forms: Clean inputs with green focus states
- Status badges: Color-coded by status

## User Roles & Permissions

### User
- Search medicines
- View pharmacies
- Place orders
- View order history
- Favorite pharmacies

### Pharmacy
- Manage medicines (add, update, remove)
- Update availability and prices
- Process orders (receive, analyze, confirm, ready, complete)
- Update pharmacy information
- View order history

### Admin
- Approve/suspend pharmacies
- View all users
- View all orders
- Access platform statistics
- Manage system settings

## Testing the Application

### 1. Start MongoDB
```bash
mongod
```

### 2. Create Admin User
```bash
npm run create-admin
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Flows

#### Admin Flow
1. Login at `/login` with admin credentials
2. Access `/dashboard/admin`
3. Approve pharmacies
4. View statistics

#### Pharmacy Flow
1. Register at `/pharmacy-register`
2. Wait for admin approval
3. Login at `/pharmacy-login`
4. Access `/dashboard/pharmacy`
5. Add medicines
6. Manage orders

#### User Flow
1. Register at `/register`
2. Login at `/login`
3. Search medicines at `/search`
4. View pharmacy at `/pharmacy/:id`
5. Place order
6. View order history at `/dashboard/user`

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env.local
- Verify MongoDB is accessible on the specified port

### NextAuth Session Issues
- Check NEXTAUTH_URL matches your development URL
- Verify NEXTAUTH_SECRET is set
- Clear browser cookies

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`
- Verify all imports are correct

## File Structure Patterns

### API Routes
```
src/app/api/[resource]/route.ts
src/app/api/[resource]/[id]/route.ts
```

### Pages
```
src/app/[page]/page.tsx
src/app/[page]/[id]/page.tsx
```

### Components
```
src/components/[ComponentName].tsx
```

### Models
```
src/lib/models/[ModelName].ts
```

## Code Style Guidelines

- Use TypeScript for all new files
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Keep components focused and single-purpose
- Use async/await for database operations
- Handle errors appropriately
- Add comments for complex logic

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Update NEXTAUTH_SECRET
- [ ] Configure production MongoDB URI
- [ ] Build the application (`npm run build`)
- [ ] Test production build locally
- [ ] Deploy to hosting platform
- [ ] Change admin password
- [ ] Configure domain
- [ ] Set up SSL certificate
- [ ] Monitor application logs

## Future Development Priorities

1. **Interactive Map**: Add map showing pharmacy locations
2. **Rating System**: Allow users to rate pharmacies
3. **Delivery Service**: Implement home delivery options
4. **Payment Integration**: Add digital payment methods
5. **Push Notifications**: Real-time order updates
6. **Mobile App**: Native Android/iOS applications
7. **Chat System**: Direct communication between users and pharmacies