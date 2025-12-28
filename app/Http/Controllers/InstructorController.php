<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class InstructorController extends Controller
{
    public function index(){
      $instructors = Instructor::with(['user', 'department'])->get();
      return Inertia::render('Admin/Instructor', ['instructors' => $instructors]);
    }

    public function create(){
      $departments = Department::all();
      return Inertia::render('Admin/InstructorForm', ['departments' => $departments]);
    }

    public function destroy($id){
      $instructor = Instructor::where('id', $id)->first();

      if(!$instructor){
        return response()->json(['message' => 'Not found']);
      }

      if($instructor->user){
        $instructor->user->delete();
      }

      $instructor->delete();

      return response()->json(['message' => 'Instructor deleted successfully']);
    }
}
