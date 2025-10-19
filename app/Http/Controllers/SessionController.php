<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SessionController extends Controller
{
    public function index(){
      return Inertia::render('Auth/Login');
    }

    public function store(Request $request){
      $validated = $request->validate([
        'email' => 'email|required',
        'password' => 'string|required'
      ]);

      if(!Auth::attempt($validated)){
        return redirect()->back()->with(['email' => 'credentials not found']);
      }

      return redirect()->back()->with(['success' => 'credentials found']);
    }
}
