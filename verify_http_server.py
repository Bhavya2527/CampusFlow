"""
Verifies that index.html and all ES modules are properly served over HTTP.
"""

import http.server
import socketserver
import threading
import urllib.request
import time
import sys
import os

PORT = 3456
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    def log_message(self, format, *args):
        pass # Suppress noisy log outputs during testing

def run_test():
    socketserver.TCPServer.allow_reuse_address = True
    server = socketserver.TCPServer(("", PORT), QuietHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    time.sleep(0.5)

    base_url = f"http://localhost:{PORT}"
    endpoints_to_test = [
        "/",
        "/index.html",
        "/src/app.js",
        "/src/styles/design-tokens.css",
        "/src/api/contracts.js",
        "/src/api/mockData.js",
        "/src/api/rideService.js",
        "/src/components/shared/Icons.js",
        "/src/components/shared/Badge.js",
        "/src/components/shared/Button.js",
        "/src/components/shared/Card.js",
        "/src/components/shared/Input.js",
        "/src/components/shared/Modal.js",
        "/src/components/shared/Toast.js",
        "/src/components/shared/Tabs.js",
        "/src/components/shared/Header.js",
        "/src/modules/booking/StudentDashboard.js",
        "/src/modules/booking/RideSearch.js",
        "/src/modules/booking/RideCard.js",
        "/src/modules/booking/RouteDemandPreview.js",
        "/src/modules/booking/AdvanceBookingCalendar.js",
        "/src/modules/booking/DepartureTimeSelector.js",
        "/src/modules/booking/BookingConfirmModal.js",
        "/src/modules/booking/CancellationModal.js",
        "/src/modules/booking/DriverDetailsModal.js",
        "/src/modules/booking/MyBookings.js"
    ]

    all_passed = True
    for ep in endpoints_to_test:
        url = base_url + ep
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req, timeout=5) as resp:
                status = resp.status
                length = len(resp.read())
                if status == 200 and length > 0:
                    print(f"  ✓ {ep:<48} [200 OK, {length} bytes]")
                else:
                    print(f"  ✗ {ep} returned status {status} or empty response")
                    all_passed = False
        except Exception as e:
            print(f"  ✗ Error fetching {ep}: {e}")
            all_passed = False

    server.shutdown()
    server.server_close()

    if all_passed:
        print("\n🎉 ALL HTTP ASSET ENDPOINTS SERVED SUCCESSFULLY WITH HTTP 200!")
        sys.exit(0)
    else:
        print("\n❌ Some HTTP endpoints failed.")
        sys.exit(1)

if __name__ == "__main__":
    run_test()
