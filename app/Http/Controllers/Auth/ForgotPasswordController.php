<?php

namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\PasswordResetToken;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use  Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    public function index(){
      return Inertia::render('Auth/ForgotPassword');
    }

    public function sendOtp(Request $request){
      $validated = $request->validate([
        'email' => 'required|email|exists:users,email'
      ], [
        'email' => 'Email not found'
      ]);

      $otp = rand(100000, 999999);
      PasswordResetToken::updateOrInsert(
          ['email' => $validated['email']],
          ['token' => $otp, 'created_at' => now()]
      );

      Mail::to($validated['email'])->send(new OtpMail($otp));

      // session(['email' => $validated['email']]);
      $request->session()->put('email', $validated['email']);

      return redirect()->route('submit.otp')->with('message', 'OTP sent to your email');
    }

    public function submitOtp(){
      return Inertia::render('Auth/OTP');
    }

    public function verifyOtp(Request $request){
      $validated = $request->validate([
        'otp' => 'required|digits:6'
      ]);

      $email = $request->session()->get('email');

      if(!$email){
        return redirect()->route('forgot')->with('error', 'Session expired, Please try again.');
      }

      $record = PasswordResetToken::where('email', $email)
      ->where('token', $validated['otp'])
      ->first();

      if(!$record){
        return back()->with('error', 'Invalid OTP');
      }

      return redirect()->route('reset.password');
    }

    public function resetPassword(){
      return Inertia::render('Auth/ResetPassword');
    }

    public function updatePassword(Request $request){
      $validated = $request->validate([
        'password' => [
          'required',
          'confirmed',
          Password::min(8)->mixedCase()->numbers()->symbols(),
        ]
      ]);

      $email = $request->session()->get('email');
      if(!$email){
        return redirect()->route('forgot')->with('error', 'Session expired, Please try again.');
      }

      $user = User::where('email', $email)->firstOrFail();

      if (!empty($validated['password'])) {
          $user->password = Hash::make($validated['password']);
      }

      $user->save();

      return redirect()->route('login')->with('message', 'Reset password successfully');
    }
}
