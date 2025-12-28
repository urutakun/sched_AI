<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Event;
use App\Models\Instructor;
use App\Models\User;
use App\Notifications\EventNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(){
      $events = Event::with('department')->get();
      return Inertia::render('Admin/Event', ['events' => $events]);
    }

    public function create(){
      $departments = Department::all();
      return Inertia::render('Admin/EventForm', ['departments' => $departments]);
    }

    public function store(Request $request){
      $role = Auth::user()->role;
      $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'start_datetime' => 'required|date',
        'end_datetime' => 'required|date|after_or_equal:start_datetime',
        'type' => 'required|in:school,department',
        'dept_id' => 'nullable|string|exists:departments,id',
        'location' => 'required|string|max:255',
      ]);

      $event = Event::create($validated);

      Notification::send(User::all(), new EventNotification($event));

      if(!$event){
        return redirect()->back()->with([
          'message' => 'Failed to create event'
        ]);
      }

      return redirect()->route($role . '.events.index')->with('message', 'Event created successfully');
    }

    public function edit($id){
      $event = Event::where('id', $id)->firstOrFail();
      $departments = Department::all();
      return Inertia::render('Admin/EventForm', ['departments' => $departments, 'event' => $event]);
    }

    public function update(Request $request, $id){
      $role = Auth::user()->role;
      $event = Event::where('id', $id)->firstOrFail();

      $validated = $request->validate([
        'title' => 'nullable|string|max:255',
        'description' => 'nullable|string',
        'start_datetime' => 'nullable|date',
        'end_datetime' => 'nullable|date|after_or_equal:start_datetime',
        'type' => 'nullable|in:school,department',
        'dept_id' => 'nullable|string|exists:departments,id',
        'location' => 'nullable|string|max:255',
        'status' => 'nullable|in:upcoming,ongoing,completed,cancelled',
      ]);

      // Clean up
      if($validated['type'] === 'school'){
        $validated['dept_id'] = null;
      }

      $event->update($validated);
      return redirect()->route($role . '.events.index')->with('success', 'Event updated successfully');
    }

    public function destroy($id){
      $event = Event::where('id', $id)->firstOrFail();

      if(!$event){
        return response()->json(['message' => 'Not found']);
      }

      $event->delete();

      return response()->json(['message' => 'Event deleted successfully']);
    }
}
