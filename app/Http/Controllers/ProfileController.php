<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(){
      $auth_user = User::where('id', Auth::id())->with(['student.program.department', 'instructor.department', 'dean.department'])->firstOrFail();
      return Inertia::render('Components/Profiles', ['auth_user' => $auth_user]);
    }
}
