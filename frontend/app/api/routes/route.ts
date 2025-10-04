// Mock routes API for development
import { NextResponse } from 'next/server';

const mockRoutes = [
  {
    id: 1,
    name: 'Dhaka - Chittagong Express',
    startLocation: 'Dhaka',
    endLocation: 'Chittagong',
    stops: 'Dhaka, Cumilla, Chittagong',
    distance: 264,
    estimatedDuration: 360, // 6 hours in minutes
    fare: 450,
    description: 'Direct express service to Chittagong with comfortable seating',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Dhaka - Sylhet Highway',
    startLocation: 'Dhaka',
    endLocation: 'Sylhet',
    stops: 'Dhaka, Narsingdi, Bhairab, Sylhet',
    distance: 247,
    estimatedDuration: 330, // 5.5 hours in minutes
    fare: 420,
    description: 'Scenic route through northern Bangladesh',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Dhaka - Rajshahi Direct',
    startLocation: 'Dhaka',
    endLocation: 'Rajshahi',
    stops: 'Dhaka, Rajshahi',
    distance: 256,
    estimatedDuration: 360, // 6 hours in minutes
    fare: 480,
    description: 'Non-stop express service to Rajshahi',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Chittagong - Sylhet Connector',
    startLocation: 'Chittagong',
    endLocation: 'Sylhet',
    stops: 'Chittagong, Cumilla, Feni, Sylhet',
    distance: 198,
    estimatedDuration: 270, // 4.5 hours in minutes
    fare: 380,
    description: 'Connect between major eastern cities',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Dhaka - Khulna Express',
    startLocation: 'Dhaka',
    endLocation: 'Khulna',
    stops: 'Dhaka, Khulna',
    distance: 278,
    estimatedDuration: 390, // 6.5 hours in minutes
    fare: 520,
    description: 'Direct service to southwestern Bangladesh',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Dhaka - Rangpur Northern',
    startLocation: 'Dhaka',
    endLocation: 'Rangpur',
    stops: 'Dhaka, Rangpur',
    distance: 301,
    estimatedDuration: 420, // 7 hours in minutes
    fare: 580,
    description: 'Journey to northern Bangladesh',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(mockRoutes);
  } catch (error) {
    console.error('Error in routes API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    );
  }
}