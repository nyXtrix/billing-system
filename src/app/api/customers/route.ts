import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/customers - Fetch all customers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM customers';
    let params: any[] = [];

    if (search) {
      sql += ' WHERE CustomerName LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY CustomerName ASC';

    const customers = await query(sql, params);

    return NextResponse.json({
      Status: 'Success',
      Customers: customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { Status: 'Error', Message: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { CustomerName, MobileNo, Address } = body;

    if (!CustomerName) {
      return NextResponse.json(
        { Status: 'Error', Message: 'Customer name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO customers (CustomerName, MobileNo, Address) VALUES (?, ?, ?)',
      [CustomerName, MobileNo || '', Address || '']
    );

    return NextResponse.json({
      Status: 'Success',
      Message: 'Customer created successfully',
      CustomerId: (result as any).insertId,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { Status: 'Error', Message: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
