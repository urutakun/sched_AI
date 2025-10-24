<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Trimester;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrimesterController extends Controller
{
    public function index(){
      $trimesters = Trimester::with('academic_year')->get();
      return Inertia::render('Admin/Trimester', ['trimesters' => $trimesters]);
    }

    public function create(){
      $academic_years = AcademicYear::where('status', 'active')->get();
      return Inertia::render('Admin/TrimesterForm', ['academic_years' => $academic_years]);
    }

    public function store(Request $request){
      $validated = $request->validate([
        'academic_years_id' => 'required|string|exists:academic_years,id',
        'name' => 'required|string|max:255',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
        'status' => 'required|string|in:active,inactive'
      ]);

      $trimester = Trimester::create($validated);

      if(!$trimester){
        return redirect()->back()->with([
          'message' => 'Failed to create trimester'
        ]);
      }

      return redirect()->route('trimesters.index')->with('message', ' Trimester created successfully');
    }

    public function edit($id){
      $academic_years = AcademicYear::where('status', 'active')->get();
      $trimester = Trimester::where('id', $id)->firstOrFail();
      return Inertia::render('Admin/TrimesterForm', ['trimester' => $trimester, 'academic_years' => $academic_years]);
    }

    public function update(Request $request, $id){
       $trimester = Trimester::where('id', $id)->firstOrFail();

       $validated = $request->validate([
        'academic_years_id' => 'nullable|string|exists:academic_years,id',
        'name' => 'nullable|string|max:255',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'status' => 'nullable|string|in:active,inactive'
      ]);

      $trimester->update($validated);
      return redirect('/admin/trimesters')->with('success', 'Trimester updated successfully');
    }

    public function destroy($id){
      $trimester = Trimester::where('id', $id)->firstOrFail();

      if(!$trimester){
        return response()->json(['message' => 'Not found']);
      }

      $trimester->delete();

      return response()->json(['message' => 'Trimester deleted successfully']);
    }

}
