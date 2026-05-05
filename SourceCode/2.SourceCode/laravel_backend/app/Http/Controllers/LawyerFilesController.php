<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LawyerFiles;
use App\Models\UserTb;
use Illuminate\Support\Facades\Storage;

class LawyerFilesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allLawyer = LawyerFiles::with(["UserTb", "city", "specialization", 
        "availability"=>function ($each){ 
            $each->orderBy("day_of_week");
        }])->get()->map(function ($lawyer){
            $lawyer->documentImage = $lawyer->documentImage?
            asset('storage/' . $lawyer->documentImage)
            :null;
            return $lawyer;
        });
        return $allLawyer;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $field = $request->validate([
            'address'        => 'required|string|max:200',
            'yearExp'        => 'nullable|integer|min:0',
            'cardNumber'     => 'required|string|max:20',
            'city'           => 'nullable|integer|exists:cities,id',
            'licenseNumber'  => 'required|string|max:50',
            'documentImage'  => 'nullable|image|mimes:jpg,jpeg,png,avif|max:2048',
            'specializations'  =>'required|array',
            'specializations.*'=>'distinct|exists:specializations,id'
        ]);

        $findLawyer = LawyerFiles::where('lawyer_id', $user->id)->first();
        if($findLawyer){
            if($findLawyer->status === 'reject'){
                $findLawyer->delete();
            }
            else if($findLawyer->status === 'pending' || $findLawyer->status === 'approve'){
                return response()->json(["err"=>"This form is have been submitted or approved"],422);
            }
        }
        $field["lawyer_id"] = $user->id;
        $field["status"] = "pending";
        if($request->hasFile('documentImage')){
            $file     = $request->file('documentImage');
            $filename = 'lawyer_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('lawyer_profiles', $filename, 'public');

            $field['documentImage'] = $path;
        }

        $lawyerData = collect($field)->except('specializations')->toArray();
        LawyerFiles::create($lawyerData);
        $newCreatedLawyer = LawyerFiles::where('lawyer_id', $user->id)->first();
        $newCreatedLawyer->specialization()->sync($field['specializations']);
        $newCreatedLawyer->load("UserTb", "specialization");
        return response()->json(["success"=>$newCreatedLawyer],200);
    }

    /**
     * Display the specified resource.
     */
    public function show(LawyerFiles $lawyer)
    {
        $lawyer->load("UserTb", "specialization", "reviews", "city");
        return response()->json([
            "address"=>$lawyer->address,
            "year" => $lawyer->yearExp,
            "city" => $lawyer->city,
            "image" => asset('storage/' . $lawyer->documentImage),
            "spec" => $lawyer->specialization->map(function ($s) {
                return [
                    "id"   => $s->id,
                    "name" => $s->name,
                ];
            }),
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LawyerFiles $lawyer)
    {
        $field = $request->validate([
            'status'    => 'required|in:pending,approve,reject',
        ]);
        $lawyer->update($field);
        if($lawyer->status === 'approve'){
            $user = UserTb::find($lawyer->lawyer_id);
            if($user){
                $user->update(['role_id'=>3]);
            }   
        }
        if($lawyer->status === 'reject'){
            $user = UserTb::find($lawyer->lawyer_id);
            if($user){
                $user->update(['role_id'=>2]);
            }
        }
        $lawyer->load("UserTb");
        return response()->json(["success"=>true],200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LawyerFiles $lawyer)
    {
    }
}
