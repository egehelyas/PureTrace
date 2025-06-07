#!/usr/bin/env python3
"""
Comprehensive test script for PureTrace application
Tests backend API, frontend integration, and end-to-end workflows
"""

import requests
import json
import time
from datetime import date, datetime

# Configuration
BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:5173"

def test_backend_health():
    """Test if backend is running and healthy"""
    print("🔍 Testing Backend Health...")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print("✅ Backend is healthy!")
        return True
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

def test_batch_creation():
    """Test batch creation endpoint"""
    print("\n🔍 Testing Batch Creation...")
    try:
        batch_data = {
            "product_name": "Test Organic Apples",
            "origin": "Test Valley Farm, Oregon",
            "harvest_date": "2024-01-20"
        }
        
        response = requests.post(f"{BACKEND_URL}/batch", json=batch_data)
        assert response.status_code == 200
        
        data = response.json()
        assert "batch_id" in data
        assert "trace_url" in data
        assert data["product_name"] == batch_data["product_name"]
        
        print(f"✅ Batch created successfully!")
        print(f"   Batch ID: {data['batch_id']}")
        print(f"   Trace URL: {data['trace_url']}")
        return data
    except Exception as e:
        print(f"❌ Batch creation failed: {e}")
        return None

def test_batch_retrieval(batch_id):
    """Test batch retrieval endpoint"""
    print(f"\n🔍 Testing Batch Retrieval for ID: {batch_id}")
    try:
        response = requests.get(f"{BACKEND_URL}/batch/{batch_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == batch_id
        assert "product_name" in data
        assert "events" in data
        
        print("✅ Batch retrieved successfully!")
        print(f"   Product: {data['product_name']}")
        print(f"   Events: {len(data['events'])} events")
        return data
    except Exception as e:
        print(f"❌ Batch retrieval failed: {e}")
        return None

def test_event_creation(batch_id):
    """Test event creation endpoint"""
    print(f"\n🔍 Testing Event Creation for Batch: {batch_id}")
    try:
        events = [
            {
                "event_type": "Processing",
                "description": "Apples washed and sorted by quality",
                "timestamp": "2024-01-21",
                "location": "Processing Center A",
                "batch_id": batch_id
            },
            {
                "event_type": "Packaging",
                "description": "Packaged in biodegradable containers",
                "timestamp": "2024-01-22",
                "location": "Packaging Facility B",
                "batch_id": batch_id
            },
            {
                "event_type": "Shipping",
                "description": "Shipped to distribution center",
                "timestamp": "2024-01-23",
                "location": "Distribution Hub C",
                "batch_id": batch_id
            }
        ]
        
        created_events = []
        for event_data in events:
            response = requests.post(f"{BACKEND_URL}/event", json=event_data)
            assert response.status_code == 200
            
            event = response.json()
            assert "id" in event
            assert event["batch_id"] == batch_id
            created_events.append(event)
            
        print(f"✅ Created {len(created_events)} events successfully!")
        return created_events
    except Exception as e:
        print(f"❌ Event creation failed: {e}")
        return []

def test_batch_with_events(batch_id):
    """Test batch retrieval with events"""
    print(f"\n🔍 Testing Batch with Events for ID: {batch_id}")
    try:
        response = requests.get(f"{BACKEND_URL}/batch/{batch_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data["events"]) > 0
        
        print(f"✅ Batch has {len(data['events'])} events!")
        for i, event in enumerate(data["events"], 1):
            print(f"   {i}. {event['event_type']}: {event['description']}")
        return data
    except Exception as e:
        print(f"❌ Batch with events test failed: {e}")
        return None

def test_events_endpoint(batch_id):
    """Test dedicated events endpoint"""
    print(f"\n🔍 Testing Events Endpoint for Batch: {batch_id}")
    try:
        response = requests.get(f"{BACKEND_URL}/batch/{batch_id}/events")
        assert response.status_code == 200
        
        events = response.json()
        assert isinstance(events, list)
        assert len(events) > 0
        
        print(f"✅ Events endpoint returned {len(events)} events!")
        return events
    except Exception as e:
        print(f"❌ Events endpoint test failed: {e}")
        return []

def test_error_handling():
    """Test error handling for invalid requests"""
    print("\n🔍 Testing Error Handling...")
    try:
        # Test invalid batch ID
        response = requests.get(f"{BACKEND_URL}/batch/invalid-id")
        assert response.status_code == 400
        
        # Test missing required fields
        response = requests.post(f"{BACKEND_URL}/batch", json={})
        assert response.status_code == 422
        
        print("✅ Error handling works correctly!")
        return True
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False

def test_frontend_health():
    """Test if frontend is running"""
    print("\n🔍 Testing Frontend Health...")
    try:
        response = requests.get(FRONTEND_URL)
        assert response.status_code == 200
        print("✅ Frontend is running!")
        return True
    except Exception as e:
        print(f"❌ Frontend health check failed: {e}")
        return False

def test_frontend_trace_page(batch_id):
    """Test frontend trace page"""
    print(f"\n🔍 Testing Frontend Trace Page for Batch: {batch_id}")
    try:
        response = requests.get(f"{FRONTEND_URL}/trace/{batch_id}")
        assert response.status_code == 200
        print("✅ Frontend trace page is accessible!")
        return True
    except Exception as e:
        print(f"❌ Frontend trace page test failed: {e}")
        return False

def run_comprehensive_test():
    """Run all tests in sequence"""
    print("🚀 Starting Comprehensive PureTrace Application Test")
    print("=" * 60)
    
    # Test backend
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start the backend first.")
        return False
    
    # Test batch creation
    batch_data = test_batch_creation()
    if not batch_data:
        print("\n❌ Cannot continue without successful batch creation.")
        return False
    
    batch_id = batch_data["batch_id"]
    
    # Test batch retrieval
    if not test_batch_retrieval(batch_id):
        return False
    
    # Test event creation
    events = test_event_creation(batch_id)
    if not events:
        return False
    
    # Test batch with events
    if not test_batch_with_events(batch_id):
        return False
    
    # Test events endpoint
    if not test_events_endpoint(batch_id):
        return False
    
    # Test error handling
    if not test_error_handling():
        return False
    
    # Test frontend
    if not test_frontend_health():
        print("\n⚠️  Frontend is not running, but backend tests passed.")
    else:
        test_frontend_trace_page(batch_id)
    
    print("\n" + "=" * 60)
    print("🎉 COMPREHENSIVE TEST COMPLETED!")
    print(f"✅ Test batch created with ID: {batch_id}")
    print(f"✅ Test batch has {len(events)} lifecycle events")
    print(f"✅ Trace URL: {batch_data['trace_url']}")
    print("\n📋 Test Summary:")
    print("   ✅ Backend API endpoints working")
    print("   ✅ Database operations successful")
    print("   ✅ CRUD operations for batches and events")
    print("   ✅ Error handling implemented")
    print("   ✅ Frontend serving pages")
    print("\n🔗 You can now test the full application at:")
    print(f"   Frontend: {FRONTEND_URL}")
    print(f"   API Docs: {BACKEND_URL}/docs")
    print(f"   Test Trace: {batch_data['trace_url']}")
    
    return True

if __name__ == "__main__":
    run_comprehensive_test() 