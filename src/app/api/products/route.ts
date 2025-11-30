import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/products - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM products';
    let params: any[] = [];

    if (search) {
      sql += ' WHERE ProductName LIKE ?';
      params.push(`%${search}%`);
    }

    sql += ' ORDER BY ProductName ASC';

    const products = await query(sql, params);

    return NextResponse.json({
      Status: 'Success',
      Products: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { Status: 'Error', Message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ProductName, Description } = body;

    if (!ProductName) {
      return NextResponse.json(
        { Status: 'Error', Message: 'Product name is required' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO products (ProductName, Description) VALUES (?, ?)',
      [ProductName, Description || '']
    );

    return NextResponse.json({
      Status: 'Success',
      Message: 'Product created successfully',
      ProductId: (result as any).insertId,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { Status: 'Error', Message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
