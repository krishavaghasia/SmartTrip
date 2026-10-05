/**
 * ====================================================================
 * SmartTrip - Trip Planning Wizard Logic
 * ====================================================================
 */

let currentStep = 1;
const totalSteps = 4;
let loadedDestinations = [];

// Default Interest list with icons
const INTEREST_CATEGORIES = [
  { name: 'Nature', icon: 'bi-tree', defaultWeight: 8 },
  { name: 'History', icon: 'bi-bank', defaultWeight: 9 },
  { name: 'Adventure', icon: 'bi-compass', defaultWeight: 7 },
  { name: 'Food', icon: 'bi-egg-fried', defaultWeight: 9 },
  { name: 'Shopping', icon: 'bi-bag', defaultWeight: 7 },
  { name: 'Photography', icon: 'bi-camera', defaultWeight: 8 },
  { name: 'Culture', icon: 'bi-palette', defaultWeight: 8 },
  { name: 'Religious', icon: 'bi-peace', defaultWeight: 7 },
  { name: 'Nightlife', icon: 'bi-moon-stars', defaultWeight: 6 },
  { name: 'Relaxation', icon: 'bi-water', defaultWeight: 8 }
];

// Additional Group Travelers state
let groupTravelersList = [
  { id: 1, name: 'Traveler 1 (You)', interests: ['History', 'Food', 'Culture'] }
];

$(document).ready(function () {
  loadDestinations();
  renderInterestCards();
  renderGroupTravelers();
  initDateDefaults();

  // Wizard Step Navigation
  $('#btnNextStep').on('click', function () {
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1);
    }
  });

  $('#btnPrevStep').on('click', function () {
    goToStep(currentStep - 1);
  });

  // Calculate Group Consensus Button
  $('#btnCalcGroup').on('click', function () {
    calculateGroupConsensus();
  });

  // Add Group Member
  $('#btnAddTraveler').on('click', function () {
    const nextId = groupTravelersList.length + 1;
    groupTravelersList.push({
      id: nextId,
      name: `Traveler ${nextId}`,
      interests: ['Food', 'Nature']
    });
    renderGroupTravelers();
    showToast(`Added Traveler ${nextId}. Select their preferences!`, 'info');
  });

  // Wizard Form Submission
  $('#tripWizardForm').on('submit', function (e) {
    e.preventDefault();
    generateSmartItinerary();
  });
});

// Load Predefined Destinations from MySQL API
function loadDestinations() {
  $.get('/api/destinations', function (res) {
    if (res.success && res.data) {
      loadedDestinations = res.data;
      const select = $('#destinationSelect');
      select.empty();
      select.append('<option value="" disabled selected>-- Choose a Destination --</option>');

      res.data.forEach(dest => {
        select.append(`
          <option value="${dest.destination_id}" data-name="${dest.name}">
            ${dest.name}, ${dest.state} (${dest.total_places || 10}+ attractions)
          </option>
        `);
      });

      // Destination card selection previews
      renderDestinationPreviews(res.data);
    }
  }).fail(function () {
    showToast('Failed to load destinations. Check server connection.', 'danger');
  });
}

function renderDestinationPreviews(destinations) {
  const container = $('#destinationCardsContainer');
  if (!container.length) return;
  container.empty();

  destinations.forEach(dest => {
    container.append(`
      <div class="col-md-4 col-sm-6 mb-3">
        <div class="destination-card border cursor-pointer select-dest-card" data-id="${dest.destination_id}">
          <img src="${dest.image_url}" alt="${dest.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';">
          <div class="destination-card-overlay">
            <h5 class="mb-1 text-white">${dest.name}</h5>
            <small class="text-white-50"><i class="bi bi-geo-alt me-1"></i>${dest.state}</small>
            <div class="mt-2">
              <span class="badge bg-primary">${dest.best_time_to_visit || 'Best: Oct-Mar'}</span>
            </div>
          </div>
        </div>
      </div>
    `);
  });

  // Click card to select
  $('.select-dest-card').on('click', function () {
    $('.select-dest-card').removeClass('border-primary shadow-lg').css('border-width', '1px');
    $(this).addClass('border-primary shadow-lg').css('border-width', '3px');
    const id = $(this).data('id');
    $('#destinationSelect').val(id).trigger('change');
  });
}

// Render Checkboxes and Weights for Interests
function renderInterestCards() {
  const container = $('#interestsGrid');
  if (!container.length) return;
  container.empty();

  INTEREST_CATEGORIES.forEach(item => {
    const isDefaultSelected = ['History', 'Food', 'Culture'].includes(item.name);
    container.append(`
      <div class="col-md-4 col-sm-6 mb-3">
        <div class="interest-card-item ${isDefaultSelected ? 'selected' : ''}" data-category="${item.name}">
          <input type="checkbox" name="interests" value="${item.name}" ${isDefaultSelected ? 'checked' : ''}>
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <i class="bi ${item.icon} text-primary fs-4"></i>
              <span class="fw-bold">${item.name}</span>
            </div>
            <span class="badge ${isDefaultSelected ? 'bg-primary' : 'bg-light text-muted'} check-badge">
              <i class="bi ${isDefaultSelected ? 'bi-check-lg' : 'bi-plus'}"></i>
            </span>
          </div>
          <div class="interest-weight-slider mt-2">
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>Preference Weight:</span>
              <span class="fw-bold weight-val" id="weightVal_${item.name}">${item.defaultWeight}/10</span>
            </div>
            <input type="range" class="form-range interest-slider" min="1" max="10" value="${item.defaultWeight}" data-category="${item.name}">
          </div>
        </div>
      </div>
    `);
  });

  // Toggle card selection
  $('.interest-card-item').on('click', function (e) {
    if ($(e.target).is('input[type="range"]')) return; // ignore slider drag
    const checkbox = $(this).find('input[type="checkbox"]');
    const isChecked = !checkbox.prop('checked');
    checkbox.prop('checked', isChecked);

    if (isChecked) {
      $(this).addClass('selected');
      $(this).find('.check-badge').removeClass('bg-light text-muted').addClass('bg-primary').html('<i class="bi bi-check-lg"></i>');
    } else {
      $(this).removeClass('selected');
      $(this).find('.check-badge').removeClass('bg-primary').addClass('bg-light text-muted').html('<i class="bi bi-plus"></i>');
    }
  });

  // Slider change
  $('.interest-slider').on('input', function () {
    const cat = $(this).data('category');
    const val = $(this).val();
    $(`#weightVal_${cat}`).text(`${val}/10`);
  });
}

// Render Group Travelers
function renderGroupTravelers() {
  const container = $('#groupTravelersList');
  if (!container.length) return;
  container.empty();

  groupTravelersList.forEach((trav, index) => {
    let pills = '';
    INTEREST_CATEGORIES.forEach(cat => {
      const isSelected = trav.interests.includes(cat.name);
      pills += `
        <span class="badge ${isSelected ? 'bg-primary' : 'bg-light text-secondary border'} cursor-pointer traveler-tag me-1 mb-1" 
              data-traveler="${trav.id}" data-category="${cat.name}">
          ${cat.name}
        </span>
      `;
    });

    container.append(`
      <div class="border rounded p-3 mb-2 bg-light">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold text-secondary"><i class="bi bi-person me-1"></i> ${trav.name}</span>
          ${index > 0 ? `<button type="button" class="btn btn-outline-danger btn-sm py-0 px-2 btn-remove-traveler" data-id="${trav.id}"><i class="bi bi-trash"></i></button>` : ''}
        </div>
        <div class="small text-muted mb-1">Interests for ${trav.name}:</div>
        <div class="d-flex flex-wrap">${pills}</div>
      </div>
    `);
  });

  // Toggle traveler interest pills
  $('.traveler-tag').on('click', function () {
    const travelerId = $(this).data('traveler');
    const cat = $(this).data('category');
    const trav = groupTravelersList.find(t => t.id === travelerId);
    if (!trav) return;

    if (trav.interests.includes(cat)) {
      trav.interests = trav.interests.filter(c => c !== cat);
      $(this).removeClass('bg-primary').addClass('bg-light text-secondary border');
    } else {
      trav.interests.push(cat);
      $(this).removeClass('bg-light text-secondary border').addClass('bg-primary');
    }
  });

  // Remove traveler
  $('.btn-remove-traveler').on('click', function () {
    const id = $(this).data('id');
    groupTravelersList = groupTravelersList.filter(t => t.id !== id);
    renderGroupTravelers();
  });
}

// Calculate combined group consensus via AJAX
function calculateGroupConsensus() {
  $.ajax({
    url: '/api/group-preferences',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ travelers: groupTravelersList }),
    success: function (res) {
      if (res.success && res.data) {
        renderConsensusResults(res.data.rankedInterests);
        showToast('Group consensus preferences calculated!', 'success');
      }
    },
    error: function () {
      showToast('Error calculating group preferences.', 'danger');
    }
  });
}

function renderConsensusResults(ranked) {
  const container = $('#groupConsensusOutput');
  container.empty().show();

  let html = `
    <div class="alert alert-info border-0 shadow-sm mt-3">
      <h6 class="fw-bold"><i class="bi bi-pie-chart me-1"></i> Group Consensus Preference Score:</h6>
      <div class="row g-2 mt-2">
  `;

  ranked.slice(0, 6).forEach(item => {
    html += `
      <div class="col-md-4 col-sm-6">
        <div class="d-flex justify-content-between small fw-bold mb-1">
          <span>${item.category}</span>
          <span class="text-primary">${item.score}/10</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div class="progress-bar bg-primary" role="progressbar" style="width: ${item.percentage}%;"></div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
      <small class="text-muted d-block mt-2">These balanced group weights will automatically guide the itinerary generator.</small>
    </div>
  `;

  container.html(html);
}

// Date Defaults
function initDateDefaults() {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const endWeek = new Date(nextWeek);
  endWeek.setDate(nextWeek.getDate() + 2); // 3 days trip default

  $('#startDate').val(formatDateInput(nextWeek));
  $('#endDate').val(formatDateInput(endWeek));
}

function formatDateInput(date) {
  return date.toISOString().split('T')[0];
}

// Step Navigation
function goToStep(step) {
  if (step < 1 || step > totalSteps) return;

  $(`.wizard-step-content`).hide();
  $(`#stepContent${step}`).fadeIn(200);

  // Update wizard indicators
  for (let i = 1; i <= totalSteps; i++) {
    const stepEl = $(`#stepIndicator${i}`);
    if (i < step) {
      stepEl.removeClass('active').addClass('completed');
    } else if (i === step) {
      stepEl.addClass('active').removeClass('completed');
    } else {
      stepEl.removeClass('active completed');
    }
  }

  // Update Buttons
  if (step === 1) {
    $('#btnPrevStep').hide();
  } else {
    $('#btnPrevStep').show();
  }

  if (step === totalSteps) {
    $('#btnNextStep').hide();
    $('#btnSubmitTrip').show();
  } else {
    $('#btnNextStep').show();
    $('#btnSubmitTrip').hide();
  }

  currentStep = step;
  $('html, body').animate({ scrollTop: $('#wizardSection').offset().top - 80 }, 200);
}

function validateStep(step) {
  if (step === 1) {
    const dest = $('#destinationSelect').val();
    if (!dest) {
      showToast('Please select a destination.', 'warning');
      return false;
    }
  } else if (step === 2) {
    const start = $('#startDate').val();
    const end = $('#endDate').val();
    const budget = $('#totalBudget').val();

    if (!start || !end) {
      showToast('Please choose valid trip dates.', 'warning');
      return false;
    }
    if (new Date(start) > new Date(end)) {
      showToast('End date must be after start date.', 'warning');
      return false;
    }
    if (!budget || budget < 500) {
      showToast('Please enter a budget of at least ₹500.', 'warning');
      return false;
    }
  } else if (step === 3) {
    const selectedInterests = $('input[name="interests"]:checked');
    if (selectedInterests.length === 0) {
      showToast('Please pick at least one travel interest!', 'warning');
      return false;
    }
  }
  return true;
}

// Submit and generate itinerary via AJAX
function generateSmartItinerary() {
  const destId = $('#destinationSelect').val();
  const start = $('#startDate').val();
  const end = $('#endDate').val();
  const budget = $('#totalBudget').val();
  const travelers = $('#travelersCount').val();
  const transport = $('#transportSelect').val();
  const startLocation = $('#startingLocation').val() || 'City Center';

  // Gather interest weights
  const preferences = {};
  $('input[name="interests"]:checked').each(function () {
    const cat = $(this).val();
    const weight = $(`.interest-slider[data-category="${cat}"]`).val() || 8;
    preferences[cat] = parseFloat(weight);
  });

  // Calculate days
  const startDateObj = new Date(start);
  const endDateObj = new Date(end);
  const days = Math.round((endDateObj - startDateObj) / (1000 * 60 * 60 * 24)) + 1;

  const payload = {
    destination_id: parseInt(destId, 10),
    start_date: start,
    end_date: end,
    days: days,
    budget: parseFloat(budget),
    travelers: parseInt(travelers, 10) || 1,
    transport: transport,
    starting_location: startLocation,
    preferences: preferences,
    group_travelers: groupTravelersList.length > 1 ? groupTravelersList : undefined
  };

  // Show loading state
  $('#btnSubmitTrip').html('<span class="spinner-border spinner-border-sm me-2"></span> Generating Intelligent Plan...').prop('disabled', true);

  $.ajax({
    url: '/api/generate-itinerary',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    success: function (res) {
      if (res.success && res.data) {
        // Save generated itinerary into sessionStorage for immediate rich viewing
        sessionStorage.setItem('current_itinerary', JSON.stringify(res.data));
        sessionStorage.setItem('trip_input_payload', JSON.stringify(payload));

        showToast('Itinerary generated with route & budget optimization!', 'success');
        setTimeout(() => {
          window.location.href = 'itinerary.html';
        }, 800);
      } else {
        showToast(res.message || 'Failed to generate itinerary.', 'danger');
        $('#btnSubmitTrip').html('<i class="bi bi-magic me-2"></i> Generate Smart Itinerary').prop('disabled', false);
      }
    },
    error: function (xhr) {
      const err = xhr.responseJSON ? xhr.responseJSON.message : 'Server error while generating itinerary.';
      showToast(err, 'danger');
      $('#btnSubmitTrip').html('<i class="bi bi-magic me-2"></i> Generate Smart Itinerary').prop('disabled', false);
    }
  });
}
