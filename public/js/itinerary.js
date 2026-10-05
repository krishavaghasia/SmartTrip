/**
 * ====================================================================
 * SmartTrip - Itinerary View & Interactive Management Logic
 * ====================================================================
 */

let activePlan = null;
let savedTripId = null;
let currentDayIndex = 1;

$(document).ready(function () {
  initItinerary();

  // Save Trip Button Click
  $('#btnSaveTrip').on('click', function () {
    saveTripToDatabase();
  });

  // Rainy Day / Alternative Plan Button Click
  $('#btnRainyDayPlan').on('click', function () {
    toggleRainyDayAlternative();
  });

  // Re-optimize route button click
  $('#btnReoptimizeRoute').on('click', function () {
    reoptimizeCurrentDayRoute();
  });

  // Print / Export Itinerary
  $('#btnPrintItinerary').on('click', function () {
    window.print();
  });

  // Add Activity Modal Form Submit
  $('#btnAddActivityForm').on('submit', function (e) {
    e.preventDefault();
    addNewActivityToCurrentDay();
  });

  // Edit Activity Modal Form Submit
  $('#btnSaveActivityEdit').on('click', function () {
    saveActivityEdit();
  });

  // Destination places search in Add Activity modal
  $('#modalPlaceSearch').on('input', function () {
    filterModalPlaces($(this).val());
  });
});

/**
 * Initialize Itinerary: Load from URL params or sessionStorage
 */
function initItinerary() {
  const urlParams = new URLSearchParams(window.location.search);
  const tripIdParam = urlParams.get('trip_id');

  if (tripIdParam) {
    // Load existing trip from API
    loadTripFromApi(tripIdParam);
  } else {
    // Load newly generated trip from sessionStorage
    const raw = sessionStorage.getItem('current_itinerary');
    if (raw) {
      try {
        activePlan = JSON.parse(raw);
        renderCompleteItinerary(activePlan);
      } catch (e) {
        loadDefaultAhmedabadTrip();
      }
    } else {
      loadDefaultAhmedabadTrip();
    }
  }
}

/**
 * Fetch trip by ID from backend
 */
function loadTripFromApi(tripId) {
  $.get(`/api/trips/${tripId}`, function (res) {
    if (res.success && res.data) {
      savedTripId = res.data.trip_id;
      activePlan = formatApiTripToPlan(res.data);
      renderCompleteItinerary(activePlan);
      $('#btnSaveTrip').html('<i class="bi bi-check-circle-fill me-1"></i> Saved to Cloud').addClass('btn-success').removeClass('btn-outline-primary');
    }
  }).fail(function () {
    showToast('Failed to load trip. Loading default demo plan.', 'warning');
    loadDefaultAhmedabadTrip();
  });
}

function loadDefaultAhmedabadTrip() {
  $.get('/api/trips/1', function (res) {
    if (res.success && res.data) {
      savedTripId = 1;
      activePlan = formatApiTripToPlan(res.data);
      renderCompleteItinerary(activePlan);
    }
  }).fail(function () {
    // Generate fresh Ahmedabad demo plan
    $.ajax({
      url: '/api/generate-itinerary',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        destination_id: 1,
        days: 2,
        budget: 5000,
        travelers: 2,
        transport: 'Public Transport',
        preferences: { History: 9, Food: 9, Culture: 8 }
      }),
      success: function (res) {
        if (res.success && res.data) {
          activePlan = res.data;
          renderCompleteItinerary(activePlan);
        }
      }
    });
  });
}

function formatApiTripToPlan(trip) {
  // Convert API trip structure to activePlan format
  const daysPlan = (trip.groupedDays || []).map(d => ({
    day: d.day,
    title: `Day ${d.day} - Sightseeing & Exploration`,
    activities: d.activities.map(a => ({
      itinerary_id: a.itinerary_id,
      day: a.day,
      place_id: a.place_id,
      place: {
        place_id: a.place_id,
        name: a.place_name,
        category: a.category,
        cost: a.cost,
        duration: a.duration,
        popularity: a.popularity,
        latitude: a.latitude,
        longitude: a.longitude,
        opening_time: a.opening_time,
        closing_time: a.closing_time,
        indoor_outdoor: a.indoor_outdoor,
        image_url: a.image_url,
        description: a.description
      },
      start_time: a.start_time,
      end_time: a.end_time,
      notes: a.notes
    })),
    dayRoute: {
      distanceKm: 14.5,
      travelTime: '45 min',
      legs: []
    }
  }));

  // Budget Analysis
  const allPlaces = [];
  daysPlan.forEach(d => d.activities.forEach(a => allPlaces.push(a.place)));

  return {
    destination: {
      destination_id: trip.destination_id,
      name: trip.destination_name,
      state: trip.destination_state,
      image_url: trip.destination_image
    },
    days: trip.duration_days || daysPlan.length || 2,
    travelers: trip.travelers || 2,
    budget: trip.budget || 5000,
    transport: trip.transport || 'Public Transport',
    startingLocation: trip.starting_location || 'Hotel',
    daysPlan,
    tripScore: trip.trip_score || 88,
    scoreMetrics: {
      budgetEfficiency: { percentage: 92, score: 23, max: 25 },
      preferenceMatch: { percentage: 94, score: 24, max: 25 },
      routeEfficiency: { percentage: 85, score: 21, max: 25 },
      timeUtilization: { percentage: 80, score: 20, max: 25 }
    },
    smartSuggestions: [
      'Your travel plan is well-balanced across budget, travel routes, and personal interests!'
    ],
    budgetAnalysis: {
      totalBudget: trip.budget || 5000,
      estimatedTotal: Math.round(trip.budget * 0.88),
      remainingBudget: Math.round(trip.budget * 0.12),
      utilizationPercentage: 88,
      breakdown: {
        transportation: 600,
        accommodation: 2200,
        food: 1200,
        activities: 300,
        miscellaneous: 250
      },
      suggestions: [
        { type: 'budget_healthy', message: `Your plan has ₹${Math.round(trip.budget * 0.12)} remaining buffer.` }
      ]
    },
    routeAnalysis: {
      totalDistanceKm: 24.2,
      formattedTotalTime: '1 hr 15 min',
      transportMode: trip.transport || 'Public Transport'
    }
  };
}

/**
 * Render Complete UI
 */
function renderCompleteItinerary(plan) {
  if (!plan) return;

  // 1. Header Banner
  const destName = plan.destination ? plan.destination.name : 'Selected Destination';
  $('#itineraryDestTitle').text(destName);
  $('#itinerarySubtitle').text(`${plan.days} Days • ₹${plan.budget.toLocaleString('en-IN')} Budget • ${plan.travelers} Travelers • ${plan.transport}`);

  if (plan.isRainyDayPlan) {
    $('#rainyDayBadge').show();
    $('#btnRainyDayPlan').html('<i class="bi bi-sun-fill me-1 text-warning"></i> Switch to Standard Plan').removeClass('btn-outline-primary').addClass('btn-outline-warning');
  } else {
    $('#rainyDayBadge').hide();
    $('#btnRainyDayPlan').html('<i class="bi bi-cloud-rain-fill me-1"></i> Generate Alternative Plan (Rainy Day)').addClass('btn-outline-primary').removeClass('btn-outline-warning');
  }

  // 2. Trip Score & Pillars
  renderTripScore(plan);

  // 3. Day Tabs and Timelines
  renderDayTabs(plan.daysPlan);
  renderDayTimeline(1);

  // 4. Budget Optimizer
  renderBudgetOptimizer(plan.budgetAnalysis, plan.budget);

  // 5. Route Optimizer View
  renderRouteOptimizerView(plan.routeAnalysis, plan.daysPlan);

  // 6. Recommended Places For You
  if (plan.recommendedPlaces) {
    renderRecommendedPlaces(plan.recommendedPlaces);
  } else {
    loadRecommendedPlaces(plan.destination ? plan.destination.destination_id : 1);
  }
}

/**
 * Render Trip Score Card & Pillars
 */
function renderTripScore(plan) {
  const score = plan.tripScore || 85;
  $('#tripScoreVal').text(score);

  const metrics = plan.scoreMetrics || {
    budgetEfficiency: { percentage: 90 },
    preferenceMatch: { percentage: 90 },
    routeEfficiency: { percentage: 85 },
    timeUtilization: { percentage: 80 }
  };

  $('#budgetScoreBar').css('width', `${metrics.budgetEfficiency.percentage}%`).text(`${metrics.budgetEfficiency.percentage}%`);
  $('#prefScoreBar').css('width', `${metrics.preferenceMatch.percentage}%`).text(`${metrics.preferenceMatch.percentage}%`);
  $('#routeScoreBar').css('width', `${metrics.routeEfficiency.percentage}%`).text(`${metrics.routeEfficiency.percentage}%`);
  $('#timeScoreBar').css('width', `${metrics.timeUtilization.percentage}%`).text(`${metrics.timeUtilization.percentage}%`);

  // Smart Suggestions
  const suggestions = plan.smartSuggestions || [];
  const container = $('#smartSuggestionsList');
  container.empty();

  suggestions.forEach(s => {
    container.append(`
      <div class="d-flex align-items-start gap-2 mb-2 small">
        <i class="bi bi-lightbulb-fill text-warning mt-1"></i>
        <span>${typeof s === 'string' ? s : s.message}</span>
      </div>
    `);
  });
}

/**
 * Render Day Tabs
 */
function renderDayTabs(daysPlan) {
  const container = $('#dayTabsNav');
  container.empty();

  daysPlan.forEach((d, idx) => {
    const dayNum = d.day;
    const isActive = dayNum === currentDayIndex ? 'active' : '';
    container.append(`
      <li class="nav-item">
        <button class="nav-link ${isActive} day-tab-btn fw-bold" data-day="${dayNum}">
          Day ${dayNum}
        </button>
      </li>
    `);
  });

  $('.day-tab-btn').on('click', function () {
    $('.day-tab-btn').removeClass('active');
    $(this).addClass('active');
    const dayNum = parseInt($(this).data('day'), 10);
    currentDayIndex = dayNum;
    renderDayTimeline(dayNum);
  });
}

/**
 * Render Timeline for Specific Day
 */
function renderDayTimeline(dayNum) {
  const dayData = activePlan.daysPlan.find(d => d.day === dayNum);
  const container = $('#dayTimelineContainer');
  container.empty();

  if (!dayData || !dayData.activities || dayData.activities.length === 0) {
    container.html(`
      <div class="text-center py-5 text-muted">
        <i class="bi bi-calendar-x fs-1"></i>
        <p class="mt-2">No activities scheduled for Day ${dayNum}.</p>
        <button class="btn btn-primary-smart btn-sm" onclick="openAddActivityModal(${dayNum})">
          <i class="bi bi-plus-circle me-1"></i> Add Activity
        </button>
      </div>
    `);
    return;
  }

  // Day route summary header
  const routeDist = dayData.dayRoute ? dayData.dayRoute.distanceKm : 12;
  const routeTime = dayData.dayRoute ? dayData.dayRoute.travelTime : '35 min';

  container.append(`
    <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded border">
      <div>
        <h5 class="mb-0 fw-bold">${dayData.title || `Day ${dayNum}`}</h5>
        <small class="text-muted"><i class="bi bi-pin-map me-1"></i> ${dayData.activities.length} Attractions • Est. Travel: ${routeDist} km (${routeTime})</small>
      </div>
      <button class="btn btn-outline-primary btn-sm" onclick="openAddActivityModal(${dayNum})">
        <i class="bi bi-plus-circle me-1"></i> Add Attraction
      </button>
    </div>
    <div class="timeline-container" id="timelineList"></div>
  `);

  const list = $('#timelineList');

  dayData.activities.forEach((act, idx) => {
    const place = act.place || {};
    const startTimeFormatted = formatTimeString(act.start_time);
    const endTimeFormatted = formatTimeString(act.end_time);

    const isIndoor = place.indoor_outdoor === 'indoor';
    const indoorBadge = isIndoor
      ? '<span class="badge bg-info text-dark"><i class="bi bi-umbrella me-1"></i>Indoor</span>'
      : '<span class="badge bg-secondary"><i class="bi bi-sun me-1"></i>Outdoor</span>';

    list.append(`
      <div class="timeline-item" data-id="${act.itinerary_id || idx}" data-idx="${idx}">
        <div class="timeline-node">${idx + 1}</div>
        <div class="timeline-card">
          <div class="row g-3">
            <div class="col-md-3">
              <img src="${place.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'}" 
                   class="rounded w-100 h-100 object-fit-cover" style="min-height: 120px;" alt="${place.name}">
            </div>
            <div class="col-md-9">
              <div class="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                <div>
                  <span class="timeline-time-badge mb-1">
                    <i class="bi bi-clock"></i> ${startTimeFormatted} – ${endTimeFormatted}
                  </span>
                  <h5 class="fw-bold mb-1">${place.name}</h5>
                </div>
                <div class="d-flex gap-1">
                  <button class="btn btn-light btn-sm border" title="Move Up" onclick="moveActivity(${dayNum}, ${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>
                    <i class="bi bi-arrow-up"></i>
                  </button>
                  <button class="btn btn-light btn-sm border" title="Move Down" onclick="moveActivity(${dayNum}, ${idx}, 1)" ${idx === dayData.activities.length - 1 ? 'disabled' : ''}>
                    <i class="bi bi-arrow-down"></i>
                  </button>
                  <button class="btn btn-light btn-sm border text-primary" title="Edit Activity" onclick="openEditActivityModal(${dayNum}, ${idx})">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-light btn-sm border text-danger" title="Delete" onclick="deleteActivity(${dayNum}, ${idx})">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="badge bg-primary-light text-primary fw-bold"><i class="bi bi-tag me-1"></i>${place.category || 'Sightseeing'}</span>
                ${indoorBadge}
                <span class="badge bg-light text-dark border"><i class="bi bi-cash me-1"></i>${place.cost > 0 ? '₹' + place.cost : 'Free'}</span>
                <span class="badge bg-light text-dark border"><i class="bi bi-hourglass-split me-1"></i>${place.duration || 2} hrs</span>
                <span class="badge bg-warning text-dark"><i class="bi bi-star-fill me-1"></i>${place.popularity || 9}/10</span>
              </div>

              <p class="text-muted small mb-2">${place.description || ''}</p>
              ${act.notes ? `<div class="small text-primary fst-italic"><i class="bi bi-chat-left-quote me-1"></i>${act.notes}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `);
  });
}

function formatTimeString(timeStr) {
  if (!timeStr) return '09:00 AM';
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h < 10 ? '0' + h : h}:${m} ${ampm}`;
}

/**
 * Render Budget Optimizer Section
 */
function renderBudgetOptimizer(analysis, totalBudget) {
  const budget = totalBudget || 5000;
  const total = analysis ? analysis.estimatedTotal : Math.round(budget * 0.9);
  const rem = analysis ? analysis.remainingBudget : (budget - total);
  const pct = analysis ? analysis.utilizationPercentage : Math.round((total / budget) * 100);

  $('#budgetTotalDisplay').text('₹' + budget.toLocaleString('en-IN'));
  $('#budgetEstTotalDisplay').text('₹' + total.toLocaleString('en-IN'));
  $('#budgetRemainingDisplay').text('₹' + Math.max(0, rem).toLocaleString('en-IN'));

  const bar = $('#budgetProgressBar');
  bar.css('width', `${Math.min(100, pct)}%`).text(`${pct}% Utilized`);

  if (analysis && analysis.isOverBudget) {
    bar.addClass('bg-danger').removeClass('bg-primary');
    $('#budgetOverAlert').show().html(`
      <div class="alert alert-danger d-flex align-items-center gap-2 mb-0">
        <i class="bi bi-exclamation-triangle-fill fs-4"></i>
        <div>
          <strong>Budget Alert:</strong> Your itinerary exceeds your allocated budget by <strong>₹${analysis.deficit.toLocaleString('en-IN')}</strong>.
        </div>
      </div>
    `);
  } else {
    bar.addClass('bg-primary').removeClass('bg-danger');
    $('#budgetOverAlert').hide();
  }

  // Breakdown Cards
  const bd = analysis ? analysis.breakdown : { transportation: 600, accommodation: 2200, food: 1200, activities: 350, miscellaneous: 250 };
  $('#costTransport').text('₹' + (bd.transportation || 0).toLocaleString('en-IN'));
  $('#costAccommodation').text('₹' + (bd.accommodation || 0).toLocaleString('en-IN'));
  $('#costFood').text('₹' + (bd.food || 0).toLocaleString('en-IN'));
  $('#costActivities').text('₹' + (bd.activities || 0).toLocaleString('en-IN'));
  $('#costMisc').text('₹' + (bd.miscellaneous || 0).toLocaleString('en-IN'));

  // Saving Suggestions
  const suggestionsContainer = $('#budgetSavingSuggestions');
  suggestionsContainer.empty();

  if (analysis && analysis.suggestions && analysis.suggestions.length > 0) {
    analysis.suggestions.forEach(s => {
      const isSaving = s.estimatedSaving > 0;
      suggestionsContainer.append(`
        <div class="p-2 border rounded bg-light mb-2 d-flex justify-content-between align-items-center">
          <div class="small">
            <i class="bi ${isSaving ? 'bi-piggy-bank text-success' : 'bi-check-circle text-primary'} me-2"></i>
            ${s.message}
          </div>
          ${isSaving ? `<span class="badge bg-success">Save ₹${s.estimatedSaving}</span>` : ''}
        </div>
      `);
    });
  }
}

/**
 * Render Route Optimizer View
 */
function renderRouteOptimizerView(routeAnalysis, daysPlan) {
  const currentDayData = daysPlan.find(d => d.day === currentDayIndex) || daysPlan[0];
  if (!currentDayData) return;

  const dist = currentDayData.dayRoute ? currentDayData.dayRoute.distanceKm : (routeAnalysis ? routeAnalysis.totalDistanceKm : 24);
  const time = currentDayData.dayRoute ? currentDayData.dayRoute.travelTime : (routeAnalysis ? routeAnalysis.formattedTotalTime : '1 hr 15 min');

  $('#routeTotalDist').text(`${dist} km`);
  $('#routeTotalTime').text(time);
  $('#routeTransportBadge').text(routeAnalysis ? routeAnalysis.transportMode : 'Public Transport');

  const flow = $('#routeFlowDiagram');
  flow.empty();

  flow.append(`
    <span class="route-stop bg-primary text-white"><i class="bi bi-geo-alt-fill me-1"></i> Start / Hotel</span>
  `);

  currentDayData.activities.forEach(act => {
    flow.append(`
      <i class="bi bi-arrow-right route-arrow"></i>
      <span class="route-stop">${act.place ? act.place.name : 'Attraction'}</span>
    `);
  });

  flow.append(`
    <i class="bi bi-arrow-right route-arrow"></i>
    <span class="route-stop bg-secondary text-white"><i class="bi bi-house-door-fill me-1"></i> Hotel</span>
  `);
}

/**
 * Re-Optimize Current Day Route with Nearest Neighbor Algorithm
 */
function reoptimizeCurrentDayRoute() {
  const currentDayData = activePlan.daysPlan.find(d => d.day === currentDayIndex);
  if (!currentDayData || currentDayData.activities.length <= 1) {
    showToast('At least 2 places needed for route optimization.', 'info');
    return;
  }

  const places = currentDayData.activities.map(a => a.place);

  $('#btnReoptimizeRoute').html('<span class="spinner-border spinner-border-sm me-1"></span> Optimizing...').prop('disabled', true);

  $.ajax({
    url: '/api/optimize-route',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      places: places,
      transport: activePlan.transport || 'Public Transport'
    }),
    success: function (res) {
      $('#btnReoptimizeRoute').html('<i class="bi bi-arrow-repeat me-1"></i> Re-Optimize Route').prop('disabled', false);
      if (res.success && res.data) {
        // Re-assign ordered places
        const TIME_SLOTS = [
          { start: '09:00:00', end: '11:00:00' },
          { start: '11:30:00', end: '13:00:00' },
          { start: '14:30:00', end: '17:00:00' },
          { start: '17:30:00', end: '19:30:00' },
          { start: '19:30:00', end: '21:30:00' }
        ];

        currentDayData.activities = res.data.orderedPlaces.map((pl, idx) => {
          const slot = TIME_SLOTS[idx % TIME_SLOTS.length];
          return {
            day: currentDayIndex,
            place_id: pl.place_id,
            place: pl,
            start_time: slot.start,
            end_time: slot.end,
            notes: pl.reasons ? pl.reasons[0] : `${pl.category} visit`
          };
        });

        currentDayData.dayRoute = {
          distanceKm: res.data.totalDistanceKm,
          travelTime: res.data.formattedTime,
          legs: res.data.legs
        };

        renderDayTimeline(currentDayIndex);
        renderRouteOptimizerView(activePlan.routeAnalysis, activePlan.daysPlan);
        showToast(`Route optimized! Shortest path: ${res.data.totalDistanceKm} km (${res.data.formattedTime})`, 'success');
      }
    },
    error: function () {
      $('#btnReoptimizeRoute').html('<i class="bi bi-arrow-repeat me-1"></i> Re-Optimize Route').prop('disabled', false);
      showToast('Error running route optimization algorithm.', 'danger');
    }
  });
}

/**
 * Toggle Rainy Day / Alternative Plan
 */
function toggleRainyDayAlternative() {
  const isCurrentlyRainy = activePlan.isRainyDayPlan;
  const destId = activePlan.destination ? activePlan.destination.destination_id : 1;

  $('#btnRainyDayPlan').html('<span class="spinner-border spinner-border-sm me-1"></span> Generating Indoor Backup...').prop('disabled', true);

  $.ajax({
    url: '/api/generate-itinerary',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      destination_id: destId,
      days: activePlan.days,
      budget: activePlan.budget,
      travelers: activePlan.travelers,
      transport: activePlan.transport,
      is_rainy_day: !isCurrentlyRainy
    }),
    success: function (res) {
      $('#btnRainyDayPlan').prop('disabled', false);
      if (res.success && res.data) {
        activePlan = res.data;
        sessionStorage.setItem('current_itinerary', JSON.stringify(activePlan));
        renderCompleteItinerary(activePlan);

        if (!isCurrentlyRainy) {
          showToast('☔ Alternative Rainy Day plan generated! Switched to indoor attractions, museums & cafes.', 'info');
        } else {
          showToast('☀️ Reverted to standard outdoor & panoramic travel plan!', 'success');
        }
      }
    },
    error: function () {
      $('#btnRainyDayPlan').prop('disabled', false);
      showToast('Failed to generate alternative plan.', 'danger');
    }
  });
}

/**
 * Save Current Trip to MySQL
 */
function saveTripToDatabase() {
  if (!activePlan) return;

  const btn = $('#btnSaveTrip');
  btn.html('<span class="spinner-border spinner-border-sm me-1"></span> Saving to MySQL...').prop('disabled', true);

  // Flatten all activities
  const allItinerary = [];
  activePlan.daysPlan.forEach(d => {
    d.activities.forEach((a, seq) => {
      allItinerary.push({
        day: d.day,
        place_id: a.place_id || (a.place ? a.place.place_id : 1),
        start_time: a.start_time,
        end_time: a.end_time,
        sequence: seq + 1,
        notes: a.notes || ''
      });
    });
  });

  const today = new Date().toISOString().split('T')[0];
  const payload = {
    destination_id: activePlan.destination ? activePlan.destination.destination_id : 1,
    title: `${activePlan.destination ? activePlan.destination.name : 'Smart'} ${activePlan.days}-Day Itinerary`,
    start_date: today,
    end_date: today,
    budget: activePlan.budget,
    travelers: activePlan.travelers,
    transport: activePlan.transport,
    starting_location: activePlan.startingLocation,
    trip_score: activePlan.tripScore,
    itinerary: allItinerary,
    expenses: [
      { category: 'Transportation', amount: activePlan.budgetAnalysis.breakdown.transportation, description: 'Travel & transit' },
      { category: 'Accommodation', amount: activePlan.budgetAnalysis.breakdown.accommodation, description: 'Hotel stay' },
      { category: 'Food', amount: activePlan.budgetAnalysis.breakdown.food, description: 'Meals & dining' },
      { category: 'Activities', amount: activePlan.budgetAnalysis.breakdown.activities, description: 'Tickets & entrance' }
    ]
  };

  $.ajax({
    url: '/api/trips',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: function (res) {
      btn.html('<i class="bi bi-check-circle-fill me-1"></i> Saved to Cloud').addClass('btn-success').removeClass('btn-outline-primary').prop('disabled', false);
      showToast('Trip successfully saved to MySQL database!', 'success');
      savedTripId = res.trip_id;
    },
    error: function () {
      btn.html('<i class="bi bi-cloud-arrow-up me-1"></i> Save Trip').prop('disabled', false);
      showToast('Error saving trip to database.', 'danger');
    }
  });
}

/**
 * Move Activity Up or Down in sequence
 */
function moveActivity(dayNum, index, direction) {
  const dayData = activePlan.daysPlan.find(d => d.day === dayNum);
  if (!dayData) return;

  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= dayData.activities.length) return;

  // Swap activities
  const temp = dayData.activities[index];
  dayData.activities[index] = dayData.activities[targetIndex];
  dayData.activities[targetIndex] = temp;

  // Swap start and end times to keep time order
  const tStart = dayData.activities[index].start_time;
  const tEnd = dayData.activities[index].end_time;
  dayData.activities[index].start_time = dayData.activities[targetIndex].start_time;
  dayData.activities[index].end_time = dayData.activities[targetIndex].end_time;
  dayData.activities[targetIndex].start_time = tStart;
  dayData.activities[targetIndex].end_time = tEnd;

  renderDayTimeline(dayNum);
  renderRouteOptimizerView(activePlan.routeAnalysis, activePlan.daysPlan);
  showToast('Activity order updated.', 'info');
}

/**
 * Delete Activity from Day
 */
function deleteActivity(dayNum, index) {
  if (!confirm('Are you sure you want to remove this activity from Day ' + dayNum + '?')) return;

  const dayData = activePlan.daysPlan.find(d => d.day === dayNum);
  if (!dayData) return;

  const removed = dayData.activities.splice(index, 1)[0];
  renderDayTimeline(dayNum);

  // Recalculate budget analysis
  recalculateBudgetAndScore();
  showToast(`Removed "${removed.place ? removed.place.name : 'Activity'}".`, 'info');
}

function recalculateBudgetAndScore() {
  const allPlaces = [];
  activePlan.daysPlan.forEach(d => d.activities.forEach(a => { if (a.place) allPlaces.push(a.place); }));

  $.ajax({
    url: '/api/budget-optimize',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      total_budget: activePlan.budget,
      days: activePlan.days,
      travelers: activePlan.travelers,
      transport: activePlan.transport,
      places: allPlaces,
      destination_id: activePlan.destination ? activePlan.destination.destination_id : 1
    }),
    success: function (res) {
      if (res.success && res.data) {
        activePlan.budgetAnalysis = res.data;
        renderBudgetOptimizer(activePlan.budgetAnalysis, activePlan.budget);
      }
    }
  });
}

/**
 * Edit Activity Modal
 */
let editingDay = 1;
let editingIndex = 0;

function openEditActivityModal(dayNum, index) {
  editingDay = dayNum;
  editingIndex = index;

  const dayData = activePlan.daysPlan.find(d => d.day === dayNum);
  const act = dayData.activities[index];

  $('#modalEditPlaceName').text(act.place ? act.place.name : 'Activity');
  $('#modalEditStartTime').val(act.start_time || '09:00:00');
  $('#modalEditEndTime').val(act.end_time || '11:00:00');
  $('#modalEditNotes').val(act.notes || '');

  const modal = new bootstrap.Modal(document.getElementById('editActivityModal'));
  modal.show();
}

function saveActivityEdit() {
  const dayData = activePlan.daysPlan.find(d => d.day === editingDay);
  if (!dayData) return;

  const act = dayData.activities[editingIndex];
  act.start_time = $('#modalEditStartTime').val();
  act.end_time = $('#modalEditEndTime').val();
  act.notes = $('#modalEditNotes').val();

  // If item exists in DB, update via API
  if (act.itinerary_id) {
    $.ajax({
      url: `/api/itinerary/${act.itinerary_id}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        start_time: act.start_time,
        end_time: act.end_time,
        notes: act.notes
      })
    });
  }

  bootstrap.Modal.getInstance(document.getElementById('editActivityModal')).hide();
  renderDayTimeline(editingDay);
  showToast('Activity schedule updated!', 'success');
}

/**
 * Add Activity Modal
 */
let modalAddingDay = 1;
let availablePlacesForAdd = [];

function openAddActivityModal(dayNum) {
  modalAddingDay = dayNum;
  $('#modalAddDayNum').text(`Day ${dayNum}`);

  const destId = activePlan.destination ? activePlan.destination.destination_id : 1;
  $.get(`/api/places?destination_id=${destId}`, function (res) {
    if (res.success && res.data) {
      availablePlacesForAdd = res.data;
      renderModalPlaces(res.data);
      const modal = new bootstrap.Modal(document.getElementById('addActivityModal'));
      modal.show();
    }
  });
}

function renderModalPlaces(placesList) {
  const container = $('#modalPlacesList');
  container.empty();

  if (placesList.length === 0) {
    container.html('<div class="text-center py-4 text-muted">No attractions found.</div>');
    return;
  }

  placesList.forEach(pl => {
    container.append(`
      <div class="col-md-6 mb-2">
        <div class="border rounded p-2 d-flex justify-content-between align-items-center bg-white">
          <div>
            <span class="fw-bold d-block text-secondary">${pl.name}</span>
            <small class="text-muted">${pl.category} • ₹${pl.cost} • ${pl.duration}h</small>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm" onclick="selectPlaceToAdd(${pl.place_id})">
            <i class="bi bi-plus"></i> Add
          </button>
        </div>
      </div>
    `);
  });
}

function filterModalPlaces(query) {
  const q = (query || '').toLowerCase();
  const filtered = availablePlacesForAdd.filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
  renderModalPlaces(filtered);
}

function selectPlaceToAdd(placeId) {
  const place = availablePlacesForAdd.find(p => p.place_id === placeId);
  if (!place) return;

  const dayData = activePlan.daysPlan.find(d => d.day === modalAddingDay);
  if (!dayData) return;

  const newActivity = {
    day: modalAddingDay,
    place_id: place.place_id,
    place: place,
    start_time: '16:00:00',
    end_time: '18:00:00',
    notes: `${place.category} visit`
  };

  dayData.activities.push(newActivity);

  bootstrap.Modal.getInstance(document.getElementById('addActivityModal')).hide();
  renderDayTimeline(modalAddingDay);
  recalculateBudgetAndScore();
  showToast(`Added "${place.name}" to Day ${modalAddingDay}!`, 'success');
}

/**
 * Render Recommended Places Cards
 */
function renderRecommendedPlaces(places) {
  const container = $('#recommendedPlacesContainer');
  if (!container.length) return;
  container.empty();

  places.slice(0, 4).forEach(pl => {
    const reasons = pl.reasons || ['Top-rated landmark for your interests'];
    container.append(`
      <div class="col-md-6 col-lg-3 mb-3">
        <div class="smart-card h-100">
          <div style="height: 140px; overflow: hidden;">
            <img src="${pl.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80'}" class="w-100 h-100 object-fit-cover" alt="${pl.name}">
          </div>
          <div class="p-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="badge bg-primary">${pl.category}</span>
              <span class="fw-bold text-success"><i class="bi bi-star-fill text-warning me-1"></i>${pl.recommendationScore || 9.2}/10 Match</span>
            </div>
            <h6 class="fw-bold mb-1">${pl.name}</h6>
            <div class="small text-muted mb-2"><i class="bi bi-cash me-1"></i>₹${pl.cost} • <i class="bi bi-clock me-1"></i>${pl.duration} hrs</div>
            <div class="small text-secondary bg-light p-2 rounded">
              <strong>Why Recommended:</strong>
              <ul class="mb-0 ps-3 mt-1">
                ${reasons.map(r => `<li>${r}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `);
  });
}

function loadRecommendedPlaces(destId) {
  $.get(`/api/recommendations?destination_id=${destId}&budget=${activePlan.budget || 5000}`, function (res) {
    if (res.success && res.data) {
      renderRecommendedPlaces(res.data);
    }
  });
}
