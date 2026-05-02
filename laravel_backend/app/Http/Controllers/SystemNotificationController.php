<?php

namespace App\Http\Controllers;

use App\Models\SystemNotification;
use App\Models\UserTb;
use Illuminate\Http\Request;

class SystemNotificationController extends Controller
{
    public function index()
    {
        return SystemNotification::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $field = $request->validate([ 
            "title"      => ["required", "string", "max:255"],
            "content"    => ["required", "string"], 
            "expired_at" => ["required", "date", "after:today"], 
        ]);
        $field["author_ID"] = $user->id;
        $field["status"] = "published";
        $field["created_at"] = now();
        $field["type"] = "system";

        $newPost = SystemNotification::create($field);
        return response()->json(["success"=>$newPost] , 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(SystemNotification $systemNotice)
    {
        return response()->json(["success"=>$systemNotice] , 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SystemNotification $systemNotification)
    {
        $field = $request->validate([ 
            "title"      => ["required", "string", "max:255"],
            "content"    => ["required", "string"], 
            "status"     => ["required", "string", "in:published,expired"],
            "expired_at" => ["required", "date"],
            "type" => ["required", "string", "in:system,reminder"]
        ]);
        $systemNotification->update($field);
        return $systemNotification;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SystemNotification $systemNotification)
    {
        $systemNotification->delete();
        return response()->json([
            'successes' => 'Successfull destroy a record'
        ]);
    }
}
