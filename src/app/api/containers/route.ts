// Containers API Route - GET /api/containers

import { NextResponse } from "next/server";
import { db } from "@/db";
import { containers } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    let query = db.select().from(containers);

    // Note: In production, you'd apply filters here
    // For now, return all containers as mock data would be used
    
    const allContainers = await query;
    
    let filtered = allContainers;
    
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    if (type) {
      filtered = filtered.filter(c => c.type === type);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.containerNo?.toLowerCase().includes(searchLower) ||
        c.blNo?.toLowerCase().includes(searchLower) ||
        c.consignee?.toLowerCase().includes(searchLower)
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
    
    const [newContainer] = await db.insert(containers).values({
      containerNo: body.containerNo,
      blNo: body.blNo,
      size: body.size,
      type: body.type,
      status: body.status || "ARRIVED",
      yardLocation: body.yardLocation,
      row: body.row,
      bay: body.bay,
      tier: body.tier,
      weight: body.weight,
      tare: body.tare,
      grossWeight: body.grossWeight,
      shipper: body.shipper,
      consignee: body.consignee,
      commodity: body.commodity,
      portOfLoading: body.portOfLoading,
      portOfDischarge: body.portOfDischarge,
      arrivalDate: body.arrivalDate,
      freeTime: body.freeTime,
      daysInYard: body.daysInYard,
      customsStatus: body.customsStatus,
      vesselName: body.vesselName,
      voyageNo: body.voyageNo,
      sealNo: body.sealNo,
      temperature: body.temperature,
      isHazmat: body.isHazmat || false,
      imoClass: body.imoClass,
      unNo: body.unNo,
    }).returning();

    return NextResponse.json({ 
      success: true, 
      data: newContainer 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating container:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create container" },
      { status: 500 }
    );
  }
}
