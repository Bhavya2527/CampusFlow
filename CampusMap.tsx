import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Vehicle,
  RideRequest,
  RoadSegment,
  CampusLocation,
  SimulationEvent,
} from '@shared/types';
import { MAP_DIMENSIONS } from '../data/campusData';
import { getCampusMasterplanDataUri } from '../data/campusSvgOverlay';

interface CampusMapProps {
  vehicles: Vehicle[];
  requests: RideRequest[];
  roadSegments: RoadSegment[];
  campusLocations: CampusLocation[];
  recentEvents: SimulationEvent[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string | null) => void;
  selectedRequestId: string | null;
  onSelectRequest: (id: string | null) => void;
  isPaused: boolean;
  speedMultiplier: number;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  vehicles,
  requests,
  roadSegments,
  campusLocations,
  recentEvents,
  selectedVehicleId,
  onSelectVehicle,
  selectedRequestId,
  onSelectRequest,
  isPaused,
  speedMultiplier,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer groups for dynamic updates
  const roadsLayerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const locationsLayerRef = useRef<L.LayerGroup | null>(null);
  const vehiclesLayerRef = useRef<L.LayerGroup | null>(null);
  const passengersLayerRef = useRef<L.LayerGroup | null>(null);
  const eventsLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const { width, height } = MAP_DIMENSIONS;
    const bounds: L.LatLngBoundsExpression = [
      [0, 0],
      [height, width],
    ];

    // Create map with L.CRS.Simple for offline fixed grid
    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -0.5,
      maxZoom: 2.5,
      zoomSnap: 0.1,
      zoomDelta: 0.2,
      attributionControl: false,
      maxBounds: [
        [-50, -50],
        [height + 50, width + 50],
      ],
      maxBoundsViscosity: 0.9,
    });

    // Add SVG Masterplan Overlay
    const svgOverlayUri = getCampusMasterplanDataUri();
    L.imageOverlay(svgOverlayUri, bounds).addTo(map);

    // Initialize layer groups
    roadsLayerRef.current = L.layerGroup().addTo(map);
    routesLayerRef.current = L.layerGroup().addTo(map);
    locationsLayerRef.current = L.layerGroup().addTo(map);
    passengersLayerRef.current = L.layerGroup().addTo(map);
    vehiclesLayerRef.current = L.layerGroup().addTo(map);
    eventsLayerRef.current = L.layerGroup().addTo(map);

    // Fit view to campus bounds
    map.fitBounds(bounds, { padding: [25, 25] });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Campus Locations Layer (Static/Named Buildings)
  useEffect(() => {
    const layer = locationsLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    campusLocations.forEach((loc) => {
      // Category colors & icons
      let badgeColor = 'bg-blue-600';
      let iconSymbol = '🏛️';
      if (loc.category === 'hostel') {
        badgeColor = 'bg-indigo-600';
        iconSymbol = '🏠';
      } else if (loc.category === 'library') {
        badgeColor = 'bg-purple-600';
        iconSymbol = '📚';
      } else if (loc.category === 'main_gate') {
        badgeColor = 'bg-amber-600';
        iconSymbol = '🚪';
      } else if (loc.category === 'sports') {
        badgeColor = 'bg-emerald-600';
        iconSymbol = '🏅';
      } else if (loc.category === 'cafeteria') {
        badgeColor = 'bg-rose-600';
        iconSymbol = '☕';
      }

      const iconHtml = `
        <div class="group relative flex flex-col items-center cursor-pointer pointer-events-auto">
          <div class="w-8 h-8 rounded-full ${badgeColor} border-2 border-slate-200/60 shadow-lg shadow-black/60 flex items-center justify-center text-sm transform transition-all group-hover:scale-125">
            <span>${iconSymbol}</span>
          </div>
          <div class="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700/80 text-[10px] font-semibold text-slate-200 whitespace-nowrap shadow backdrop-blur-sm pointer-events-none">
            ${loc.name}
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        html: iconHtml,
        className: 'campus-location-marker',
        iconSize: [120, 48],
        iconAnchor: [60, 16],
      });

      const marker = L.marker([loc.coordinates[0], loc.coordinates[1]], {
        icon: markerIcon,
      });

      marker.bindPopup(`
        <div class="p-2 space-y-1.5 min-w-[200px]">
          <div class="flex items-center space-x-2">
            <span class="text-base">${iconSymbol}</span>
            <span class="font-bold text-sm text-slate-100">${loc.name}</span>
          </div>
          <div class="text-xs text-slate-400">${loc.description || ''}</div>
          <div class="pt-1 text-[11px] flex justify-between border-t border-slate-700/60">
            <span class="text-slate-400">Pickup Zone:</span>
            <span class="font-semibold text-blue-400">${loc.pickupZoneName}</span>
          </div>
          <div class="text-[10px] text-slate-500 font-mono">
            Grid Pos: [${loc.coordinates[0]}, ${loc.coordinates[1]}]
          </div>
        </div>
      `);

      marker.addTo(layer);
    });
  }, [campusLocations]);

  // Update Road Network & Blocked Roads Layer
  useEffect(() => {
    const layer = roadsLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    roadSegments.forEach((road) => {
      const latlngs: L.LatLngExpression[] = road.path.map((pt) => [pt[0], pt[1]]);

      if (road.isBlocked) {
        // High visibility blocked road with pulsing red hazard glow
        const blockedGlow = L.polyline(latlngs, {
          color: '#ef4444',
          weight: 12,
          opacity: 0.35,
          className: 'hazard-glow',
        });
        blockedGlow.addTo(layer);

        const blockedLine = L.polyline(latlngs, {
          color: '#ef4444',
          weight: 5,
          dashArray: '8, 8',
          opacity: 0.95,
          className: 'anim-dash',
        });

        // Add Road Block Warning Badge at center of road
        const midIndex = Math.floor(road.path.length / 2);
        const midPoint = road.path[midIndex];

        const hazardIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center cursor-pointer pointer-events-auto">
              <div class="absolute -inset-1 rounded-full bg-red-600/50 animate-ping"></div>
              <div class="relative px-2 py-1 rounded bg-red-950 border-2 border-red-500 shadow-xl flex items-center space-x-1.5 text-xs text-red-200 font-bold whitespace-nowrap">
                <span class="text-sm">⚠️</span>
                <span>BLOCKED ROAD</span>
              </div>
            </div>
          `,
          className: 'hazard-marker',
          iconSize: [120, 30],
          iconAnchor: [60, 15],
        });

        const hazardMarker = L.marker([midPoint[0], midPoint[1]], {
          icon: hazardIcon,
        });

        hazardMarker.bindPopup(`
          <div class="p-2.5 space-y-1.5 min-w-[220px]">
            <div class="flex items-center space-x-2 text-red-400 font-bold text-sm">
              <span>⚠️</span>
              <span>Road Segment Blocked</span>
            </div>
            <div class="text-xs text-slate-200 font-semibold">${road.name}</div>
            <div class="text-xs text-red-300/90 bg-red-950/60 p-1.5 rounded border border-red-800/60">
              Reason: ${road.blockReason || 'Under maintenance'}
            </div>
            <div class="text-[11px] text-amber-400 pt-1">
              Shuttles dynamically rerouting via secondary corridors.
            </div>
          </div>
        `);

        hazardMarker.addTo(layer);
        blockedLine.addTo(layer);
      } else {
        // Normal open road corridor
        const baseRoad = L.polyline(latlngs, {
          color: '#1e293b',
          weight: 8,
          opacity: 0.7,
        });
        baseRoad.addTo(layer);

        const innerRoad = L.polyline(latlngs, {
          color: '#334155',
          weight: 4,
          opacity: 0.8,
        });
        innerRoad.addTo(layer);
      }
    });
  }, [roadSegments]);

  // Update Active Route Polyline Layer for Shuttles
  useEffect(() => {
    const layer = routesLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    vehicles.forEach((veh) => {
      const isSelected = veh.id === selectedVehicleId;
      let routeColor = '#3b82f6'; // Shuttle 1 (Blue)
      if (veh.id === 'veh_s2') routeColor = '#10b981'; // Shuttle 2 (Green)
      if (veh.id === 'veh_s3') routeColor = '#f59e0b'; // Shuttle 3 (Amber)

      // Draw route loop
      const routePoints: L.LatLngExpression[] = veh.route.map((w) => [
        w.coordinates[0],
        w.coordinates[1],
      ]);
      // Close route loop
      if (routePoints.length > 0) {
        routePoints.push(routePoints[0]);
      }

      const routeLine = L.polyline(routePoints, {
        color: routeColor,
        weight: isSelected ? 4 : 2.5,
        dashArray: isSelected ? '6, 6' : '4, 4',
        opacity: isSelected ? 0.9 : 0.5,
      });

      routeLine.bindTooltip(`${veh.name} Assigned Loop`, {
        sticky: true,
      });

      routeLine.addTo(layer);
    });
  }, [vehicles, selectedVehicleId]);

  // Update Vehicle Markers Layer
  useEffect(() => {
    const layer = vehiclesLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    vehicles.forEach((veh) => {
      const isSelected = veh.id === selectedVehicleId;
      let colorClass = 'from-blue-600 to-indigo-700 border-blue-400';
      let ringColor = 'rgba(59, 130, 246, 0.4)';
      let textBadgeColor = 'bg-blue-900/90 text-blue-200 border-blue-700';

      if (veh.id === 'veh_s2') {
        colorClass = 'from-emerald-600 to-teal-700 border-emerald-400';
        ringColor = 'rgba(16, 185, 129, 0.4)';
        textBadgeColor = 'bg-emerald-900/90 text-emerald-200 border-emerald-700';
      } else if (veh.id === 'veh_s3') {
        colorClass = 'from-amber-600 to-orange-700 border-amber-400';
        ringColor = 'rgba(245, 158, 11, 0.4)';
        textBadgeColor = 'bg-amber-900/90 text-amber-200 border-amber-700';
      }

      const vehicleHtml = `
        <div class="relative flex flex-col items-center cursor-pointer pointer-events-auto transform transition-all duration-300 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-40'
        }">
          <!-- Pulse halo -->
          <div class="absolute -inset-2 rounded-full pulse-circle" style="background-color: ${ringColor}"></div>

          <!-- Vehicle Body Badge -->
          <div class="relative w-10 h-10 rounded-full bg-gradient-to-tr ${colorClass} border-2 shadow-2xl flex items-center justify-center text-white">
            <span class="text-base font-bold">🚐</span>
            
            <!-- Seat occupancy badge pill -->
            <div class="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-slate-900 border border-slate-600 text-[9px] font-black font-mono text-emerald-400 shadow">
              ${veh.seatsOccupied}/${veh.capacity}
            </div>
          </div>

          <!-- Information label: Next stop & ETA -->
          <div class="mt-1 px-2 py-0.5 rounded border text-[10px] font-bold ${textBadgeColor} shadow-lg whitespace-nowrap backdrop-blur-md flex items-center space-x-1">
            <span>${veh.name.split('(')[0].trim()}</span>
            <span class="text-slate-400">•</span>
            <span class="text-yellow-300 font-mono">${veh.eta}</span>
          </div>
        </div>
      `;

      const vehicleIcon = L.divIcon({
        html: vehicleHtml,
        className: 'vehicle-marker',
        iconSize: [120, 56],
        iconAnchor: [60, 20],
      });

      const marker = L.marker([veh.currentPosition[0], veh.currentPosition[1]], {
        icon: vehicleIcon,
      });

      marker.on('click', () => {
        onSelectVehicle(veh.id);
      });

      // Must have for each vehicle: seats occupied, seats remaining, next stop, and ETA
      marker.bindPopup(`
        <div class="p-2.5 space-y-2 min-w-[240px]">
          <div class="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <div class="font-bold text-sm text-slate-100 flex items-center space-x-1.5">
              <span>🚐</span>
              <span>${veh.name}</span>
            </div>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-600">
              ${veh.plateNumber}
            </span>
          </div>

          <!-- Mandatory Fleet Telemetry -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-1.5 rounded bg-slate-800/80 border border-slate-700">
              <div class="text-[10px] text-slate-400 uppercase tracking-wider">Seats Occupied</div>
              <div class="text-sm font-bold text-emerald-400 font-mono">${veh.seatsOccupied} seats</div>
            </div>
            <div class="p-1.5 rounded bg-slate-800/80 border border-slate-700">
              <div class="text-[10px] text-slate-400 uppercase tracking-wider">Seats Remaining</div>
              <div class="text-sm font-bold text-cyan-400 font-mono">${veh.seatsRemaining} available</div>
            </div>
          </div>

          <div class="space-y-1 text-xs pt-1">
            <div class="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span class="text-slate-400">Next Stop:</span>
              <span class="font-bold text-blue-400">${veh.nextStop}</span>
            </div>
            <div class="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span class="text-slate-400">Estimated Arrival (ETA):</span>
              <span class="font-bold text-amber-300 font-mono">${veh.eta} (${veh.etaSeconds}s)</span>
            </div>
            <div class="flex justify-between items-center bg-slate-900/60 p-1.5 rounded">
              <span class="text-slate-400">Status:</span>
              <span class="capitalize font-semibold text-emerald-300">${veh.status}</span>
            </div>
          </div>

          <div class="pt-1.5 border-t border-slate-700 flex justify-between text-[11px] text-slate-400">
            <span>Battery: ${veh.batteryPercent || 85}%</span>
            <span>Speed: ${veh.speedKmh || 22} km/h</span>
          </div>
        </div>
      `);

      marker.addTo(layer);
    });
  }, [vehicles, selectedVehicleId, onSelectVehicle]);

  // Update Passenger & Ride Requests Layer (Valid, Cancelled, Rejected)
  useEffect(() => {
    const layer = passengersLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    requests.forEach((req) => {
      const isSelected = req.id === selectedRequestId;

      // Handle CANCELLED RIDES (Must be clearly visible on map)
      if (req.status === 'cancelled') {
        const cancelHtml = `
          <div class="relative flex flex-col items-center cursor-pointer pointer-events-auto">
            <div class="relative w-7 h-7 rounded-full bg-red-950 border-2 border-red-500 shadow-xl flex items-center justify-center text-red-300 font-bold text-xs">
              <span>✕</span>
            </div>
            <div class="mt-1 px-1.5 py-0.5 rounded bg-red-950/95 border border-red-700 text-[10px] font-bold text-red-200 line-through shadow-md whitespace-nowrap">
              CANCELLED: ${req.passengerName.split('(')[0].trim()}
            </div>
          </div>
        `;

        const cancelIcon = L.divIcon({
          html: cancelHtml,
          className: 'cancelled-marker',
          iconSize: [140, 40],
          iconAnchor: [70, 14],
        });

        const cancelMarker = L.marker([req.pickupCoordinates[0], req.pickupCoordinates[1]], {
          icon: cancelIcon,
        });

        cancelMarker.bindPopup(`
          <div class="p-2 space-y-1.5 min-w-[220px]">
            <div class="flex items-center space-x-1.5 text-red-400 font-bold text-sm">
              <span>✕</span>
              <span>Ride Request Cancelled</span>
            </div>
            <div class="text-xs font-semibold text-slate-200">${req.passengerName}</div>
            <div class="text-xs text-red-300 bg-red-950/80 p-1.5 rounded border border-red-800">
              ${req.cancellationReason || 'Cancelled by passenger'}
            </div>
            <div class="text-[11px] text-slate-400 pt-1">
              Pickup Point: ${req.pickupLocationName}
            </div>
          </div>
        `);

        cancelMarker.addTo(layer);
        return;
      }

      // Handle REJECTED REQUESTS (Must display rejection reason on screen/map)
      if (req.status === 'rejected') {
        const rejectHtml = `
          <div class="relative flex flex-col items-center cursor-pointer pointer-events-auto">
            <div class="relative w-7 h-7 rounded-full bg-amber-950 border-2 border-amber-500 shadow-xl flex items-center justify-center text-amber-300 font-bold text-xs">
              <span>🚫</span>
            </div>
            <div class="mt-1 px-2 py-0.5 rounded bg-amber-950/95 border border-amber-700 text-[10px] font-bold text-amber-300 shadow-md whitespace-nowrap">
              REJECTED: ${req.rejectionReason?.includes('no seats left') ? 'no seats left' : 'pickup window missed'}
            </div>
          </div>
        `;

        const rejectIcon = L.divIcon({
          html: rejectHtml,
          className: 'rejected-marker',
          iconSize: [160, 42],
          iconAnchor: [80, 14],
        });

        const rejectMarker = L.marker([req.pickupCoordinates[0], req.pickupCoordinates[1]], {
          icon: rejectIcon,
        });

        rejectMarker.bindPopup(`
          <div class="p-2 space-y-1.5 min-w-[230px]">
            <div class="flex items-center space-x-1.5 text-amber-400 font-bold text-sm">
              <span>🚫</span>
              <span>Ride Request Rejected</span>
            </div>
            <div class="text-xs font-semibold text-slate-100">${req.passengerName}</div>
            <div class="text-xs text-amber-300 bg-amber-950/80 p-2 rounded border border-amber-800 font-medium">
              Reason: "${req.rejectionReason}"
            </div>
            <div class="text-[11px] text-slate-400 pt-1 flex justify-between">
              <span>From: ${req.pickupLocationName}</span>
              <span>Seats: ${req.seatsRequested}</span>
            </div>
          </div>
        `);

        rejectMarker.addTo(layer);
        return;
      }

      // Handle VALID ACTIVE RIDE REQUESTS (Assigned, In Transit, Picked up)
      if (req.status === 'assigned' || req.status === 'picked_up' || req.status === 'pending') {
        const isPickedUp = req.status === 'picked_up';
        const passengerHtml = `
          <div class="relative flex flex-col items-center cursor-pointer pointer-events-auto">
            <div class="relative w-6 h-6 rounded-full ${
              isPickedUp ? 'bg-emerald-600 border-emerald-300' : 'bg-cyan-600 border-cyan-300'
            } border-2 shadow-lg flex items-center justify-center text-white text-[11px]">
              <span>👤</span>
            </div>
            <div class="mt-0.5 px-1 py-0.2 rounded bg-slate-900/90 border border-slate-700 text-[9px] font-semibold text-slate-200 whitespace-nowrap">
              ${req.passengerName.split('(')[0].trim()}
            </div>
          </div>
        `;

        const passengerIcon = L.divIcon({
          html: passengerHtml,
          className: 'passenger-marker',
          iconSize: [100, 36],
          iconAnchor: [50, 12],
        });

        const passMarker = L.marker([req.pickupCoordinates[0], req.pickupCoordinates[1]], {
          icon: passengerIcon,
        });

        passMarker.bindPopup(`
          <div class="p-2 space-y-1.5 min-w-[210px]">
            <div class="flex items-center justify-between border-b border-slate-700 pb-1">
              <span class="font-bold text-xs text-slate-100">${req.passengerName}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded ${
                isPickedUp ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'
              } font-mono">${req.status}</span>
            </div>
            <div class="text-xs space-y-1">
              <div class="text-slate-300">📍 Pickup: <span class="font-semibold text-white">${req.pickupLocationName}</span></div>
              <div class="text-slate-300">🎯 Dropoff: <span class="font-semibold text-white">${req.dropoffLocationName}</span></div>
              ${
                req.assignedVehicleId
                  ? `<div class="text-cyan-400 font-semibold">Assigned Shuttle: ${req.assignedVehicleId}</div>`
                  : ''
              }
            </div>
          </div>
        `);

        passMarker.addTo(layer);

        // Draw dotted desire line connecting pickup to dropoff
        const desireLine = L.polyline(
          [
            [req.pickupCoordinates[0], req.pickupCoordinates[1]],
            [req.dropoffCoordinates[0], req.dropoffCoordinates[1]],
          ],
          {
            color: isPickedUp ? '#10b981' : '#06b6d4',
            weight: 1.5,
            dashArray: '3, 6',
            opacity: 0.45,
          }
        );
        desireLine.addTo(layer);
      }
    });
  }, [requests, selectedRequestId]);

  // Flash pickup and drop events with expanding ripples
  useEffect(() => {
    const layer = eventsLayerRef.current;
    if (!layer || recentEvents.length === 0) return;

    // Check latest event
    const latestEvent = recentEvents[0];
    if (!latestEvent || !latestEvent.coordinates) return;

    if (latestEvent.type === 'pickup' || latestEvent.type === 'drop') {
      const isPickup = latestEvent.type === 'pickup';
      const rippleColor = isPickup ? '#3b82f6' : '#10b981';

      const rippleCircle = L.circle([latestEvent.coordinates[0], latestEvent.coordinates[1]], {
        radius: 20,
        color: rippleColor,
        fillColor: rippleColor,
        fillOpacity: 0.35,
        weight: 2,
        className: 'pulse-circle',
      });

      rippleCircle.addTo(layer);

      // Remove after 6 seconds
      setTimeout(() => {
        if (layer.hasLayer(rippleCircle)) {
          layer.removeLayer(rippleCircle);
        }
      }, 6000);
    }
  }, [recentEvents]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950">
      {/* Map viewport container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Persistent "DEMO SIMULATION" label on all simulated movement (Must-Have requirement) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none select-none">
        <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-950/90 border-2 border-blue-500/80 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="font-black text-xs tracking-wider text-blue-400 font-mono">
              DEMO SIMULATION
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-semibold text-slate-300">
            PS 10: Dynamic Campus Ride Pooling
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-[10px] font-mono text-cyan-400">
            CRS.Simple Fixed Grid • {speedMultiplier}x
          </span>
        </div>
      </div>

      {/* Map Legend Overlay (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-10 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur-md shadow-xl text-xs space-y-1.5 min-w-[210px]">
        <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-1">
          <span>Map Fleet Legend</span>
          <span className="text-[9px] text-slate-500 font-mono">Offline L.CRS</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300">
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Shuttle 01</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Shuttle 02</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Shuttle 03</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Passenger</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span className="text-red-400 font-medium">Cancelled</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-amber-400 font-medium">Rejected</span>
          </div>
        </div>
        <div className="pt-1 border-t border-slate-800/80 flex items-center space-x-1.5 text-[10px] text-red-400">
          <span className="font-bold">⚠️ Blocked:</span>
          <span>East Campus Ave (Trenching)</span>
        </div>
      </div>
    </div>
  );
};
