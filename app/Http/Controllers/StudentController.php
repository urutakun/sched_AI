<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Inertia\Inertia;
use App\Models\User;

class StudentController extends Controller
{
    public function index(Request $request){
      // inspect raw session contents
      $sessionAll = $request->session()->all();

      // find any login_* keys stored by the session guard
      $loginKeys = [];
      foreach ($sessionAll as $k => $v) {
        if (strpos($k, 'login_') === 0) {
          $loginKeys[$k] = $v;
        }
      }

      // If the guard didn't restore the user, try to load the user model from the login key (debug-only)
      $manualUser = null;
      if (!$request->user() && count($loginKeys) > 0) {
        $firstLoginValue = reset($loginKeys); // typically the stored user id
        $found = User::where('id', $firstLoginValue)->first();
        if ($found) {
          $manualUser = $found->only('id','first_name','last_name','email','role','year','section');
        }
      }

      $debug = [
        'auth_check' => Auth::check(),
        'auth_user' => Auth::check() ? Auth::user()->only('id','first_name','last_name','email','role','year','section') : null,
        'manual_user_from_session' => $manualUser,
        'session_id' => $request->session()->getId(),
        'session_all' => $sessionAll,
        'login_keys' => $loginKeys,
        'session_cookie_name' => Config::get('session.cookie'),
        'session_cookie_value' => $request->cookie(Config::get('session.cookie')),
        'headers' => $request->headers->all(),
      ];

      return Inertia::render('Student/StudentDashboard', [
        'debug' => $debug,
      ]);
    }
}
