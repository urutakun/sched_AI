<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(){
      $rooms = Room::all();
      return Inertia::render('Admin/Room', ['rooms' => $rooms]);
    }

    public function create(){
      return Inertia::render('Admin/RoomForm');
    }

    public function store(Request $request){
      $validated = $request->validate([
        'room_name' => 'required|string',
        'room_type' => 'required|string|in:laboratory,classroom',
      ]);

      $room = Room::create($validated);

      if(!$room){
        return redirect()->back()->with([
          'message' => 'Failed to create room'
        ]);
      }

      return redirect()->route('rooms.index')->with('message', 'Room created successfully');
    }

    public function edit($id){
      $room = Room::where('room_id', $id)->firstOrFail();
      return Inertia::render('Admin/RoomForm', ['room' => $room]);
    }

    public function update(Request $request, $id){
      $room = Room::where('room_id', $id)->firstOrFail();

      $validated = $request->validate([
        'room_name' => 'required|string',
        'room_type' => 'required|string|in:laboratory,classroom',
      ]);

      $room->update($validated);
      return redirect('/admin/rooms')->with('success', 'Room updated successfully');
    }

    public function destroy($id){
       $room = Room::where('room_id', $id)->first();

      if(!$room){
        return response()->json(['message' => 'Not found']);
      }

      $room->delete();

      return response()->json(['message' => 'Room deleted successfully']);
    }
}
