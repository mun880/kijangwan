import os
import django
import random
from datetime import time

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import DriverProfile, Route, Vehicle, Schedule

User = get_user_model()

def seed_data():
    print("Seeding data...")

    # 1. Create Admins
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='ADMIN')
        print("Admin created: admin/admin123")

    # 2. Create Routes
    routes_data = [
        {"start": "Darajani", "end": "Bububu", "dist": 8.5},
        {"start": "Darajani", "end": "Mazizini", "dist": 5.2},
        {"start": "Darajani", "end": "Fuoni", "dist": 7.0},
        {"start": "Terminal", "end": "Mwembe Ladu", "dist": 12.3},
        {"start": "Terminal", "end": "Kijichi", "dist": 10.1},
    ]
    
    routes = []
    for r in routes_data:
        route, _ = Route.objects.get_or_create(
            start_point=r['start'], 
            end_point=r['end'], 
            defaults={'distance': r['dist']}
        )
        routes.append(route)
    print(f"Created {len(routes)} routes")

    # 3. Create Drivers
    driver_names = ["Ali Hassan", "Fatuma Said", "Said Juma", "Mwanahawa Bakari"]
    drivers = []
    for i, name in enumerate(driver_names):
        username = f"driver{i+1}"
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(username, f"{username}@test.com", "pass123", role='DRIVER', phone=f"077000000{i}")
            profile = DriverProfile.objects.create(
                user=user, 
                full_name=name, 
                national_id=f"ID-000{i}", 
                license_number=f"LIC-999{i}",
                is_approved=(i < 2) # Approve first two
            )
            drivers.append(profile)
    print(f"Created {len(drivers)} drivers")

    # 4. Create Vehicles
    vehicles = []
    for i, driver in enumerate(drivers):
        vehicle, _ = Vehicle.objects.get_or_create(
            plate_number=f"Z {123+i} ABC",
            defaults={
                'driver': driver,
                'capacity': random.choice([14, 25, 32]),
                'color': random.choice(["White", "Blue", "Green"]),
                'is_active': True
            }
        )
        vehicles.append(vehicle)
    print(f"Created {len(vehicles)} vehicles")

    # 5. Create Schedules
    days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    for i, vehicle in enumerate(vehicles):
        # Each vehicle gets 2 schedules
        for j in range(2):
            Schedule.objects.get_or_create(
                vehicle=vehicle,
                route=random.choice(routes),
                arrival_start_time=time(8 + (i*2) + j, 0),
                arrival_end_time=time(8 + (i*2) + j, 30),
                defaults={
                    'days_of_week': days,
                    'is_active': True
                }
            )
    print("Created schedules")
    print("Seeding complete!")

if __name__ == '__main__':
    seed_data()
