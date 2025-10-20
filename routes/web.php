<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserManangementController;
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

// quick JSON endpoint (session-based) to return current authenticated user + diagnostics
Route::get('/user', function (Request $request) {
    return response()->json([
        'auth_check' => $request->user() ? true : false,
        'auth_user' => $request->user() ? $request->user()->only('id','first_name','last_name','email','role','year','section') : null,
        'session_id' => $request->session()->getId(),
        'session_all' => $request->session()->all(),
        'session_cookie' => $request->cookie(session_name()),
        'headers' => $request->headers->all(),
    ]);
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

  Route::get('/instructors', [InstructorController::class, 'index'])->name('instructors.index');;
  Route::get('/instructors/create', [InstructorController::class, 'create']);

  Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');;
  Route::get('/courses/create', [CourseController::class, 'create']);
  Route::post('/courses/create', [CourseController::class, 'store']);

  Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');;
  Route::get('/rooms/create', [RoomController::class, 'create']);
  Route::post('/rooms/create', [RoomController::class, 'store']);
  Route::get('/rooms/edit/{id}', [RoomController::class, 'edit']);
  Route::put('/rooms/update/{id}', [RoomController::class, 'update']);
  Route::delete('/rooms/delete/{id}', [RoomController::class, 'destroy']);

  Route::get('/user-management', [UserManangementController::class, 'index'])->name('user-management.index');
  Route::get('/user-management/create', [UserManangementController::class, 'create']);
  Route::post('/user-management/create', [UserManangementController::class, 'store']);
  Route::get('/user-management/edit/{id}', [UserManangementController::class, 'edit']);
  Route::put('/user-management/update/{id}', [UserManangementController::class, 'update']);
  Route::delete('/user-management/delete/{id}', [UserManangementController::class, 'destroy']);
});

Route::middleware(['student'])->prefix('student')->group(function(){
  Route::get('/dashboard', [StudentController::class, 'index'])->name('student.dashboard');
});
