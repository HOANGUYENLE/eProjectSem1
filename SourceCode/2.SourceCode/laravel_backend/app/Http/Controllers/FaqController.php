<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FAQ;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allFAQ = FAQ::with("UserTb")->orderBy("created_at", "desc")->get();
        return $allFAQ;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $type = "customer";
        $user = $request->user();
        if($user->role_id === 3){
            $type = "lawyer";
        }
        $field = $request->validate([
            'question'=>'required|string|max:255',
        ]);
        $field["type"] = $type;
        $field["author_ID"] = $user->id;

        $post = FAQ::create($field);
        return $post;
    }

    /**
     * Display the specified resource.
     */
    public function show(string $FAQ_id)
    {
        $post = FAQ::where("id", $FAQ_id)->first();
        if(!$post){
            return response()->json(["err"=>"FAQ post not found"], 404);
        }
        return $post;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $FAQ_id)
    {
        $user = $request->user();
        $userRole = $user->role->RoleName;

        $field = null;

        $post = FAQ::where("id", $FAQ_id)->first();
        if(!$post){
            return response()->json(["err"=>"FAQ post not found"], 404);
        }

        if($userRole === "lawyer"){
            $field = $request->validate([
                "question" => 'required|string|max:255',
                "answer"    => 'required|string|max:255',
                "type"      => 'required|string|in:customer,lawyer',
                "resolved_status" => 'required|integer|between:0,1'
            ]);

            if($field["resolved_status"] === 1){
                $field["resolved_at"] = now();
            }
        }

        else if($userRole === "admin"){
            $field = $request->validate([
                "question"  => 'required|string|max:255',
                "answer"    => 'required|string|max:255',
                "type"      => 'required|string|in:customer,lawyer,system',
                "resolved_status" => 'required|integer|between:0,1'
            ]);

             if($field["resolved_status"] === 1){
                $field["resolved_at"] = now();
            }
        }

        if ($field === null){
            return ["err" => "Can not update this request"];
        }
        $post->update($field);
        return $post;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $FAQ_id)
    {
        $post = FAQ::where("id", $FAQ_id)->first();
        $post->delete();
        return response()->json([
            'successes' => 'Successfull destroy a record'
        ]);
    }
}
