import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DeterministicSimulationEngine,
  SEED_VEHICLES,
  SEED_REQUESTS,
} from '../src/simulation/deterministicEngine';
import { CAMPUS_LOCATIONS, INITIAL_ROAD_SEGMENTS } from '../src/data/campusData';

test('1. Named locations: hostels, library, main gate, academic block exist with valid coordinates', () => {
  const categories = CAMPUS_LOCATIONS.map((l) => l.category);
  assert.ok(categories.includes('hostel'), 'Campus locations must include hostels');
  assert.ok(categories.includes('library'), 'Campus locations must include library');
  assert.ok(categories.includes('main_gate'), 'Campus locations must include main gate');
  assert.ok(categories.includes('academic'), 'Campus locations must include academic blocks');

  // Verify specific required location names
  const locationNames = CAMPUS_LOCATIONS.map((l) => l.name.toLowerCase());
  assert.ok(
    locationNames.some((n) => n.includes('hostel')),
    'Hostels must be present'
  );
  assert.ok(
    locationNames.some((n) => n.includes('library')),
    'Library must be present'
  );
  assert.ok(
    locationNames.some((n) => n.includes('main gate')),
    'Main Gate must be present'
  );
  assert.ok(
    locationNames.some((n) => n.includes('academic')),
    'Academic block must be present'
  );

  CAMPUS_LOCATIONS.forEach((loc) => {
    assert.equal(loc.coordinates.length, 2, `${loc.name} must have [y, x] grid coordinates`);
    assert.ok(loc.coordinates[0] >= 0 && loc.coordinates[0] <= 800, 'Y in map bounds');
    assert.ok(loc.coordinates[1] >= 0 && loc.coordinates[1] <= 1000, 'X in map bounds');
  });
});

test('2. Determinism test: same seed data and speed produce identical movement every run', () => {
  const engine1 = new DeterministicSimulationEngine();
  const engine2 = new DeterministicSimulationEngine();

  // Advance engine1 by 30 seconds at 1x in 0.5s ticks
  for (let t = 0; t < 60; t++) {
    engine1.tick(0.5);
  }

  // Advance engine2 by 30 seconds at 1x in 0.5s ticks
  for (let t = 0; t < 60; t++) {
    engine2.tick(0.5);
  }

  const snap1 = engine1.getSnapshot();
  const snap2 = engine2.getSnapshot();

  assert.equal(snap1.simTime, snap2.simTime, 'Sim times must match exactly');

  // Verify all vehicle positions match to within exact floating point precision
  snap1.vehicles.forEach((v1, idx) => {
    const v2 = snap2.vehicles[idx];
    assert.deepEqual(
      v1.currentPosition,
      v2.currentPosition,
      `Vehicle ${v1.name} position must match deterministically across independent runs`
    );
    assert.equal(v1.nextStop, v2.nextStop, 'Next stops must match deterministically');
    assert.equal(v1.eta, v2.eta, 'ETAs must match deterministically');
  });
});

test('3. Reset function returns the map to seed state', () => {
  const engine = new DeterministicSimulationEngine();
  const initialSnapshot = engine.getSnapshot();

  // Advance simulation and alter state
  for (let t = 0; t < 50; t++) {
    engine.tick(1.0);
  }
  engine.setSpeed(4);
  engine.toggleRoadBlock();

  const advancedSnapshot = engine.getSnapshot();
  assert.notEqual(advancedSnapshot.simTime, 0, 'Simulation time should have advanced');

  // Call reset()
  engine.reset();
  const resetSnapshot = engine.getSnapshot();

  assert.equal(resetSnapshot.simTime, 0, 'Reset must reset simTime to 0');
  assert.equal(resetSnapshot.speedMultiplier, 1, 'Reset must restore 1x speed');
  assert.equal(resetSnapshot.isPaused, false, 'Reset must unpause');

  resetSnapshot.vehicles.forEach((v, idx) => {
    const initialV = initialSnapshot.vehicles[idx];
    assert.deepEqual(v.currentPosition, initialV.currentPosition, 'Vehicle position must reset to seed');
    assert.equal(v.seatsOccupied, initialV.seatsOccupied, 'Seats occupied must reset to seed');
    assert.equal(v.seatsRemaining, initialV.seatsRemaining, 'Seats remaining must reset to seed');
    assert.equal(v.nextStop, initialV.nextStop, 'Next stop must reset to seed');
  });
});

test('4. Vehicle telemetry: seats occupied, seats remaining, next stop, and ETA exist for each vehicle', () => {
  const engine = new DeterministicSimulationEngine();
  const snap = engine.getSnapshot();

  assert.ok(snap.vehicles.length >= 3, 'Must have at least 3 shuttles');

  snap.vehicles.forEach((v) => {
    assert.ok(typeof v.seatsOccupied === 'number', `${v.name} has seatsOccupied`);
    assert.ok(typeof v.seatsRemaining === 'number', `${v.name} has seatsRemaining`);
    assert.equal(
      v.seatsOccupied + v.seatsRemaining,
      v.capacity,
      `${v.name} occupied + remaining must equal capacity`
    );
    assert.ok(typeof v.nextStop === 'string' && v.nextStop.length > 0, `${v.name} has nextStop`);
    assert.ok(typeof v.eta === 'string' && v.eta.length > 0, `${v.name} has formatted ETA string`);
  });
});

test('5. Cancelled rides and blocked roads visible in simulation state', () => {
  const engine = new DeterministicSimulationEngine();
  const snap = engine.getSnapshot();

  // Check cancelled rides
  const cancelledRides = snap.requests.filter((r) => r.status === 'cancelled');
  assert.ok(cancelledRides.length > 0, 'Must have cancelled rides');
  cancelledRides.forEach((r) => {
    assert.ok(r.cancellationReason, 'Cancelled ride must have a cancellationReason');
    assert.equal(r.pickupCoordinates.length, 2, 'Cancelled ride must have map coordinates');
  });

  // Check blocked roads
  const blockedRoads = snap.roadSegments.filter((r) => r.isBlocked);
  assert.ok(blockedRoads.length > 0, 'Must have at least one blocked road');
  blockedRoads.forEach((r) => {
    assert.ok(r.blockReason, 'Blocked road must have a blockReason');
    assert.ok(r.path.length >= 2, 'Blocked road must have path coordinates for map rendering');
  });
});

test('6. Rejection reasons displayed for rejected requests ("no seats left", "pickup window missed")', () => {
  const engine = new DeterministicSimulationEngine();
  const snap = engine.getSnapshot();

  const rejectedRequests = snap.requests.filter((r) => r.status === 'rejected');
  assert.ok(rejectedRequests.length >= 2, 'Must have rejected requests');

  const reasons = rejectedRequests.map((r) => r.rejectionReason || '');
  assert.ok(
    reasons.some((reason) => reason.includes('no seats left')),
    'Must display "no seats left" rejection reason'
  );
  assert.ok(
    reasons.some((reason) => reason.includes('pickup window missed')),
    'Must display "pickup window missed" rejection reason'
  );
});

test('7. Speed control (1x, 2x, 4x) advances simulation proportionally', () => {
  const engine1x = new DeterministicSimulationEngine();
  const engine4x = new DeterministicSimulationEngine();

  engine4x.setSpeed(4);

  // Advance both by 5 wall-clock seconds in 1s steps
  for (let i = 0; i < 5; i++) {
    engine1x.tick(1);
    engine4x.tick(1);
  }

  assert.equal(engine1x.getSnapshot().simTime, 5, '1x speed advances 5s in 5s wall time');
  assert.equal(engine4x.getSnapshot().simTime, 20, '4x speed advances 20s in 5s wall time');
});

test('8. Pickup and drop events trigger in simulation event log', () => {
  const engine = new DeterministicSimulationEngine();

  // Advance time to 60s to trigger Rahul's pickup (at 15s) and drop (at 55s)
  for (let i = 0; i < 120; i++) {
    engine.tick(0.5);
  }

  const snap = engine.getSnapshot();
  const eventTypes = snap.recentEvents.map((e) => e.type);

  assert.ok(eventTypes.includes('pickup'), 'Pickup event must be logged');
  assert.ok(eventTypes.includes('drop'), 'Drop event must be logged');

  const rahul = snap.requests.find((r) => r.id === 'req_rahul');
  assert.equal(rahul?.status, 'completed', 'Rahul should be completed after drop');
});

