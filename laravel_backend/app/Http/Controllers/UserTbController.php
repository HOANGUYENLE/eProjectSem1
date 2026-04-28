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
    public function show(UserTb $user)
    {

        if(!Gate::allows("checkUserId", $user)){
            abort(403,"You are not allow to see another user information");
        }
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
                "email" =>"required|unique:userstb,email|max:255",
                'phone' => "min:10|nullable"
            ]);
        }

        if ($field === null){
            return response()->json([
                "err" => "Can not update this user", 
                "user"=> $user]
                , 403);
        }
        $user->update($field);
        return $user;
    }

    public function upToLawyerRank(Request $request, LawyerFiles $lawyer, string $status){
        return $lawyer;
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
