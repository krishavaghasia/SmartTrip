/**
 * ====================================================================
 * SmartTrip - Client Core & Authentication Manager
 * ====================================================================
 */

// Global App State
const SmartTrip = {
  getToken() {
    return localStorage.getItem('smarttrip_token');
  },
  getUser() {
    const raw = localStorage.getItem('smarttrip_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  setAuth(token, user) {
    localStorage.setItem('smarttrip_token', token);
    localStorage.setItem('smarttrip_user', JSON.stringify(user));
    this.updateNav();
  },
  clearAuth() {
    localStorage.removeItem('smarttrip_token');
    localStorage.removeItem('smarttrip_user');
    this.updateNav();
  },
  isLoggedIn() {
    return !!this.getToken();
  },
  updateNav() {
    const user = this.getUser();
    const navAuthContainer = $('#navAuthContainer');
    if (!navAuthContainer.length) return;

    if (user) {
      navAuthContainer.html(`
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle fw-bold text-primary" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-person-circle me-1"></i> ${user.name || 'Traveler'}
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="dashboard.html"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a></li>
            <li><a class="dropdown-item" href="my-trips.html"><i class="bi bi-suitcase-lg me-2"></i>My Trips</a></li>
            <li><a class="dropdown-item" href="create-trip.html"><i class="bi bi-plus-circle me-2"></i>Plan New Trip</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" id="btnLogout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </li>
      `);
    } else {
      navAuthContainer.html(`
        <li class="nav-item me-2">
          <a class="nav-link" href="login.html"><i class="bi bi-box-arrow-in-right me-1"></i> Login</a>
        </li>
        <li class="nav-item">
          <a class="btn btn-primary-smart text-white btn-sm" href="register.html">Sign Up</a>
        </li>
      `);
    }
  }
};

// Global Toast Notification Helper
function showToast(message, type = 'info') {
  const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning text-dark' : 'bg-primary';
  const icon = type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';

  let toastContainer = $('#toastPlacement');
  if (!toastContainer.length) {
    $('body').append(`
      <div id="toastPlacement" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;"></div>
    `);
    toastContainer = $('#toastPlacement');
  }

  const toastId = 'toast_' + Date.now();
  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${icon} fs-5"></i>
          <span>${message}</span>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.append(toastHtml);
  const element = document.getElementById(toastId);
  const toast = new bootstrap.Toast(element, { delay: 4000 });
  toast.show();
  $(element).on('hidden.bs.toast', function () {
    $(this).remove();
  });
}

// Global AJAX Setup to include JWT Token
$.ajaxSetup({
  beforeSend: function (xhr) {
    const token = SmartTrip.getToken();
    if (token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  }
});

// Document Ready Initialization
$(document).ready(function () {
  SmartTrip.updateNav();

  // Logout click event
  $(document).on('click', '#btnLogout', function (e) {
    e.preventDefault();
    SmartTrip.clearAuth();
    showToast('Logged out successfully.', 'info');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 600);
  });
});
