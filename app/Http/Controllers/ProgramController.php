<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PHPUnit\Framework\Attributes\Depends;

class ProgramController extends Controller
{
    public function index(){
      $programs = Program::with('department')->get();
      return Inertia::render('Admin/Program', ['programs' => $programs]);
    }

    public function create(){
      $departments = Department::all();
      return Inertia::render('Admin/ProgramForm', ['departments' => $departments]);
    }

    public function store(Request $request){
      $validated = $request->validate([
        'dept_id' => 'required|exists:departments,id',
        'code' => 'required|string|min:3|max:8|unique:programs,code',
        'name'  =>  'required|string'
      ]);

      $program = Program::create($validated);

      if(!$program){
        return redirect()->back()->with([
          'message' => 'Failed to create program'
        ]);
      }

      return redirect()->route('programs.index')->with('message', 'Program created successfully');
    }

    public function edit($id){
      $departments = Department::all();
      $program = Program::where('id', $id)->firstOrFail();
      return Inertia::render('Admin/ProgramForm', ['program' => $program, 'departments' => $departments]);
    }

    public function update(Request $request, $id){
      $program = Program::where('id', $id)->firstOrFail();

      $validated = $request->validate([
        'dept_id' => 'nullable|exists:departments,id',
        'code' => 'nullable|string|min:3|max:8|unique:programs,code',
        'name' => 'nullable|string'
      ]);

      $program->update($validated);
      return redirect('/admin/programs')->with('success', 'Program updated successfully');
    }

    public function destroy($id){
      $program = Program::where('id', $id)->first();

      if(!$program){
        return response()->json(['message' => 'Not found']);
      }

      $program->delete();

      return response()->json(['message' => 'Program deleted successfully']);
    }
}
