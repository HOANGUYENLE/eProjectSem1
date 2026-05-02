<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\AvailabilitySlot;
use App\Models\LawyerFiles;
use App\Models\Rescheduled;
use App\Models\SystemNotification;
use App\Models\PivotNotice;

class AppointmentController extends Controller
{
    private const DAYS = [
        'Mon' => 1,
        'Tue' => 2,
        'Wed' => 3,
        'Thu' => 4,
        'Fri' => 5,
        'Sat' => 6,
        'Sun' => 7,
    ];

    public function rescheduled_index(){
        $allReschedule = Rescheduled::all();
        $allReschedule->load(['newSlot', 'oldSlot','UserTb']);
        return $allReschedule;
    }

    public function sendReminder(Request $request){
        $user = $request->user();
        $arrayReminder = [];
        $column = $user->role_id === 2 ? 'customer_id' : 'lawyer_id';
        $allValidAppointment = Appointment::where($column, $user->id)
                                ->where('status', 'pending')->get();
        
        foreach($allValidAppointment as $each){
            $appointmentID = $each->id;
            $findNotification = PivotNotice::where("appointment_id", $appointmentID)->orderBy("notification_id", 'desc')
                                ->with('systemNotification')->first();
            if($findNotification){
                $arrayReminder[] = $findNotification->systemNotification;
            }
        }
        
        $listOfCancelNotification = SystemNotification::where("status", "published")->with("PivotNotice.appointment")->get();
        foreach ($listOfCancelNotification as $each) {
            foreach ($each->PivotNotice as $pivot) {
                if ($pivot->appointment) {
                    if ($pivot->appointment->$column === $user->id) {
                        $arrayReminder[] = $each;
                    }
                }
            }
        }

        return response()->json(["success"=>True, "reminderList" => $arrayReminder],200);
    }

    public function isReadCancel(Request $request, SystemNotification $notification){
        $fullRead = ["1","2"];    
        
        $user = $request->user();
        $title = $notification->title;
        $parts = explode(':', $title);
        $numbers = trim($parts[1]);
        $myArray = explode(',', $numbers);
        
        if($myArray[0] === "0" && $user->role_id === 2){
            $myArray[0] = "1";
            $notification->update([ "title"=> "Cancel Notice: ". implode(',', $myArray)]);
        }
        else if($myArray[1] === "0" && $user->role_id === 3){
            $myArray[1] = "2";
            $notification->update([ "title"=> "Cancel Notice: ". implode(',', $myArray)]);
        }
        if($myArray === $fullRead){
            $notification->update([ "status"=>"expired"]);
            return response()->json(["success"=>"message is read by both side"], 200);
        }
    }

    public function isExpired(Request $request, Appointment $appointment){
        $user = $request->user();
        if($appointment->lawyer_id !== $user->id){
            return response()->json(['success'=>False,
                                     'message'=>'You can not complete appointment for another lawyer'], 403);
        }
        $appointment->update([
            'status'=>'completed'
        ]);
        $appointment->availability->update([
            'is_booked' => 0
        ]);
        $list_of_Appoinment = PivotNotice::where("appointment_id", $appointment->id)->with('systemNotification')->get();
        foreach($list_of_Appoinment as $each){
            if ($each->systemNotification) {
                $each->systemNotification->update(['status' => 'expired']);
            }
        }
        return response()->json(["success"=> True,
                                 "message"=> "Appointment end"], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function calculateDiff(String $targetDay){
        $currentDay = self::DAYS[now()->format('D')];
        $toTargetDay = self::DAYS[$targetDay];
        return ($toTargetDay - $currentDay + 7) % 7;
    }
    public function CUReschedule(Request $request, string $status){
        $user = $request->user();
        $validated = $request->validate([
        'appointment_id' => 'required|integer|exists:appointments,id',
        'old_slot_id'    => 'required|integer|exists:availability_slots,id',
        'new_slot_id'    => 'nullable|integer|exists:availability_slots,id',
        'reason'         => 'required|string|max:255',
        ]);

        //check require status
        if ($status === 'cancel'){
            $validated["status"] = "canceled";
        } else if ($status === "reschedule"){
            $validated["status"] = 'rescheduled';
        }
        $checkExisted =  Rescheduled::where("appointment_id", $validated["appointment_id"])->where("status", "canceled")->first();
        if($checkExisted){
            return response()->json(["err"=>"This Appointment have been canceled"],403);
        }
        $validated["customer_id"] = $user->id;
        
        if ($validated['status'] === 'rescheduled' && !empty($validated['new_slot_id'])) {
            $newSlot = AvailabilitySlot::find($validated['new_slot_id']);
            if ($newSlot && $newSlot->is_booked) {
                return response()->json([
                    'success' => false,
                    'message' => 'The selected new slot is already booked.'
                ], 422);
            }
            AvailabilitySlot::where('id', $validated['old_slot_id'])->update(['is_booked' => 0]);
            AvailabilitySlot::where('id', $validated['new_slot_id'])->update(['is_booked' => 1]);
            Appointment::where('id', $validated['appointment_id'])->update(['slot_id' => $validated['new_slot_id']]);
        }
        $reschedule = Rescheduled::create($validated);

        if($reschedule->status === 'canceled' || $reschedule->status === 'rescheduled'){
            $existsRecord = PivotNotice::where("appointment_id", $reschedule->appointment_id)->orderBy("notification_id", 'desc')->first();
            if($existsRecord){
                SystemNotification::where('id', $existsRecord->notification_id)->first()->update([
                    'status' => 'expired'
                ]);
            }
        }

        if($reschedule->status === 'rescheduled'){
            $availabilitySlot = AvailabilitySlot::where('id', $reschedule->new_slot_id)->first();
            $remainDays = $this->calculateDiff($availabilitySlot->day_of_week);
            $nextSchedule = now()->addDays($remainDays)->format('l, d M Y');
            $startTime = date('H:i', strtotime($availabilitySlot->start_time));
            $endTime = date('H:i', strtotime($availabilitySlot->end_time));

            $content = "Your next appointment have been reschedule to $nextSchedule from $startTime to $endTime";
            $newNotification = SystemNotification::create([
                'title'=>'Rescheduled Notice',
                'content' => $content,
                'author_ID' => 17,
                'status' => 'published',
                'type' => 'reminder'
            ]);
            PivotNotice::create([
                "notification_id" => $newNotification->id,
                "appointment_id" => $reschedule->appointment_id,
                "user_id"       => $user->id
            ]);
        }
        else if($reschedule->status === 'canceled'){
            $unBookedSlot = $reschedule->new_slot_id?$reschedule->new_slot_id:$reschedule->old_slot_id;
            $availabilitySlot = AvailabilitySlot::where('id', $unBookedSlot)->first();
            $availabilitySlot->update([ 'is_booked'=>0 ]);
            Appointment::where('id', $reschedule->appointment_id)->update(['status' => 'completed']);
            $lawyer = LawyerFiles::where("lawyer_id", $availabilitySlot->lawyer_id)->first()->load('UserTb');
            $nameLawyer = $lawyer->UserTb->name;
            $remainDays = $this->calculateDiff($availabilitySlot->day_of_week);
            $nextSchedule = now()->addDays($remainDays)->format('l, d M Y');
            $startTime = date('H:i', strtotime($availabilitySlot->start_time));
            $endTime = date('H:i', strtotime($availabilitySlot->end_time));

            $content = "Your appointment with lawyer: $nameLawyer have been canceled Schedule: $nextSchedule from $startTime to $endTime";
            $newNotification = SystemNotification::create([
                'title'=>'Cancel Notice: 0,0',
                'content' => $content,
                'author_ID' => 17,
                'status' => 'published',
                'type' => 'reminder'
            ]);
            PivotNotice::create([
                "notification_id" => $newNotification->id,
                "appointment_id" => $reschedule->appointment_id,
                "user_id"       => $user->id
            ]);
        }
        return response()->json([
            'success' => true,
            'data'    => $reschedule
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        $user = $request->user();
        $validated = $request->validate([
            'lawyer_id'     => 'required|integer|exists:lawyersfiles,lawyer_id',
            'slot_id'       => 'required|integer|exists:availability_slots,id',
            'request_text'  => 'nullable|string',
            'response_text' => 'nullable|string',
        ]);

        $slot = AvailabilitySlot::find($validated['slot_id']);
        if (! $slot || $slot->lawyer_id !== $validated['lawyer_id']) {
            return response()->json([
                "err" => "You tried to book a timeslot that belongs to another lawyer"
            ], 404);
        }

        if ($slot->is_booked === true){
            return response()->json([
                "err" => "This time already booked by someone else"
            ], 404);
        }
        $validated['customer_id'] = $user->id;
        $validate['status'] = 'pending';
        $booked = Appointment::create($validated);
        $slot->update([ "is_booked" => 1 ]);

        $remainDays = $this->calculateDiff($slot->day_of_week);
        $nextSchedule = now()->addDays($remainDays)->format('l, d M Y');
        $startTime = date('H:i', strtotime($slot->start_time));
        $endTime = date('H:i', strtotime($slot->end_time));

        $content = "Your have appointment in $nextSchedule from $startTime to $endTime";
        $newNotification = SystemNotification::create([
            'title'=>'Booking Notice',
            'content' => $content,
            'author_ID' => 17,
            'status' => 'published',
            'type' => 'reminder'
        ]);
        PivotNotice::create([
            "notification_id" => $newNotification->id,
            "appointment_id" => $booked->id,
            "user_id"       => $user->id
        ]);

        return response()->json([
            'success' => true,
            'data' =>$booked
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request){
        $user = $request->user();
        $column = $user->role_id === 2 ? 'customer_id' : 'lawyer_id';
        $AppointmentData = Appointment::where($column, $user->id)
                            ->where('status', 'pending')
                            ->get();
        $AppointmentData->load(['lawyer', 'availability', 'UserTb']);
        return $AppointmentData;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
