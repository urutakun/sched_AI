<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StudentsController extends Controller
{
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
          $header = fgetcsv($handle, 1000, ',');
          while(($row = fgetcsv($handle, 1000, ',')) !== false){
            $data = array_combine($header, $row);

            $student = Student::where('id', $data['id'])->first();

            $program = Program::where('name', $data['program'] ?? '')->first();
            $programID = $program ? $program->id : null;

            if($student){
              $student->update([
                'year' => $data['year'] ?? $student->year,
                'section' => strtoupper($data['section'] ?? $student->section) ,
                'program_id' => $programID ?? $student->program_id,
              ]);
            }
            else {
              // Generate new user ID
              $latestUser = User::where('role', 'student')->latest('id')->first();
              $newIdNumber = $latestUser ? ((int)Str::after($latestUser->id, 'USR_')) + 1 : 1;
              $userId = 'USR_' . str_pad($newIdNumber, 6, '0', STR_PAD_LEFT);

              $user = User::create(
                [
                  'id' => $userId,
                  'first_name' => $data['first_name'] ?? 'Unknown',
                  'last_name' => $data['last_name'] ?? 'Unknown',
                  'email' => $data['email'] ?? $data['student_id'] . '@sched.ai',
                  'role' => 'student',
                  'password' => Hash::make($data['password'] ?? $data['id']),
                ]
              );

              Student::updateOrCreate(
               [
                 'student_id' => $data['student_id'],
                  'user_id' => $user->id,
                  'year' => $data['year'] ?? 1,
                  'section' => strtoupper($data['section'] ?? 'A'),
                  'program_id' => $programID,
               ]
              );
            }
          }
          fclose($handle);
        }
      }
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
