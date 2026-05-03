<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LawyerFiles;
use App\Models\Specialization;

class SpecialzationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Specialization::all();
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
    public function show(Specialization $spec)
    {
        $spec->load("lawyers");
        return response()->json([
            "lawyers" => $spec->lawyers->map(function ($lawyer) {
                $lawyer->load("UserTb");
                return [
                    "lawyer" => $lawyer,
                ];
            }) 
        ] ,200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $field = $request->validate([
            'specializations'  =>'required|array',
            'specializations.*'=>'distinct|exists:specializations,id'
        ]);
        $lawyer = LawyerFiles::where('lawyer_id', $user->id)->first();
        $lawyer->specialization()->sync($field['specializations']);
        $lawyer->load("specialization", "UserTb");
        return response()->json([
            "name" => $lawyer,
            "spec" => $lawyer->specialization->map(function ($s) {
                return [
                    "name" => $s->name,
                ];
            }) 
        ] ,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
