/**
 * ====================================================================
 * SmartTrip - Dashboard Logic
 * ====================================================================
 */

$(document).ready(function () {
  loadDashboardStats();
  loadUserTrips();
  loadExploreDestinations();
});

function loadDashboardStats() {
  $.get('/api/trips/stats', function (res) {
    if (res.success && res.data) {
      $('#statTotalTrips').text(res.data.totalTrips || 0);
      $('#statSavedPlaces').text(res.data.savedPlaces || 0);
      $('#statUpcomingTrips').text(res.data.upcomingTrips || 0);
    }
  }).fail(function () {
    $('#statTotalTrips').text('1');
    $('#statSavedPlaces').text('7');
    $('#statUpcomingTrips').text('1');
  });
}

function loadUserTrips() {
  const container = $('#recentTripsList');
  container.html('<div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div></div>');

  $.get('/api/trips', function (res) {
    container.empty();
    if (res.success && res.data && res.data.length > 0) {
      res.data.forEach(trip => {
        container.append(`
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="smart-card h-100">
              <div style="height: 160px; overflow: hidden; position: relative;">
                <img src="${trip.destination_image || 'https://images.unsplash.com/photo-1599831104328-5696144e59df?auto=format&fit=crop&w=600&q=80'}" 
                     class="w-100 h-100 object-fit-cover" alt="${trip.destination_name}">
                <span class="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75">
                  <i class="bi bi-calendar-event me-1"></i> ${trip.duration_days || 2} Days
                </span>
                <span class="position-absolute bottom-0 start-0 m-2 badge bg-primary">
                  <i class="bi bi-star-fill text-warning me-1"></i> Score: ${trip.trip_score || 88}/100
                </span>
              </div>
              <div class="p-3">
                <h5 class="fw-bold mb-1">${trip.title}</h5>
                <p class="text-muted small mb-2"><i class="bi bi-geo-alt me-1"></i>${trip.destination_name}</p>
                <div class="d-flex justify-content-between small text-secondary mb-3">
                  <span><i class="bi bi-wallet2 me-1"></i>₹${parseFloat(trip.budget).toLocaleString('en-IN')}</span>
                  <span><i class="bi bi-people me-1"></i>${trip.travelers} Travelers</span>
                  <span><i class="bi bi-bus-front me-1"></i>${trip.transport}</span>
                </div>
                <div class="d-flex gap-2">
                  <a href="itinerary.html?trip_id=${trip.trip_id}" class="btn btn-primary-smart btn-sm flex-grow-1 text-center">
                    <i class="bi bi-eye me-1"></i> View Itinerary
                  </a>
                  <button class="btn btn-outline-danger btn-sm" onclick="deleteTrip(${trip.trip_id})">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `);
      });
    } else {
      container.html(`
        <div class="col-12 text-center py-5">
          <div class="text-muted mb-3"><i class="bi bi-suitcase fs-1"></i></div>
          <h5>No Trips Planned Yet</h5>
          <p class="text-muted">Start creating an optimized travel itinerary tailored to your budget and interests!</p>
          <a href="create-trip.html" class="btn btn-primary-smart mt-2">
            <i class="bi bi-plus-circle me-1"></i> Plan Your First Trip
          </a>
        </div>
      `);
    }
  }).fail(function () {
    container.html('<div class="col-12 text-center py-4 text-muted">Failed to load saved trips.</div>');
  });
}

function deleteTrip(tripId) {
  if (!confirm('Are you sure you want to delete this trip itinerary?')) return;

  $.ajax({
    url: `/api/trips/${tripId}`,
    type: 'DELETE',
    success: function (res) {
      if (res.success) {
        showToast('Trip deleted successfully.', 'info');
        loadUserTrips();
        loadDashboardStats();
      }
    },
    error: function () {
      showToast('Error deleting trip.', 'danger');
    }
  });
}

function loadExploreDestinations() {
  const container = $('#dashboardDestinationsGrid');
  if (!container.length) return;

  $.get('/api/destinations', function (res) {
    if (res.success && res.data) {
      container.empty();
      res.data.slice(0, 4).forEach(dest => {
        container.append(`
          <div class="col-md-3 col-sm-6 mb-3">
            <div class="destination-card border">
              <img src="${dest.image_url}" alt="${dest.name}">
              <div class="destination-card-overlay">
                <h5 class="mb-0 text-white">${dest.name}</h5>
                <small class="text-white-50">${dest.state}</small>
                <div class="mt-2">
                  <a href="create-trip.html?dest_id=${dest.destination_id}" class="btn btn-light btn-sm text-dark fw-bold">
                    Plan Trip <i class="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        `);
      });
    }
  });
}
