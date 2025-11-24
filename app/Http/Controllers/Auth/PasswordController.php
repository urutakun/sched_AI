<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */

    public function create(){
      return Inertia::render('Components/ChangePassword');
    }

    public function update(Request $request, $id){
        \Log::info(['request' => $request->all()]);
        \Log::info(['id' => $id]);

        $validated = $request->validate([
          'old_password' => 'required',
          'password' => [
            'required',
            'confirmed',
            Password::min(8)->mixedCase()->numbers()->symbols(),
          ]
        ]);

        $user = User::find($id);

        if(!Hash::check($validated['old_password'], $user->password)){
          return back()->withErrors(['old_password' => 'Your current password is incorrect']);
        }

        $user->password = Hash::make($validated['password']);
        $user->must_change_password = false;
        $user->save();

        Auth::setUser($user);

        $redirectRoute = match($user->role){
          'admin' => 'admin.dashboard',
          'instructor' => 'instructor.dashboard',
          default => 'student.dashboard'
        };

        return redirect()->route($redirectRoute)->with('success', 'Password updated successfully');
    }
}
