<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserTb;
use App\Models\LawyerFiles;
use Illuminate\Support\Facades\Gate;

class UserTbController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $field = null;
        $user = $request->user();
        if($user->role->RoleName === "customer" || $user->role->roleName === "admin"){
            $field = $request->validate([
                "name"  => "required|string|unique:userstb,name|max:255",
                "email" =>"required|max:255",
                'phone' => "min:10|nullable"
            ]);
        }

        if($user->email !== $field["email"]){
            $findEmail = UserTb::where("email", $field["email"])->first();
            if($findEmail){
                return response()->json([
                    "message"=>"Your new email already registered",
                    "errors"=> [
                        "email"=> ["The email already taken."]
                    ]],403);
            }
        }
        if($user->name !== $field["name"]){
            $findName = UserTb::where("name", $field["name"])->first();
            if($findName){
                return response()->json([
                    "message"=>"Your new username already registered",
                    "errors"=> [
                        "username"=> ["The username already taken."]
                    ]],403);
            }
        }

        if ($field === null){
            return response()->json([
                "message" => "Can not update this user", 
                "errors"=> [
                    "fieldNull" => "Cannot update this user"
                ]]
                , 403);
        }
        $user->update($field);
        
        return ['user' => $user->load('role')];
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserTb $findUser)
    {
        $user = $findUser;
        $findUser->delete();
        return response()->json(["successfull"=>"This user have been deleted", 
                                 "userDetail" => $user], 200);
    }
}
