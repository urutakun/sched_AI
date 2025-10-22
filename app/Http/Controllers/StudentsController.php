<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentsController extends Controller
{
    public function index(){
      $students = Student::with(['user', 'program'])->get();
      return Inertia::render('Admin/Students', ['students' => $students]);
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
