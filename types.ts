/**
 * Shared data contracts and types for CampusFlow
 * Hackathon PS 10: Dynamic Campus Ride Pooling
 */

export interface Coordinates {
  x: number;
  y: number;
}

export type GridPoint = [number, number]; // [x, y] or [lat, lng] in L.CRS.Simple

export interface CampusLocation {
  id: string;
  name: string;
  category: 'hostel' | 'library' | 'main_gate' | 'academic' | 'sports' | 'cafeteria';
  coordinates: GridPoint;
  description?: string;
  pickupZoneName: string;
}

export type RideStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface RideRequest {
  id: string;
  passengerName: string;
  pickupLocationId: string;
  pickupLocationName: string;
  pickupCoordinates: GridPoint;
  dropoffLocationId: string;
  dropoffLocationName: string;
  dropoffCoordinates: GridPoint;
  requestTime: number; // in simulation seconds
  status: RideStatus;
  assignedVehicleId?: string;
  seatsRequested: number;
  rejectionReason?: string; // e.g. "no seats left", "pickup window missed", "outside service area"
  cancellationReason?: string; // e.g. "passenger cancelled", "walked instead"
  etaToPickup?: number; // estimated minutes
}

export type VehicleStatus = 'idle' | 'moving' | 'boarding' | 'delayed' | 'out_of_service';

export interface RouteWaypoint {
  name: string;
  coordinates: GridPoint;
  action?: 'pickup' | 'drop' | 'pass_through';
  passengerIds?: string[];
  estimatedArrivalSec?: number;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  capacity: number;
  seatsOccupied: number;
  seatsRemaining: number;
  currentPosition: GridPoint;
  route: RouteWaypoint[];
  currentWaypointIndex: number;
  nextStop: string;
  eta: string; // formatted ETA string e.g. "2 min" or "17:35"
  etaSeconds: number;
  status: VehicleStatus;
  assignedPassengerIds: string[];
  batteryPercent?: number;
  speedKmh?: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  fromLocationId: string;
  toLocationId: string;
  path: GridPoint[];
  isBlocked: boolean;
  blockReason?: string; // e.g. "Road maintenance", "Puddle blockage", "VIP Convoy"
}

export interface SimulationEvent {
  id: string;
  timestamp: number; // simulation second
  type: 'pickup' | 'drop' | 'request' | 'cancellation' | 'rejection' | 'blockage' | 'route_rerouted';
  title: string;
  description: string;
  vehicleId?: string;
  requestId?: string;
  passengerName?: string;
  locationName?: string;
  coordinates?: GridPoint;
}

export interface SimulationState {
  simTime: number; // in seconds from start
  isRunning: boolean;
  isPaused: boolean;
  speedMultiplier: 1 | 2 | 4;
  vehicles: Vehicle[];
  requests: RideRequest[];
  roadSegments: RoadSegment[];
  campusLocations: CampusLocation[];
  recentEvents: SimulationEvent[];
}

