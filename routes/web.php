<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CourseAssignmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\CancellationRequestController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\InstructorDashboardController;
use App\Http\Controllers\InstructorNotificationsController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ScheduleSessionController;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\TrimesterController;
use App\Http\Controllers\UserManangementController;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// CLEAR
Route::get('/clear', function () {
  Artisan::call('optimize:clear');
  return '✔️ All caches (route, config, view, etc.) have been cleared!';
});

// HOME
Route::get('/', function () {
  return Inertia::render('Landing');
});

// ABOUT
Route::get('/about', function () {
  return Inertia::render('About');
});

// REGISTER
Route::prefix('auth')->group(function () {
  Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
  Route::post('/register', [RegisteredUserController::class, 'store']);
});

// NOTIFICATIONS
// AUTHENTICATED SHARED ROUTES
Route::middleware(['auth'])->group(function () {
  // Universal Notifications Endpoint
  Route::get('/notifications', [NotificationsController::class, 'index']);
});


// SESSION
Route::prefix('auth')->group(function () {
  Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
  Route::post('/login', [AuthenticatedSessionController::class, 'store']);
  Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
  Route::get('/forgot', [ForgotPasswordController::class, 'index'])->name('forgot');

  Route::middleware('check.forgot.flow')->group(function () {
    Route::post('/forgot', [ForgotPasswordController::class, 'sendOtp']);
    Route::get('/verify-otp', [ForgotPasswordController::class, 'submitOtp'])->name('submit.otp');
    Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
    Route::get('/reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('reset.password');
    Route::post('/reset-password', [ForgotPasswordController::class, 'updatePassword']);
  });
});

// ADMIN
Route::middleware(['admin'])->prefix('admin')->group(function () {
  // Admins' Dashboard
  Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
  Route::get('/dashboard/test', [AdminController::class, 'create']);

  // Change Password
  Route::get('/change-password', [PasswordController::class, 'create'])->name('admin.change-password');
  Route::put('/change-password/{id}', [PasswordController::class, 'update'])->name('admin.change-password.update');

  // Profiles
  Route::get('/profile', [ProfileController::class, 'index'])->name('admin.profile');

  // Departments
  Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
  Route::get('/departments/create', [DepartmentController::class, 'create']);
  Route::post('/departments/create', [DepartmentController::class, 'store']);
  Route::get('/departments/edit/{id}', [DepartmentController::class, 'edit']);
  Route::put('/departments/update/{id}', [DepartmentController::class, 'update']);
  Route::delete('/departments/delete/{id}', [DepartmentController::class, 'destroy']);

  // Instructors' Dashboard
  Route::get('/instructors', [InstructorController::class, 'index'])->name('instructors.index');
  Route::get('/instructors/create', [InstructorController::class, 'create']);
  Route::delete('/instructors/delete/{id}', [InstructorController::class, 'destroy']);

  // Students' Dashboard
  Route::get('/students', [StudentsController::class, 'index'])->name('students.index');
  Route::get('/students/create', [StudentsController::class, 'create']);
  Route::post('/students/import', [StudentsController::class, 'import']);
  Route::delete('/students/delete/{id}', [StudentsController::class, 'destroy']);

  // Courses
  Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
  Route::get('/courses/create', [CourseController::class, 'create']);
  Route::post('/courses/create', [CourseController::class, 'store']);
  Route::get('/courses/edit/{id}', [CourseController::class, 'edit']);
  Route::put('/courses/update/{id}', [CourseController::class, 'update']);
  Route::delete('/courses/delete/{id}', [CourseController::class, 'destroy']);
  Route::get('/courses/assign/{id}', [CourseAssignmentController::class, 'create']);

  // Course Assignments
  Route::get('/course-assignments', [CourseAssignmentController::class, 'index'])->name('course-assignments.index');
  Route::post('/course-assignments/create', [CourseAssignmentController::class, 'store']);
  Route::get('/course-assignments/edit/{id}', [CourseAssignmentController::class, 'edit']);
  Route::put('/course-assignments/update/{id}', [CourseAssignmentController::class, 'update']);
  Route::delete('/course-assignments/delete/{id}', [CourseAssignmentController::class, 'destroy']);

  // Schedules
  Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules.index');
  Route::get('/schedules/create', [ScheduleController::class, 'create']);
  Route::post('/schedules/create', [ScheduleController::class, 'store']);
  Route::get('/schedules/edit/{id}', [ScheduleController::class, 'edit']);
  Route::put('/schedules/update/{id}', [ScheduleController::class, 'update']);
  Route::delete('/schedules/delete/{id}', [ScheduleController::class, 'destroy']);

  // Cancel Requests
  Route::get('/schedules/cancel-request', [CancellationRequestController::class, 'index'])->name('cancel.request.index');
  Route::get('/schedules/cancel-request/{id}', [CancellationRequestController::class, 'show'])->name('cancel.request.show');
  Route::put('/schedules/cancel-request/accept/{id}', [CancellationRequestController::class, 'accept']);
  Route::post('/schedules/cancel-request/deny/{id}', [CancellationRequestController::class, 'deny']);
  Route::delete('/schedules/cancel-request/{id}', [CancellationRequestController::class, 'destroy']);

  // Sessions
  Route::put('/schedule-session/update/{id}', [ScheduleSessionController::class, 'update']);

  // Rooms
  Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');
  Route::get('/rooms/create', [RoomController::class, 'create']);
  Route::post('/rooms/create', [RoomController::class, 'store']);
  Route::get('/rooms/edit/{id}', [RoomController::class, 'edit']);
  Route::put('/rooms/update/{id}', [RoomController::class, 'update']);
  Route::delete('/rooms/delete/{id}', [RoomController::class, 'destroy']);

  // Programs
  Route::get('/programs', [ProgramController::class, 'index'])->name('programs.index');
  Route::get('/programs/create', [ProgramController::class, 'create']);
  Route::post('/programs/create', [ProgramController::class, 'store']);
  Route::get('/programs/edit/{id}', [ProgramController::class, 'edit']);
  Route::put('/programs/update/{id}', [ProgramController::class, 'update']);
  Route::delete('/programs/delete/{id}', [ProgramController::class, 'destroy']);

  // User-Management
  Route::get('/user-management', [UserManangementController::class, 'index'])->name('user-management.index');
  Route::get('/user-management/create', [UserManangementController::class, 'create']);
  Route::post('/user-management/create', [UserManangementController::class, 'store']);
  Route::get('/user-management/edit/{id}', [UserManangementController::class, 'edit']);
  Route::put('/user-management/update/{id}', [UserManangementController::class, 'update']);
  Route::put('/user-management/updateCredentials/{id}', [UserManangementController::class, 'updateCredentials']);
  Route::put('/user-management/updateStudentPassword/{id}', [UserManangementController::class, 'updateStudentPassword']);
  Route::delete('/user-management/delete/{id}', [UserManangementController::class, 'destroy']);

  // Academic Years
  Route::get('/academic-years', [AcademicYearController::class, 'index'])->name('academic-years.index');
  Route::get('/academic-years/create', [AcademicYearController::class, 'create']);
  Route::post('/academic-years/create', [AcademicYearController::class, 'store']);
  Route::get('/academic-years/edit/{id}', [AcademicYearController::class, 'edit']);
  Route::put('/academic-years/update/{id}', [AcademicYearController::class, 'update']);
  Route::delete('/academic-years/delete/{id}', [AcademicYearController::class, 'destroy']);

  // Trimesters
  Route::get('/trimesters', [TrimesterController::class, 'index'])->name('trimesters.index');
  Route::get('/trimesters/create', [TrimesterController::class, 'create']);
  Route::post('/trimesters/create', [TrimesterController::class, 'store']);
  Route::get('/trimesters/edit/{id}', [TrimesterController::class, 'edit']);
  Route::put('/trimesters/update/{id}', [TrimesterController::class, 'update']);
  Route::delete('/trimesters/delete/{id}', [TrimesterController::class, 'destroy']);

  // Events
  Route::get('/events', [EventController::class, 'index'])->name('events.index');
  Route::get('/events/create', [EventController::class, 'create']);
  Route::post('/events/create', [EventController::class, 'store']);
  Route::get('/events/edit/{id}', [EventController::class, 'edit']);
  Route::put('/events/update/{id}', [EventController::class, 'update']);
  Route::delete('/events/delete/{id}', [EventController::class, 'destroy']);

  // Notifications
  Route::get('/notifications', [AdminNotificationController::class, 'index']);
});

// INSTRUCTOR
Route::middleware(['instructor'])->prefix('instructor')->group(function () {
  Route::get('/dashboard', [InstructorDashboardController::class, 'index'])->name('instructor.dashboard');

  // Profiles
  Route::get('/profile', [ProfileController::class, 'index'])->name('student.profile');

  // Notifications
  Route::get('/notifications', [InstructorNotificationsController::class, 'index']);

  // Change Password
  Route::get('/change-password', [PasswordController::class, 'create'])->name('instructor.change-password');
  Route::put('/change-password/{id}', [PasswordController::class, 'update'])->name('instructor.change-password.update');

  // Request cancellation
  Route::post('/schedule-session/cancel/{id}', [CancellationRequestController::class, 'store'])->name('instructor.schedule-session');
});

// STUDENT
Route::middleware(['student'])->prefix('student')->group(function () {
  Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');

  // Profiles
  Route::get('/profile', [ProfileController::class, 'index'])->name('student.profile');

  // Change Password
  Route::get('/change-password', [PasswordController::class, 'create'])->name('student.change-password');
  Route::put('/change-password/{id}', [PasswordController::class, 'update'])->name('student.change-password.update');
});
