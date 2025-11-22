<?php

namespace App\Http\Controllers;

use App\Mail\StudentCredentialsMail;
use App\Models\Program;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StudentsController extends Controller
{
    private function generateRandomUserId(): string {
      do {
        $randomId = 'USR_' . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
      } while (User::where('id', $randomId)->exists());

      return $randomId;
    }

    private function generateRandomStudentId(): string {
      do {
          $randomId = 'STUD_' . str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
      } while (Student::where('id', $randomId)->exists());

      return $randomId;
    }

    public function index(){
      $students = Student::with(['user', 'program'])->get();
      return Inertia::render('Admin/Students', ['students' => $students]);
    }

    public function create(){
      return Inertia::render('Admin/StudentsForm');
    }

    public function import(Request $request){
      $validated = $request->validate([
        'file' => 'required|mimes:csv,txt'
      ]);

      $file = $request->file('file')->getRealPath();
      $extension = $request->file('file')->getClientOriginalExtension();

      $rows = [];

      if($extension === 'csv' || $extension === 'txt'){
        if(($handle = fopen($file, 'r')) !== false){

          // get headers
          $header = fgetcsv($handle, 1000, ',');
          if (isset($header[0])) {
              $header[0] = preg_replace('/^\xEF\xBB\xBF/', '', $header[0]);
          }

          while(($row = fgetcsv($handle, 1000, ',')) !== false){

            $data = array_combine($header, $row);

            // program lookup
            $program = Program::where('name', $data['program'] ?? '')->first();
            $programID = $program ? $program->id : null;

            $user = User::where('email', $data['email'])->first();

            if($user){
              $student = Student::whereHas('user', function($q) use ($user){
                $q->where('email', $user->email);
              })->first();

              if($student){
                $student->update([
                  'year' => $data['year'] ?? $student->year,
                  'section' => strtoupper($data['section'] ?? $student->section) ,
                  'program_id' => $programID ?? $student->program_id,
                ]);
              }
            }
            else {
              // Create new user
              $newUserId = $this->generateRandomUserId();
              $newStudentId = $this->generateRandomStudentId();
              $tempPassword = Str::random(12);

              $user = User::create(
                [
                  'id' => $newUserId,
                  'first_name' => $data['first_name'] ?? 'Unknown',
                  'last_name' => $data['last_name'] ?? 'Unknown',
                  'email' => $data['email'] ?? $data['student_id'] . '@sched.ai',
                  'role' => 'student',
                  'password' => Hash::make($tempPassword),
                ]
              );

              Student::updateOrCreate(
               [
                  'id' => $newStudentId,
                  'user_id' => $user->id,
                  'year' => $data['year'] ?? 1,
                  'section' => strtoupper($data['section'] ?? 'A'),
                  'program_id' => $programID,
               ]
              );

              Mail::to($user->email)->send(new StudentCredentialsMail($user->first_name, $user->email, $tempPassword));
            }
          }
          fclose($handle);
        }
      }
      return redirect()->route('students.index')->with('message', 'File uploaded successfully');
    }

    public function destroy($id){
      $student = Student::where('id', $id)->first();

      if(!$student){
        return response()->json(['message' => 'Not found']);
      }

      if($student->user){
        $student->user->delete();
      }

      $student->delete();

      return response()->json(['message' => 'Student deleted successfully']);
    }
}
