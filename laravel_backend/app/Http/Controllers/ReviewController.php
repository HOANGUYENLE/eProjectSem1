<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LawyerFiles;
use App\Models\UserTb;
use App\Models\Review;

class ReviewController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $lawyerId)
    {
        $user = $request->user();
        $lawyer = LawyerFiles::with("reviews")->find($lawyerId);
        //$allReview = Review::with("UserTb", "LawyersFiles")->get();
        if (!$lawyer){
            return response()->json(["err"=>"Lawyer not found"], 404);
        }
        /** 
        if($allReview->where("user_id", $user->id)->where("lawyer_id", $lawyer->lawyer_id)->count() > 0){
            return response()->json(["err"=>"This User already leave comment to this lawyer"],403);
        }
        */
        $field = $request->validate([
            "rating" => "required|integer|between:1,5",
            "comment"=> "nullable|string",
        ]);
        $field["user_id"] = $user->id;
        $field["lawyer_id"] = $lawyer->lawyer_id;
        Review::create($field);
        $lawyer->load('reviews');
        return response()->json(["success"=>true], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $lawyerId)
    {
        $lawyer = LawyerFiles::with("reviews")->find($lawyerId);
        if(!$lawyer){
            return response()->json(["err"=>"Lawyer not found"], 404);
        }
        return response()->json($lawyer, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $lawyerId, string $reviewId)
    {
        $lawyer = LawyerFiles::with("reviews")->find($lawyerId);
        $review = $lawyer->reviews->where("id", $reviewId)->first();
        $field = $request->validate([
            "rating" => "required|integer|between:1,5",
            "comment"=> "nullable|string",
        ]);

        $review->update($field);
        return $review;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $lawyerId, string $reviewId)
    {
        $lawyer = LawyerFiles::with("reviews")->find($lawyerId);
        $review = $lawyer->reviews->where('id', $reviewId)->first();
        $review->delete();
        return response()->json(["success"=>"deleted successfully"], 200);
    }
}
