<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Models\LawyerFiles;
use \App\Models\AvailabilitySlot;
use App\Rules\CheckStartEndTime;
use DateTime;

class AvailableSlotController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $lawyer = request()->user()->lawyers()->first();
        $field  = $request->validate([
            'availableSlot'  => 'required|array',
            'availableSlot.*.day_of_week'  => 'required|in:Mon,Tue,Wed,Thu,Fri,Sat,Sun',
            'availableSlot.*.start_time'   => 'required|date_format:H:i:s',
            'availableSlot.*.end_time'     => ['required','date_format:H:i:s', new CheckStartEndTime],
        ]);
        $existedTime = $lawyer->availability()->get();

        foreach($field['availableSlot'] as $newSlot){
            foreach($existedTime as $each){
                if ($newSlot['day_of_week'] === $each['day_of_week']){
                    $startNew = DateTime::createFromFormat('H:i:s', $newSlot['start_time']);
                    $endNew   = DateTime::createFromFormat('H:i:s', $newSlot['end_time']);
                    $startOld = DateTime::createFromFormat('H:i:s.u', $each['start_time']);
                    $endOld   = DateTime::createFromFormat('H:i:s.u', $each['end_time']);
                    if($startNew < $endOld && $startOld < $endNew){
                        return response()->json(['err'=>'Time Overlapse in the same day'],404);
                    }
                }
            }
        }
        $lawyer->availability()->createMany($field['availableSlot']);
        $lawyer->load('availability');
        return $lawyer;
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, LawyerFiles $lawyer)
    {
        $lawyer->load('availability');
        return $lawyer;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $lawyer = $request->user()->lawyers()->first();
        $slot = $lawyer->availability()->where('id', $id)->first();

        if (!$slot) { return response()->json(['err' => 'Slot not found'], 404); }

        if ($slot->is_booked) {
            return response()->json(['err' => 'Slot is already booked and cannot be deleted'], 403);
        }
        $slot->delete();
        return response()->json(['success' => 'Slot deleted successfully'], 200);
    }

}
