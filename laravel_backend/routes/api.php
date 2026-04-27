<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserTbController;
use App\Http\Controllers\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
/*
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::apiResource('usertb', UserTbController::class);
Route::apiResource('reviews', ReviewController::class);


Route::get('/faq', [FaqController::class, 'index']);
Route::get('/faq/{post}', [FaqController::class, 'show']);
Route::get('/lawyer/{lawyerID}/reviews', [ReviewController::class, 'show']);

Route::middleware(['auth:sanctum', 'roles:1,2,3'])->group(function(){
    Route::post('/faq', [FaqController::class, 'store']);
    Route::post('/lawyer/{lawyer}/reviews', [ReviewController::class, 'store']);
});
Route::middleware(['auth:sanctum', 'roles:1,3'])->group(function(){
    Route::put('/faq/{id}', [FaqController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'roles:1'])->group(function(){
    Route::put('/lawyer/{lawyerID}/reviews/{reviewID}', [ReviewController::class, 'update']);    
    Route::delete('/faq/{id}', [FaqController::class, 'destroy']);
    Route::delete('/lawyer/{lawyerID}/reviews/{reviewID}', [ReviewController::class, 'destroy']);
    
});


Route::post('/login', [AuthController::class , 'login']);
Route::post('/register', [AuthController::class , 'register']);
Route::post('/logout', [AuthController::class , 'logout'])->middleware('auth:sanctum');