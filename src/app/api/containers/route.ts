// Containers API Route - GET /api/containers
// Note: Database integration requires DB_URL and DB_TOKEN environment variables

import { NextResponse } from "next/server";
import { mockContainers } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let filtered = [...mockContainers];
    
    if (status && status !== "ALL") {
      filtered = filtered.filter(c => c.status === status);
    }
    if (type && type !== "ALL") {
      filtered = filtered.filter(c => c.type === type);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.containerNo.toLowerCase().includes(searchLower) ||
        c.blNo.toLowerCase().includes(searchLower) ||
        c.consignee.toLowerCase().includes(searchLower) ||
        c.vesselName.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: filtered,
      total: filtered.length 
    });
  } catch (error) {
    console.error("Error fetching containers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch containers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In production, this would insert into the database
    // For now, return success with the submitted data
    const newContainer = {
      id: Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ 
      success: true, 
      data: newContainer,
      message: "Container created (demo mode - database not connected)"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating container:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create container" },
      { status: 500 }
    );
  }
}
