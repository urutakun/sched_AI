<?php

namespace App\Http\Controllers;

use App\Models\Dean;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeanController extends Controller
{
    public function index(){
      $deans = Dean::with(['user', 'department'])->get();
      return Inertia::render('Admin/Dean', ['deans' => $deans]);
    }

    public function destroy($id){
      $dean = Dean::where('id', $id)->first();

      if(!$dean){
        return response()->json(['message' => 'Not found']);
      }

      if($dean->user){
        $dean->user->delete();
      }

      $dean->delete();

      return response()->json(['message' => 'Instructor deleted successfully']);
    }
}
