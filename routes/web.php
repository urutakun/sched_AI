<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\StudentDashboardController;
use App\Http\Controllers\TrimesterController;
use App\Http\Controllers\UserManangementController;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// CLEAR
Route::get('/clear', function(){
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

Route::prefix('auth')->group(function(){
  Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
  Route::post('/register', [RegisteredUserController::class, 'store']);
});

// SESSION
Route::prefix('auth')->group(function(){
  Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
  Route::post('/login', [AuthenticatedSessionController::class, 'store']);
  Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});

// ADMIN
Route::middleware(['admin'])->prefix('admin')->group(function(){
  Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
  Route::get('/dashboard/test', [AdminController::class, 'create']);

  Route::get('/departments', [DepartmentController::class, 'index'])->name('departments.index');
  Route::get('/departments/create', [DepartmentController::class, 'create']);
  Route::post('/departments/create', [DepartmentController::class, 'store']);
  Route::get('/departments/edit/{id}', [DepartmentController::class, 'edit']);
  Route::put('/departments/update/{id}', [DepartmentController::class, 'update']);
  Route::delete('/departments/delete/{id}', [DepartmentController::class, 'destroy']);

  Route::get('/instructors', [InstructorController::class, 'index'])->name('instructors.index');
  Route::get('/instructors/create', [InstructorController::class, 'create']);
  Route::delete('/instructors/delete/{id}', [InstructorController::class, 'destroy']);

  Route::get('/students', [StudentsController::class, 'index'])->name('students.index');
  Route::delete('/students/delete/{id}', [StudentsController::class, 'destroy']);

  Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
  Route::get('/courses/create', [CourseController::class, 'create']);
  Route::post('/courses/create', [CourseController::class, 'store']);

  Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');
  Route::get('/rooms/create', [RoomController::class, 'create']);
  Route::post('/rooms/create', [RoomController::class, 'store']);
  Route::get('/rooms/edit/{id}', [RoomController::class, 'edit']);
  Route::put('/rooms/update/{id}', [RoomController::class, 'update']);
  Route::delete('/rooms/delete/{id}', [RoomController::class, 'destroy']);

  Route::get('/programs', [ProgramController::class, 'index'])->name('programs.index');
  Route::get('/programs/create', [ProgramController::class, 'create']);
  Route::post('/programs/create', [ProgramController::class, 'store']);
  Route::get('/programs/edit/{id}', [ProgramController::class, 'edit']);
  Route::put('/programs/update/{id}', [ProgramController::class, 'update']);
  Route::delete('/programs/delete/{id}', [ProgramController::class, 'destroy']);

  Route::get('/user-management', [UserManangementController::class, 'index'])->name('user-management.index');
  Route::get('/user-management/create', [UserManangementController::class, 'create']);
  Route::post('/user-management/create', [UserManangementController::class, 'store']);
  Route::get('/user-management/edit/{id}', [UserManangementController::class, 'edit']);
  Route::put('/user-management/update/{id}', [UserManangementController::class, 'update']);
  Route::put('/user-management/updateCredentials/{id}', [UserManangementController::class, 'updateCredentials']);
  Route::delete('/user-management/delete/{id}', [UserManangementController::class, 'destroy']);

  Route::get('/academic-years', [AcademicYearController::class, 'index'])->name('academic-years.index');
  Route::get('/academic-years/create', [AcademicYearController::class, 'create']);
  Route::post('/academic-years/create', [AcademicYearController::class, 'store']);
  Route::get('/academic-years/edit/{id}', [AcademicYearController::class, 'edit']);
  Route::put('/academic-years/update/{id}', [AcademicYearController::class, 'update']);
  Route::delete('/academic-years/delete/{id}', [AcademicYearController::class, 'destroy']);

  Route::get('/trimesters', [TrimesterController::class, 'index'])->name('trimesters.index');
  Route::get('/trimesters/create', [TrimesterController::class, 'create']);
  Route::post('/trimesters/create', [TrimesterController::class, 'store']);
  Route::get('/trimesters/edit/{id}', [TrimesterController::class, 'edit']);
  Route::put('/trimesters/update/{id}', [TrimesterController::class, 'update']);
  Route::delete('/trimesters/delete/{id}', [TrimesterController::class, 'destroy']);
});

Route::middleware(['student'])->prefix('student')->group(function(){
  Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('student.dashboard');
});
