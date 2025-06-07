#!/usr/bin/env python3
"""
Test script for PureTrace event creation functionality
"""

import requests
import json
from datetime import date

BACKEND_URL = "http://127.0.0.1:8000"

def test_event_creation_flow():
    """Test the complete event creation flow"""
    print("🧪 Testing PureTrace Event Creation Flow")
    print("=" * 50)
    
    # Step 1: Create a test batch
    print("\n📦 Step 1: Creating test batch...")
    batch_data = {
        "product_name": "Test Apples for Events",
        "origin": "Test Farm Valley",
        "harvest_date": "2024-01-15"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/batch", json=batch_data)
        response.raise_for_status()
        batch = response.json()
        batch_id = batch["batch_id"]
        print(f"✅ Batch created successfully!")
        print(f"   Batch ID: {batch_id}")
        print(f"   Product: {batch['product_name']}")
        print(f"   Trace URL: {batch['trace_url']}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to create batch: {e}")
        return False
    
    # Step 2: Add multiple events to the batch
    print(f"\n📋 Step 2: Adding events to batch {batch_id}...")
    
    events_to_add = [
        {
            "event_type": "Processing",
            "description": "Apples sorted and cleaned for quality",
            "timestamp": "2024-01-16",
            "location": "Processing Center Alpha",
            "batch_id": batch_id
        },
        {
            "event_type": "Quality Check",
            "description": "Passed quality inspection - Grade A",
            "timestamp": "2024-01-17",
            "location": "Quality Control Lab",
            "batch_id": batch_id
        },
        {
            "event_type": "Packaging",
            "description": "Packaged in eco-friendly containers",
            "timestamp": "2024-01-18",
            "location": "Packaging Facility Beta",
            "batch_id": batch_id
        },
        {
            "event_type": "Transportation",
            "description": "Shipped via refrigerated truck",
            "timestamp": "2024-01-19",
            "location": "Distribution Center Gamma",
            "batch_id": batch_id
        }
    ]
    
    created_events = []
    for i, event_data in enumerate(events_to_add, 1):
        try:
            response = requests.post(f"{BACKEND_URL}/event", json=event_data)
            response.raise_for_status()
            event = response.json()
            created_events.append(event)
            print(f"   ✅ Event {i}/4: {event['event_type']} - {event['description'][:30]}...")
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Failed to create event {i}: {e}")
            continue
    
    # Step 3: Verify the batch now has events
    print(f"\n🔍 Step 3: Verifying batch has events...")
    try:
        response = requests.get(f"{BACKEND_URL}/batch/{batch_id}")
        response.raise_for_status()
        updated_batch = response.json()
        
        print(f"✅ Batch retrieved successfully!")
        print(f"   Product: {updated_batch['product_name']}")
        print(f"   Origin: {updated_batch['origin']}")
        print(f"   Events: {len(updated_batch.get('events', []))}")
        
        if updated_batch.get('events'):
            print("\n📅 Event Timeline:")
            for event in sorted(updated_batch['events'], key=lambda x: x['timestamp']):
                print(f"   • {event['timestamp']}: {event['event_type']} at {event['location']}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to retrieve batch: {e}")
        return False
    
    # Step 4: Test event retrieval endpoint
    print(f"\n📋 Step 4: Testing event retrieval endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/batch/{batch_id}/events")
        response.raise_for_status()
        events = response.json()
        
        print(f"✅ Retrieved {len(events)} events via events endpoint")
        for event in events:
            print(f"   • {event['event_type']}: {event['description'][:40]}...")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to retrieve events: {e}")
    
    print("\n🎉 Event Creation Test Complete!")
    print(f"🔗 Test your frontend at: http://localhost:5173/trace/{batch_id}")
    print(f"📋 Add events at: http://localhost:5173/add-event?batch={batch_id}")
    
    return True

if __name__ == "__main__":
    test_event_creation_flow() 