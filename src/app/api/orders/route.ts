import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// GET /api/orders - Fetch all orders or a specific order
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderNo = searchParams.get('orderNo');

    if (orderNo) {
      // Fetch specific order
      const orderHead = await query<RowDataPacket[]>(
        'SELECT * FROM order_head WHERE OrderNo = ?',
        [orderNo]
      );
      
      const orderDetail = await query<RowDataPacket[]>(
        'SELECT * FROM order_detail WHERE OrderNo = ?',
        [orderNo]
      );

      return NextResponse.json({
        Status: 'Success',
        OrderHead: orderHead[0] || null,
        OrderDetail: orderDetail || [],
      });
    } else {
      // Fetch all orders
      const orders = await query<RowDataPacket[]>('SELECT * FROM order_head ORDER BY OrderNo DESC LIMIT 100');
      return NextResponse.json({
        Status: 'Success',
        Orders: orders,
      });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { Status: 'Error', Message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { OrderHead, OrderDetail } = body;

    if (!OrderHead || !OrderDetail) {
      return NextResponse.json(
        { Status: 'Error', Message: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Insert new order
    const result = await query<ResultSetHeader>(
      `INSERT INTO order_head (OrderDate, CustomerName, CustomerMobileNo, PartyOrderNo, 
       PartyOrderDate, DueDate, Measurement, Remarks, TotalOrderPiece, TotalOrderWeight, 
       JobStatus, ModuleEntryCode, CompanyId, FinancialPeriod, UserId_UserHead) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        OrderHead.OrderDate,
        OrderHead.CustomerName,
        OrderHead.CustomerMobileNo || '',
        OrderHead.PartyOrderNo,
        OrderHead.PartyOrderDate || null,
        OrderHead.DueDate || null,
        OrderHead.Measurement,
        OrderHead.Remarks || '',
        OrderHead.TotalOrderPiece,
        OrderHead.TotalOrderWeight,
        OrderHead.JobStatus || '',
        OrderHead.ModuleEntryCode,
        OrderHead.CompanyId,
        OrderHead.FinancialPeriod,
        OrderHead.UserId_UserHead,
      ]
    );

    const newOrderNo = result.insertId;

    // Insert order details
    for (const detail of OrderDetail) {
      await query<ResultSetHeader>(
        `INSERT INTO order_detail (OrderNo, Sno, ProductName, Width, Length, Flop, Gauge, 
         NoOfBackColors, NoOfFrontColors, Remarks, OrderPiece, OrderWeight, RequiredWeight, 
         RateFor, Rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newOrderNo,
          detail.Sno,
          detail.ProductName,
          detail.Width,
          detail.Length,
          detail.Flop,
          detail.Gauge,
          detail.NoOfBackColors || '',
          detail.NoOfFrontColors || '',
          detail.Remarks || '',
          detail.OrderPiece,
          detail.OrderWeight,
          detail.RequiredWeight,
          detail.RateFor,
          detail.Rate,
        ]
      );
    }

    return NextResponse.json({
      Status: 'Success',
      Message: 'Order created successfully',
      OrderNo: newOrderNo,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { Status: 'Error', Message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Update an existing order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { OrderHead, OrderDetail } = body;

    if (!OrderHead || !OrderDetail || !OrderHead.OrderNo) {
      return NextResponse.json(
        { Status: 'Error', Message: 'Invalid request data or missing OrderNo' },
        { status: 400 }
      );
    }

    // Update existing order
    await query<ResultSetHeader>(
      `UPDATE order_head SET OrderDate = ?, CustomerName = ?, CustomerMobileNo = ?, 
       PartyOrderNo = ?, PartyOrderDate = ?, DueDate = ?, Measurement = ?, Remarks = ?, 
       TotalOrderPiece = ?, TotalOrderWeight = ?, JobStatus = ? WHERE OrderNo = ?`,
      [
        OrderHead.OrderDate,
        OrderHead.CustomerName,
        OrderHead.CustomerMobileNo || '',
        OrderHead.PartyOrderNo,
        OrderHead.PartyOrderDate || null,
        OrderHead.DueDate || null,
        OrderHead.Measurement,
        OrderHead.Remarks || '',
        OrderHead.TotalOrderPiece,
        OrderHead.TotalOrderWeight,
        OrderHead.JobStatus || '',
        OrderHead.OrderNo,
      ]
    );

    // Delete existing details and insert new ones
    await query<ResultSetHeader>('DELETE FROM order_detail WHERE OrderNo = ?', [OrderHead.OrderNo]);

    for (const detail of OrderDetail) {
      await query<ResultSetHeader>(
        `INSERT INTO order_detail (OrderNo, Sno, ProductName, Width, Length, Flop, Gauge, 
         NoOfBackColors, NoOfFrontColors, Remarks, OrderPiece, OrderWeight, RequiredWeight, 
         RateFor, Rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          OrderHead.OrderNo,
          detail.Sno,
          detail.ProductName,
          detail.Width,
          detail.Length,
          detail.Flop,
          detail.Gauge,
          detail.NoOfBackColors || '',
          detail.NoOfFrontColors || '',
          detail.Remarks || '',
          detail.OrderPiece,
          detail.OrderWeight,
          detail.RequiredWeight,
          detail.RateFor,
          detail.Rate,
        ]
      );
    }

    return NextResponse.json({
      Status: 'Success',
      Message: 'Order updated successfully',
      OrderNo: OrderHead.OrderNo,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { Status: 'Error', Message: 'Failed to update order' },
      { status: 500 }
    );
  }
}
