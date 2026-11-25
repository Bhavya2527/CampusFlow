import {
  Vehicle,
  RideRequest,
  RoadSegment,
  CampusLocation,
  SimulationEvent,
  GridPoint,
  RouteWaypoint,
} from '@shared/types';
import { CAMPUS_LOCATIONS, INITIAL_ROAD_SEGMENTS } from '../data/campusData';

export interface SimulationSnapshot {
  simTime: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  speedMultiplier: 1 | 2 | 4;
  vehicles: Vehicle[];
  requests: RideRequest[];
  roadSegments: RoadSegment[];
  campusLocations: CampusLocation[];
  recentEvents: SimulationEvent[];
  stats: {
    totalRequests: number;
    activePassengers: number;
    completedRides: number;
    cancelledRides: number;
    rejectedRides: number;
    fleetOccupancyPercent: number;
  };
}

// Fixed seed vehicles
export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'veh_s1',
    name: 'Campus Shuttle 01 (North Loop)',
    plateNumber: 'CF-EV-01',
    capacity: 8,
    seatsOccupied: 4,
    seatsRemaining: 4,
    currentPosition: [100, 500],
    currentWaypointIndex: 0,
    route: [
      { name: 'Campus Main Gate', coordinates: [100, 500], action: 'pass_through' },
      { name: 'Central Cafeteria', coordinates: [240, 500], action: 'pickup' },
      { name: 'Academic Block 1 (CS & IT)', coordinates: [350, 240], action: 'drop' },
      { name: 'Science Complex', coordinates: [520, 260], action: 'pickup' },
      { name: 'Hostel A (Boys)', coordinates: [660, 180], action: 'drop' },
      { name: 'Hostel B (Boys)', coordinates: [730, 340], action: 'pickup' },
      { name: 'Sports Complex', coordinates: [680, 500], action: 'drop' },
      { name: 'Campus Main Gate', coordinates: [100, 500], action: 'pass_through' },
    ],
    nextStop: 'Central Cafeteria',
    eta: '1.5 min',
    etaSeconds: 90,
    status: 'moving',
    assignedPassengerIds: ['req_rahul', 'req_aman'],
    batteryPercent: 92,
    speedKmh: 24,
  },
  {
    id: 'veh_s2',
    name: 'Campus Shuttle 02 (East Residential)',
    plateNumber: 'CF-EV-02',
    capacity: 6,
    seatsOccupied: 3,
    seatsRemaining: 3,
    currentPosition: [680, 800],
    currentWaypointIndex: 0,
    route: [
      { name: 'Hostel C (Girls)', coordinates: [680, 800], action: 'pickup' },
      { name: 'PG Hostel', coordinates: [540, 860], action: 'pickup' },
      { name: 'Student Activity Center (SAC)', coordinates: [480, 640], action: 'drop' },
      { name: 'Central Library', coordinates: [420, 500], action: 'pickup' },
      { name: 'Central Cafeteria', coordinates: [240, 500], action: 'drop' },
      { name: 'Hostel C (Girls)', coordinates: [680, 800], action: 'pass_through' },
    ],
    nextStop: 'PG Hostel',
    eta: '2.0 min',
    etaSeconds: 120,
    status: 'moving',
    assignedPassengerIds: ['req_priya', 'req_kavya'],
    batteryPercent: 86,
    speedKmh: 20,
  },
  {
    id: 'veh_s3',
    name: 'Campus Shuttle 03 (Express Core)',
    plateNumber: 'CF-EV-03',
    capacity: 10,
    seatsOccupied: 8,
    seatsRemaining: 2,
    currentPosition: [350, 760],
    currentWaypointIndex: 0,
    route: [
      { name: 'Academic Block 2 (EE & Mech)', coordinates: [350, 760], action: 'pickup' },
      { name: 'Student Activity Center (SAC)', coordinates: [480, 640], action: 'pickup' },
      { name: 'Central Library', coordinates: [420, 500], action: 'drop' },
      { name: 'Academic Block 1 (CS & IT)', coordinates: [350, 240], action: 'drop' },
      { name: 'Central Cafeteria', coordinates: [240, 500], action: 'pass_through' },
      { name: 'Academic Block 2 (EE & Mech)', coordinates: [350, 760], action: 'pass_through' },
    ],
    nextStop: 'Student Activity Center (SAC)',
    eta: '1.0 min',
    etaSeconds: 60,
    status: 'moving',
    assignedPassengerIds: ['req_aravind'],
    batteryPercent: 78,
    speedKmh: 22,
  },
];

// Seed ride requests with deterministic status progression
export const SEED_REQUESTS: RideRequest[] = [
  {
    id: 'req_rahul',
    passengerName: 'Rahul Sharma (Roll #2201)',
    pickupLocationId: 'loc_hostel_a',
    pickupLocationName: 'Hostel A (Boys)',
    pickupCoordinates: [660, 180],
    dropoffLocationId: 'loc_acad_1',
    dropoffLocationName: 'Academic Block 1 (CS & IT)',
    dropoffCoordinates: [350, 240],
    requestTime: 0,
    status: 'assigned',
    assignedVehicleId: 'veh_s1',
    seatsRequested: 1,
    etaToPickup: 3,
  },
  {
    id: 'req_priya',
    passengerName: 'Priya Patel (Roll #2108)',
    pickupLocationId: 'loc_hostel_c',
    pickupLocationName: 'Hostel C (Girls)',
    pickupCoordinates: [680, 800],
    dropoffLocationId: 'loc_central_library',
    dropoffLocationName: 'Central Library',
    dropoffCoordinates: [420, 500],
    requestTime: 0,
    status: 'assigned',
    assignedVehicleId: 'veh_s2',
    seatsRequested: 1,
    etaToPickup: 2,
  },
  {
    id: 'req_aman',
    passengerName: 'Aman Verma (Roll #2314)',
    pickupLocationId: 'loc_cafeteria',
    pickupLocationName: 'Central Cafeteria',
    pickupCoordinates: [240, 500],
    dropoffLocationId: 'loc_sports_complex',
    dropoffLocationName: 'Sports Complex',
    dropoffCoordinates: [680, 500],
    requestTime: 5,
    status: 'assigned',
    assignedVehicleId: 'veh_s1',
    seatsRequested: 2,
    etaToPickup: 1,
  },
  {
    id: 'req_kavya',
    passengerName: 'Kavya Nair (Roll #2245)',
    pickupLocationId: 'loc_hostel_pg',
    pickupLocationName: 'PG & Research Hostel',
    pickupCoordinates: [540, 860],
    dropoffLocationId: 'loc_cafeteria',
    dropoffLocationName: 'Central Cafeteria',
    dropoffCoordinates: [240, 500],
    requestTime: 8,
    status: 'assigned',
    assignedVehicleId: 'veh_s2',
    seatsRequested: 1,
    etaToPickup: 2,
  },
  {
    id: 'req_aravind',
    passengerName: 'Aravind K. (Roll #2019)',
    pickupLocationId: 'loc_acad_2',
    pickupLocationName: 'Academic Block 2 (EE & Mech)',
    pickupCoordinates: [350, 760],
    dropoffLocationId: 'loc_central_library',
    dropoffLocationName: 'Central Library',
    dropoffCoordinates: [420, 500],
    requestTime: 10,
    status: 'assigned',
    assignedVehicleId: 'veh_s3',
    seatsRequested: 1,
    etaToPickup: 1,
  },
  // CANCELLED RIDE 1 (Visible on map!)
  {
    id: 'req_sneha_cancelled',
    passengerName: 'Sneha Reddy (Roll #2289)',
    pickupLocationId: 'loc_hostel_pg',
    pickupLocationName: 'PG & Research Hostel',
    pickupCoordinates: [540, 860],
    dropoffLocationId: 'loc_science_complex',
    dropoffLocationName: 'Science Complex',
    dropoffCoordinates: [520, 260],
    requestTime: 12,
    status: 'cancelled',
    seatsRequested: 1,
    cancellationReason: 'Ride cancelled: Afternoon Lab Session postponed',
  },
  // CANCELLED RIDE 2 (Visible on map!)
  {
    id: 'req_rohan_cancelled',
    passengerName: 'Rohan Mehra (Roll #2390)',
    pickupLocationId: 'loc_central_library',
    pickupLocationName: 'Central Library',
    pickupCoordinates: [420, 500],
    dropoffLocationId: 'loc_hostel_b',
    dropoffLocationName: 'Hostel B (Boys)',
    dropoffCoordinates: [730, 340],
    requestTime: 18,
    status: 'cancelled',
    seatsRequested: 1,
    cancellationReason: 'Ride cancelled: Student opted to walk with peers',
  },
  // REJECTED REQUEST 1 (Displays reason prominently: "no seats left")
  {
    id: 'req_vikram_rejected',
    passengerName: 'Vikram Singh (Roll #2199)',
    pickupLocationId: 'loc_main_gate',
    pickupLocationName: 'Campus Main Gate',
    pickupCoordinates: [100, 500],
    dropoffLocationId: 'loc_hostel_c',
    dropoffLocationName: 'Hostel C (Girls)',
    dropoffCoordinates: [680, 800],
    requestTime: 14,
    status: 'rejected',
    seatsRequested: 4,
    rejectionReason: 'no seats left (Capacity exceeded across active shuttles on route)',
  },
  // REJECTED REQUEST 2 (Displays reason prominently: "pickup window missed")
  {
    id: 'req_ananya_rejected',
    passengerName: 'Ananya Iyer (Roll #2212)',
    pickupLocationId: 'loc_acad_2',
    pickupLocationName: 'Academic Block 2 (EE & Mech)',
    pickupCoordinates: [350, 760],
    dropoffLocationId: 'loc_main_gate',
    dropoffLocationName: 'Campus Main Gate',
    dropoffCoordinates: [100, 500],
    requestTime: 22,
    status: 'rejected',
    seatsRequested: 1,
    rejectionReason: 'pickup window missed (Passenger ETA would exceed maximum pooled wait threshold > 15m)',
  },
  // Dynamic pending request that gets pooled
  {
    id: 'req_tanya_pending',
    passengerName: 'Tanya Sen (Roll #2341)',
    pickupLocationId: 'loc_health_center',
    pickupLocationName: 'Health & Admin Center',
    pickupCoordinates: [180, 320],
    dropoffLocationId: 'loc_acad_1',
    dropoffLocationName: 'Academic Block 1 (CS & IT)',
    dropoffCoordinates: [350, 240],
    requestTime: 25,
    status: 'pending',
    seatsRequested: 1,
    etaToPickup: 4,
  },
];

export const INITIAL_EVENTS: SimulationEvent[] = [
  {
    id: 'ev_0',
    timestamp: 0,
    type: 'request',
    title: 'Simulation Initialized',
    description: 'CampusFlow live fleet network ready. 3 shuttles dispatched.',
    locationName: 'Campus Control Center',
  },
  {
    id: 'ev_block',
    timestamp: 2,
    type: 'blockage',
    title: 'Road Segment Blocked',
    description: 'East Campus Ave (Library - Acad 2) blocked: Waterlogging & Cable Trenching.',
    locationName: 'Central Library - Acad 2 Link',
    coordinates: [385, 630],
  },
  {
    id: 'ev_rej1',
    timestamp: 14,
    type: 'rejection',
    title: 'Ride Request Rejected',
    description: 'Vikram Singh request rejected: "no seats left" (4 seats requested).',
    passengerName: 'Vikram Singh',
    locationName: 'Campus Main Gate',
    coordinates: [100, 500],
  },
  {
    id: 'ev_canc1',
    timestamp: 16,
    type: 'cancellation',
    title: 'Ride Cancelled by Passenger',
    description: 'Sneha Reddy cancelled ride from PG Hostel: Lab session postponed.',
    passengerName: 'Sneha Reddy',
    locationName: 'PG & Research Hostel',
    coordinates: [540, 860],
  },
];

export class DeterministicSimulationEngine {
  private simTime: number = 0;
  private isRunning: boolean = true;
  private isPaused: boolean = false;
  private speedMultiplier: 1 | 2 | 4 = 1;
  private vehicles: Vehicle[];
  private requests: RideRequest[];
  private roadSegments: RoadSegment[];
  private campusLocations: CampusLocation[];
  private recentEvents: SimulationEvent[];
  private listeners: Set<(snapshot: SimulationSnapshot) => void> = new Set();
  private intervalTimer: any = null;

  constructor() {
    this.vehicles = JSON.parse(JSON.stringify(SEED_VEHICLES));
    this.requests = JSON.parse(JSON.stringify(SEED_REQUESTS));
    this.roadSegments = JSON.parse(JSON.stringify(INITIAL_ROAD_SEGMENTS));
    this.campusLocations = JSON.parse(JSON.stringify(CAMPUS_LOCATIONS));
    this.recentEvents = JSON.parse(JSON.stringify(INITIAL_EVENTS));
  }

  public subscribe(listener: (snapshot: SimulationSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const snap = this.getSnapshot();
    this.listeners.forEach((l) => l(snap));
  }

  public getSnapshot(): SimulationSnapshot {
    const totalRequests = this.requests.length;
    const activePassengers = this.requests.filter(
      (r) => r.status === 'assigned' || r.status === 'picked_up'
    ).length;
    const completedRides = this.requests.filter((r) => r.status === 'completed').length;
    const cancelledRides = this.requests.filter((r) => r.status === 'cancelled').length;
    const rejectedRides = this.requests.filter((r) => r.status === 'rejected').length;

    const totalSeats = this.vehicles.reduce((acc, v) => acc + v.capacity, 0);
    const occupiedSeats = this.vehicles.reduce((acc, v) => acc + v.seatsOccupied, 0);
    const fleetOccupancyPercent = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

    return {
      simTime: this.simTime,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      speedMultiplier: this.speedMultiplier,
      vehicles: JSON.parse(JSON.stringify(this.vehicles)),
      requests: JSON.parse(JSON.stringify(this.requests)),
      roadSegments: JSON.parse(JSON.stringify(this.roadSegments)),
      campusLocations: this.campusLocations,
      recentEvents: [...this.recentEvents],
      stats: {
        totalRequests,
        activePassengers,
        completedRides,
        cancelledRides,
        rejectedRides,
        fleetOccupancyPercent,
      },
    };
  }

  public start() {
    if (!this.isRunning || this.isPaused) {
      this.isRunning = true;
      this.isPaused = false;
      this.notify();
    }
  }

  public pause() {
    if (this.isRunning && !this.isPaused) {
      this.isPaused = true;
      this.notify();
    }
  }

  public togglePlayPause() {
    if (this.isPaused) {
      this.start();
    } else {
      this.pause();
    }
  }

  public setSpeed(speed: 1 | 2 | 4) {
    this.speedMultiplier = speed;
    this.notify();
  }

  /**
   * Deterministic reset function that returns the map to seed state
   */
  public reset() {
    this.simTime = 0;
    this.isRunning = true;
    this.isPaused = false;
    this.speedMultiplier = 1;
    this.vehicles = JSON.parse(JSON.stringify(SEED_VEHICLES));
    this.requests = JSON.parse(JSON.stringify(SEED_REQUESTS));
    this.roadSegments = JSON.parse(JSON.stringify(INITIAL_ROAD_SEGMENTS));
    this.campusLocations = JSON.parse(JSON.stringify(CAMPUS_LOCATIONS));
    this.recentEvents = JSON.parse(JSON.stringify(INITIAL_EVENTS));
    this.notify();
  }

  public toggleRoadBlock(roadId: string = 'road_lib_acad2') {
    const road = this.roadSegments.find((r) => r.id === roadId);
    if (road) {
      road.isBlocked = !road.isBlocked;
      const event: SimulationEvent = {
        id: `ev_block_toggle_${Date.now()}`,
        timestamp: Math.round(this.simTime),
        type: 'blockage',
        title: road.isBlocked ? 'Road Segment Blocked' : 'Road Segment Re-opened',
        description: road.isBlocked
          ? `${road.name} is now BLOCKED: Maintenance work.`
          : `${road.name} is now CLEAR. Fleet rerouted back to optimal path.`,
        locationName: road.name,
      };
      this.recentEvents.unshift(event);
      this.notify();
    }
  }

  public cancelRide(requestId: string) {
    const req = this.requests.find((r) => r.id === requestId);
    if (req && req.status !== 'cancelled' && req.status !== 'completed') {
      req.status = 'cancelled';
      req.cancellationReason = 'Ride cancelled manually on stage demo';
      if (req.assignedVehicleId) {
        const v = this.vehicles.find((veh) => veh.id === req.assignedVehicleId);
        if (v && v.seatsOccupied >= req.seatsRequested) {
          v.seatsOccupied -= req.seatsRequested;
          v.seatsRemaining = v.capacity - v.seatsOccupied;
        }
      }
      const event: SimulationEvent = {
        id: `ev_cancel_${Date.now()}`,
        timestamp: Math.round(this.simTime),
        type: 'cancellation',
        title: 'Ride Cancelled',
        description: `${req.passengerName} cancelled ride at ${req.pickupLocationName}`,
        passengerName: req.passengerName,
        locationName: req.pickupLocationName,
        coordinates: req.pickupCoordinates,
      };
      this.recentEvents.unshift(event);
      this.notify();
    }
  }

  public injectRideRequest(customName?: string) {
    const id = `req_demo_${Date.now().toString().slice(-4)}`;
    const randomLocIndex = Math.floor(Math.random() * (this.campusLocations.length - 1));
    const pickupLoc = this.campusLocations[randomLocIndex];
    const dropoffLoc = this.campusLocations[(randomLocIndex + 2) % this.campusLocations.length];
    
    // Choose shuttle with available capacity
    const availableVehicle = this.vehicles.find((v) => v.seatsRemaining >= 1);
    const isRejected = !availableVehicle;

    const newReq: RideRequest = {
      id,
      passengerName: customName || `Student Guest (#${id.slice(-3)})`,
      pickupLocationId: pickupLoc.id,
      pickupLocationName: pickupLoc.name,
      pickupCoordinates: pickupLoc.coordinates,
      dropoffLocationId: dropoffLoc.id,
      dropoffLocationName: dropoffLoc.name,
      dropoffCoordinates: dropoffLoc.coordinates,
      requestTime: Math.round(this.simTime),
      status: isRejected ? 'rejected' : 'assigned',
      seatsRequested: 1,
      rejectionReason: isRejected ? 'no seats left (Peak campus rush hour)' : undefined,
      assignedVehicleId: availableVehicle?.id,
      etaToPickup: 2,
    };

    if (availableVehicle && !isRejected) {
      availableVehicle.seatsOccupied += 1;
      availableVehicle.seatsRemaining = availableVehicle.capacity - availableVehicle.seatsOccupied;
    }

    this.requests.unshift(newReq);

    const event: SimulationEvent = {
      id: `ev_inj_${Date.now()}`,
      timestamp: Math.round(this.simTime),
      type: isRejected ? 'rejection' : 'request',
      title: isRejected ? 'Request Rejected' : 'New Ride Requested',
      description: isRejected
        ? `${newReq.passengerName} rejected: "no seats left"`
        : `${newReq.passengerName} pooled on ${availableVehicle?.name}`,
      passengerName: newReq.passengerName,
      locationName: pickupLoc.name,
      coordinates: pickupLoc.coordinates,
    };
    this.recentEvents.unshift(event);
    this.notify();
  }

  /**
   * Deterministic step update.
   * Given deltaSeconds, the positions and events advance mathematically.
   */
  public tick(deltaSeconds: number) {
    if (!this.isRunning || this.isPaused) return;

    const effectiveDelta = deltaSeconds * this.speedMultiplier;
    this.simTime += effectiveDelta;

    // Advance vehicle positions smoothly along their route waypoints
    this.vehicles.forEach((vehicle, vIndex) => {
      const waypoints = vehicle.route;
      if (waypoints.length < 2) return;

      // Deterministic cycle speed based on vehicle index and path length
      // Let each segment take roughly 20 seconds at 1x
      const segmentDurationSec = 25 - vIndex * 3;
      const totalCycleDuration = waypoints.length * segmentDurationSec;
      const cycleTime = (this.simTime + vIndex * 8) % totalCycleDuration;

      const currentSegment = Math.floor(cycleTime / segmentDurationSec);
      const segmentProgress = (cycleTime % segmentDurationSec) / segmentDurationSec;

      const p1 = waypoints[currentSegment].coordinates;
      const p2 = waypoints[(currentSegment + 1) % waypoints.length].coordinates;

      // Linear interpolation between p1 and p2 [y, x]
      const interpolatedY = p1[0] + (p2[0] - p1[0]) * segmentProgress;
      const interpolatedX = p1[1] + (p2[1] - p1[1]) * segmentProgress;

      vehicle.currentPosition = [
        Math.round(interpolatedY * 10) / 10,
        Math.round(interpolatedX * 10) / 10,
      ];
      vehicle.currentWaypointIndex = (currentSegment + 1) % waypoints.length;
      vehicle.nextStop = waypoints[vehicle.currentWaypointIndex].name;

      const remainingSec = Math.round((1 - segmentProgress) * segmentDurationSec);
      vehicle.etaSeconds = remainingSec;
      vehicle.eta = remainingSec > 60 ? `${Math.ceil(remainingSec / 60)} min` : `${remainingSec}s`;

      // Status variations based on stop arrival
      if (segmentProgress < 0.1) {
        vehicle.status = 'boarding';
      } else {
        vehicle.status = 'moving';
      }

      // Check if blocked road affects this vehicle and adjust route
      const isRoadBlocked = this.roadSegments.find((r) => r.id === 'road_lib_acad2')?.isBlocked;
      if (vehicle.id === 'veh_s3' && isRoadBlocked) {
        // Vehicle S3 takes detour via SAC instead of direct road
        vehicle.status = 'delayed';
      }
    });

    // Deterministic state triggers at specific simulation timestamps
    const curSec = Math.floor(this.simTime);

    // At 15 seconds: Rahul is picked up!
    const rahul = this.requests.find((r) => r.id === 'req_rahul');
    if (rahul && curSec >= 15 && rahul.status === 'assigned') {
      rahul.status = 'picked_up';
      const ev: SimulationEvent = {
        id: `ev_pickup_rahul_${curSec}`,
        timestamp: curSec,
        type: 'pickup',
        title: 'Passenger Picked Up',
        description: 'Rahul Sharma picked up at Hostel A by Shuttle 01.',
        passengerName: 'Rahul Sharma',
        vehicleId: 'veh_s1',
        locationName: 'Hostel A (Boys)',
        coordinates: [660, 180],
      };
      this.recentEvents.unshift(ev);
    }

    // At 30 seconds: Priya is picked up!
    const priya = this.requests.find((r) => r.id === 'req_priya');
    if (priya && curSec >= 28 && priya.status === 'assigned') {
      priya.status = 'picked_up';
      const ev: SimulationEvent = {
        id: `ev_pickup_priya_${curSec}`,
        timestamp: curSec,
        type: 'pickup',
        title: 'Passenger Picked Up',
        description: 'Priya Patel picked up at Hostel C by Shuttle 02.',
        passengerName: 'Priya Patel',
        vehicleId: 'veh_s2',
        locationName: 'Hostel C (Girls)',
        coordinates: [680, 800],
      };
      this.recentEvents.unshift(ev);
    }

    // At 55 seconds: Rahul dropped off at Academic Block 1!
    if (rahul && curSec >= 55 && rahul.status === 'picked_up') {
      rahul.status = 'completed';
      const ev: SimulationEvent = {
        id: `ev_drop_rahul_${curSec}`,
        timestamp: curSec,
        type: 'drop',
        title: 'Passenger Dropped Off',
        description: 'Rahul Sharma reached destination: Academic Block 1 (CS & IT).',
        passengerName: 'Rahul Sharma',
        vehicleId: 'veh_s1',
        locationName: 'Academic Block 1 (CS & IT)',
        coordinates: [350, 240],
      };
      this.recentEvents.unshift(ev);
    }

    // Keep events buffer clean (last 30)
    if (this.recentEvents.length > 30) {
      this.recentEvents = this.recentEvents.slice(0, 30);
    }

    this.notify();
  }
}

// Global deterministic singleton instance
export const simulationEngine = new DeterministicSimulationEngine();

