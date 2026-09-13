import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import Medicine from '@/lib/models/Medicine';
import PharmacyMedicine from '@/lib/models/PharmacyMedicine';
import Pharmacy from '@/lib/models/Pharmacy';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Search for medicines matching the query
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ],
      active: true,
    }).limit(20);

    if (medicines.length === 0) {
      return NextResponse.json([]);
    }

    const medicineIds = medicines.map((m) => m._id);

    // Find pharmacy medicines for these medicines
    const pharmacyMedicines = await PharmacyMedicine.find({
      medicineId: { $in: medicineIds },
      available: true,
    })
      .populate('pharmacyId')
      .populate('medicineId')
      .exec();

    // Filter by approved pharmacies only
    const results = pharmacyMedicines
      .filter((pm) => {
        const pharmacy = pm.pharmacyId as any;
        return pharmacy && pharmacy.status === 'approved';
      })
      .map((pm) => {
        const pharmacy = pm.pharmacyId as any;
        const medicine = pm.medicineId as any;
        return {
          _id: pm._id.toString(),
          medicineId: medicine._id.toString(),
          name: medicine.name,
          category: medicine.category,
          pharmacy: {
            _id: pharmacy._id.toString(),
            name: pharmacy.name,
            address: pharmacy.address,
            neighborhood: pharmacy.neighborhood,
            city: pharmacy.city,
          },
          available: pm.available,
          price: pm.price,
          quantity: pm.quantity,
        };
      });

    // Group results by medicine name for price comparison
    const groupedResults: Record<string, any[]> = {};
    results.forEach((result) => {
      const key = result.name.toLowerCase();
      if (!groupedResults[key]) {
        groupedResults[key] = [];
      }
      groupedResults[key].push(result);
    });

    // Convert to array and sort by lowest price first
    const comparisonResults = Object.values(groupedResults).map((group) => {
      // Sort group by price (lowest first)
      group.sort((a, b) => a.price - b.price);
      return {
        ...group[0], // Use first item as base
        pharmacies: group.map((item) => ({
          pharmacyId: item.pharmacy._id,
          pharmacyName: item.pharmacy.name,
          address: item.pharmacy.address,
          neighborhood: item.pharmacy.neighborhood,
          city: item.pharmacy.city,
          price: item.price,
          quantity: item.quantity,
          available: item.available,
          _id: item._id,
          medicineId: item.medicineId,
        })),
        lowestPrice: group[0].price,
        highestPrice: group[group.length - 1].price,
        pharmacyCount: group.length,
      };
    });

    return NextResponse.json(comparisonResults);
  } catch (error) {
    console.error('Error searching medicines:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}