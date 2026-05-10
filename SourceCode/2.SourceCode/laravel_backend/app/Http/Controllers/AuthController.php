<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserTb;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request){
        $field = $request->validate([
            "name"=> "required|string|unique:userstb,name|max:80",
            "email"=>"required|unique:userstb,email|max:80",
            "password"=>"required|confirmed|max:255",
            'phone' => "min:8|max:12|required|string" 
        ]);

        $checkUserEmail = UserTb::where('email', $field['email'])->first();

        $checkUserName = UserTb::where('name', $field['name'])->first();

        if ($checkUserEmail || $checkUserName) {
            return response()->json([
                "message"=>"This user's email or name already registered",
                "errors"=> [
                    "email"=> $checkUserEmail ? ["The email field is already registered."] : [],
                    "name"=> $checkUserName ? ["The name field is already registered."] : [],
                    "password"=> ["The password field must be confirmed."]
                ]
            ], 403);
        }
        $field['password'] = bcrypt($field['password']);
        $newUser = UserTb::create([...$field, 'role_id' => 2]);
        $newUser->load("role");
        $userToken = $newUser->createToken($request->name)->plainTextToken;
        return ['user' => $newUser, 'token' => $userToken];
    }

    public function login(Request $request){
        $userLogin = $request->validate([
            'email'=>"required|max:255|exists:userstb,email",
            'password'=>"required"
        ]);

        $findUser = UserTb::where('email', $userLogin["email"])->first();
        if (!$findUser){
            return [
                "user_err"=> "Fail to find User"
            ];
        }

        if (!Hash::check($userLogin['password'], $findUser->password)){
            return [
                "password_err"=> "Wrong Password"
            ];
        }

        $makeToken = $findUser->createToken($findUser->name)->plainTextToken;
        return ['user' => $findUser->load("role"), 'token' => $makeToken];
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return [
            "success"=>true
        ];
    }

}
