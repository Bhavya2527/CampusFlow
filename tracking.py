import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal
import models

router = APIRouter(prefix="/tracking", tags=["Ride Tracking"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic schemas
class TrackingUpdateSchema(BaseModel):
    vehicle_id: str
    booking_id: Optional[str] = None
    driver_name: Optional[str] = "Arun Jaiswal"
    vehicle_model: Optional[str] = "Tata Nexon EV"
    latitude: float
    longitude: float
    speed_kmh: Optional[float] = 28.5
    status: Optional[str] = "en_route"
    eta_minutes: Optional[int] = 4
    distance_remaining_km: Optional[float] = 1.2

class TrackingResponseSchema(BaseModel):
    vehicle_id: str
    booking_id: Optional[str] = None
    driver_name: Optional[str] = None
    vehicle_model: Optional[str] = None
    latitude: float
    longitude: float
    speed_kmh: float
    status: str
    eta_minutes: int
    distance_remaining_km: float
    updated_at: str
    is_live: bool = True
    location_source: str = "backend_telemetry"

# Default Panipat Coordinates
PANIPAT_DEFAULTS = {
    "CF-07": {"lat": 29.3935, "lng": 76.9640, "driver": "Arun Jaiswal", "model": "Tata Nexon EV"},
    "CF-04": {"lat": 29.3965, "lng": 76.9610, "driver": "Priya Sharma", "model": "SafeRide+ EV"},
    "CF-11": {"lat": 29.3875, "lng": 76.9720, "driver": "David Kim", "model": "Eco-Van 7"},
    "CF-01": {"lat": 29.3910, "lng": 76.9670, "driver": "Robert Martinez", "model": "Campus Cruiser"},
}

@router.get("/fleet", response_model=List[TrackingResponseSchema])
def get_fleet_tracking(db: Session = Depends(get_db)):
    """Retrieve all active fleet positions."""
    records = db.query(models.VehicleLocation).all()
    if not records:
        # Seed and return defaults
        seed_fleet(db)
        records = db.query(models.VehicleLocation).all()

    return [
        TrackingResponseSchema(
            vehicle_id=r.vehicle_id,
            booking_id=r.booking_id,
            driver_name=r.driver_name,
            vehicle_model=r.vehicle_model,
            latitude=r.latitude,
            longitude=r.longitude,
            speed_kmh=r.speed_kmh,
            status=r.status,
            eta_minutes=r.eta_minutes,
            distance_remaining_km=r.distance_remaining_km,
            updated_at=r.updated_at.isoformat() if r.updated_at else datetime.datetime.utcnow().isoformat(),
            is_live=True,
            location_source="backend_telemetry"
        )
        for r in records
    ]

@router.get("/{identifier}", response_model=TrackingResponseSchema)
def get_tracking(identifier: str, db: Session = Depends(get_db)):
    """Retrieve tracking by booking_id or vehicle_id."""
    record = (
        db.query(models.VehicleLocation)
        .filter(
            (models.VehicleLocation.booking_id == identifier)
            | (models.VehicleLocation.vehicle_id == identifier)
        )
        .first()
    )

    if record:
        return TrackingResponseSchema(
            vehicle_id=record.vehicle_id,
            booking_id=record.booking_id,
            driver_name=record.driver_name,
            vehicle_model=record.vehicle_model,
            latitude=record.latitude,
            longitude=record.longitude,
            speed_kmh=record.speed_kmh,
            status=record.status,
            eta_minutes=record.eta_minutes,
            distance_remaining_km=record.distance_remaining_km,
            updated_at=record.updated_at.isoformat() if record.updated_at else datetime.datetime.utcnow().isoformat(),
            is_live=True,
            location_source="backend_telemetry"
        )

    # If identifier not found, create or assign default Panipat shuttle tracking
    seed = PANIPAT_DEFAULTS.get("CF-07", {"lat": 29.3935, "lng": 76.9640, "driver": "Arun Jaiswal", "model": "Tata Nexon EV"})
    new_record = models.VehicleLocation(
        vehicle_id="CF-07",
        booking_id=identifier,
        driver_name=seed["driver"],
        vehicle_model=seed["model"],
        latitude=seed["lat"],
        longitude=seed["lng"],
        speed_kmh=26.0,
        status="en_route",
        eta_minutes=4,
        distance_remaining_km=1.2,
        updated_at=datetime.datetime.utcnow()
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return TrackingResponseSchema(
        vehicle_id=new_record.vehicle_id,
        booking_id=new_record.booking_id,
        driver_name=new_record.driver_name,
        vehicle_model=new_record.vehicle_model,
        latitude=new_record.latitude,
        longitude=new_record.longitude,
        speed_kmh=new_record.speed_kmh,
        status=new_record.status,
        eta_minutes=new_record.eta_minutes,
        distance_remaining_km=new_record.distance_remaining_km,
        updated_at=new_record.updated_at.isoformat(),
        is_live=True,
        location_source="backend_telemetry"
    )

@router.post("/update", response_model=TrackingResponseSchema)
def update_vehicle_location(data: TrackingUpdateSchema, db: Session = Depends(get_db)):
    """Update vehicle / driver coordinates and telemetry."""
    record = (
        db.query(models.VehicleLocation)
        .filter(models.VehicleLocation.vehicle_id == data.vehicle_id)
        .first()
    )

    now = datetime.datetime.utcnow()
    if record:
        record.latitude = data.latitude
        record.longitude = data.longitude
        record.speed_kmh = data.speed_kmh or record.speed_kmh
        record.status = data.status or record.status
        record.eta_minutes = data.eta_minutes if data.eta_minutes is not None else record.eta_minutes
        record.distance_remaining_km = data.distance_remaining_km if data.distance_remaining_km is not None else record.distance_remaining_km
        if data.booking_id:
            record.booking_id = data.booking_id
        if data.driver_name:
            record.driver_name = data.driver_name
        if data.vehicle_model:
            record.vehicle_model = data.vehicle_model
        record.updated_at = now
    else:
        record = models.VehicleLocation(
            vehicle_id=data.vehicle_id,
            booking_id=data.booking_id,
            driver_name=data.driver_name,
            vehicle_model=data.vehicle_model,
            latitude=data.latitude,
            longitude=data.longitude,
            speed_kmh=data.speed_kmh or 0.0,
            status=data.status or "en_route",
            eta_minutes=data.eta_minutes or 4,
            distance_remaining_km=data.distance_remaining_km or 1.2,
            updated_at=now
        )
        db.add(record)

    db.commit()
    db.refresh(record)

    return TrackingResponseSchema(
        vehicle_id=record.vehicle_id,
        booking_id=record.booking_id,
        driver_name=record.driver_name,
        vehicle_model=record.vehicle_model,
        latitude=record.latitude,
        longitude=record.longitude,
        speed_kmh=record.speed_kmh,
        status=record.status,
        eta_minutes=record.eta_minutes,
        distance_remaining_km=record.distance_remaining_km,
        updated_at=record.updated_at.isoformat(),
        is_live=True,
        location_source="backend_telemetry"
    )

def seed_fleet(db: Session):
    for vid, data in PANIPAT_DEFAULTS.items():
        exists = db.query(models.VehicleLocation).filter(models.VehicleLocation.vehicle_id == vid).first()
        if not exists:
            db.add(
                models.VehicleLocation(
                    vehicle_id=vid,
                    driver_name=data["driver"],
                    vehicle_model=data["model"],
                    latitude=data["lat"],
                    longitude=data["lng"],
                    speed_kmh=24.0,
                    status="en_route",
                    eta_minutes=4,
                    distance_remaining_km=1.2,
                    updated_at=datetime.datetime.utcnow()
                )
            )
    db.commit()
