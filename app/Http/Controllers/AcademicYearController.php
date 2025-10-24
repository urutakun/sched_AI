<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function index(){
      $academic_years = AcademicYear::all();
      return Inertia::render('Admin/AcademicYear', ['academic_years' => $academic_years]);
    }

    public function create(){
      return Inertia::render('Admin/AcademicYearForm');
    }

    public function store(Request $request){
      $validated = $request->validate([
        'year_start' => 'required|digits:4',
        'year_end' => 'required|digits:4|gt:year_start',
        'status' => 'required|in:active,inactive'
      ]);

      $academic_year = AcademicYear::create($validated);

      if(!$academic_year){
        return redirect()->back()->with([
          'message' => 'Failed to create academic year'
        ]);
      }

      return redirect()->route('academic-years.index')->with('message', 'Academic year created successfully');
    }

    public function edit($id){
      $academic_year = AcademicYear::where('id', $id)->firstOrFail();
      return Inertia::render('Admin/AcademicYearForm', ['academic_year' => $academic_year]);
    }

    public function update(Request $request, $id){
      $academic_year = AcademicYear::where('id', $id)->firstOrFail();

      $validated = $request->validate([
        'year_start' => 'nullable|digits:4',
        'year_end' => 'nullable|digits:4|gt:year_start',
        'status' => 'nullable|in:active,inactive'
      ]);

      $academic_year->update($validated);
      return redirect('/admin/academic-years')->with('success', 'Academic year updated successfully');
    }

    public function destroy($id){
      $academic_year = AcademicYear::where('id', $id)->first();

      if(!$academic_year){
        return response()->json(['message' => 'Not found']);
      }

      $academic_year->delete();

      return response()->json(['message' => 'Academic year deleted successfully']);
    }
}
