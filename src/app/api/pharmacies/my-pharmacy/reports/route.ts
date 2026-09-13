import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db/mongoose';
import Pharmacy from '@/lib/models/Pharmacy';
import Order from '@/lib/models/Order';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const pharmacy = await Pharmacy.findOne({
      userId: (session.user as any).id,
    });

    if (!pharmacy) {
      return NextResponse.json(
        { error: 'Pharmacy not found' },
        { status: 404 }
      );
    }

    // Get date range for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all completed orders for this pharmacy
    const orders = await Order.find({
      pharmacyId: pharmacy._id,
      status: 'completed',
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Calculate sales by product
    const productSales: { [key: string]: number } = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.medicineName;
        if (!productSales[key]) {
          productSales[key] = 0;
        }
        productSales[key] += item.quantity;
      });
    });

    // Sort products by sales
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }));

    // Get sales trend (by day for current month)
    const salesTrend: { [key: string]: number } = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!salesTrend[date]) {
        salesTrend[date] = 0;
      }
      salesTrend[date] += order.totalAmount;
    });

    // Get previous month for comparison
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const prevOrders = await Order.find({
      pharmacyId: pharmacy._id,
      status: 'completed',
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    });

    const prevMonthRevenue = prevOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const revenueGrowth = prevMonthRevenue > 0 
      ? ((totalRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 
      : 0;

    return NextResponse.json({
      totalRevenue,
      orderCount: orders.length,
      topProducts,
      salesTrend: Object.entries(salesTrend).map(([date, revenue]) => ({ date, revenue })),
      prevMonthRevenue,
      revenueGrowth,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
