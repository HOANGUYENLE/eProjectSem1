<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserTbController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SystemNotificationController;
use App\Http\Controllers\PivotSys;
use App\Http\Controllers\LawyerFilesController;
use App\Http\Controllers\AvailableSlotController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SpecialzationController;
use App\Http\Controllers\CityController;
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

Route::apiResource('reviews', ReviewController::class);

Route::get('/faq', [FaqController::class, 'index']);
Route::get('/faq/{post}', [FaqController::class, 'show']);
Route::get('/lawyer/{lawyerID}/reviews', [ReviewController::class, 'show']);

Route::get('/lawyerProfile/{lawyer}', [LawyerFilesController::class, 'DetailLawyerInfo']);
Route::get("/seeLawyer/{lawyer}", [LawyerFilesController::class, 'show']);

Route::get('/SysNotice', [SystemNotificationController::class, 'index']);
Route::get('/SysNotice/{systemNotice}', [SystemNotificationController::class, 'show']);

Route::get("/allLawyers", [LawyerFilesController::class, 'index']);
Route::get("/allSpecs", [SpecialzationController::class, 'index']);
Route::get("/lawyerSchedule/{lawyer}", [AvailableSlotController::class, 'show']);
Route::get("/listCity", [CityController::class, "index"]);

Route::middleware(['auth:sanctum', 'roles:1,2,3'])->group(function(){
    Route::get('/reminder/detail/{user}', [PivotSys::class, 'show']);
    Route::get('/reminder/{user}', [PivotSys::class, 'index']);
    Route::post('/faq', [FaqController::class, 'store']);
    Route::post('/lawyer/{lawyer}/reviews', [ReviewController::class, 'store']);
    Route::get('/profile', [UserTbController::class, 'show']);
    Route::put('/profile/update', [UserTbController::class, 'update']);
});
Route::middleware(['auth:sanctum', 'roles:1,3'])->group(function(){
    Route::put('/faq/{id}', [FaqController::class, 'update']);
});

Route::middleware(['auth:sanctum', 'roles:2,3'])->group(function(){
    Route::get('/booking/seeBooking', [AppointmentController::class, 'show']);
    Route::post("/updateBooking/{status}", [AppointmentController::class, 'CUReschedule']);
    Route::get("/reminder", [AppointmentController::class, 'sendReminder']);
    Route::post("/ReadCancel/{notification}",[AppointmentController::class, 'isReadCancel']);
});

Route::middleware(['auth:sanctum', 'roles:1'])->group(function(){
    Route::post('/SysNotice', [SystemNotificationController::class, 'store']);
    Route::put('/SysNotice/{systemNotification}', [SystemNotificationController::class, 'update']);
    Route::put('/confirmDocument/{lawyer}', [LawyerFilesController::class, 'update']);
    
    Route::delete('/faq/{id}', [FaqController::class, 'destroy']);
    Route::delete('/lawyer/{lawyerID}/reviews/{reviewID}', [ReviewController::class, 'destroy']);
    Route::delete('/SysNotice/{systemNotification}', [SystemNotificationController::class, 'destroy']);
    Route::delete('/delSysNotices', [SystemNotificationController::class, 'destroyMany']);
    Route::get('/allAppointment/{year}', [AppointmentController::class, 'seeAppointmentByYear']);
    Route::get('/allUsers', [UserTbController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'roles:2'])->group(function(){
    Route::post("/sendDocument", [LawyerFilesController::class, 'store']);
    Route::post('/booking', [AppointmentController::class, 'store']);
    
});

Route::middleware(['auth:sanctum', 'roles:3'])->group(function(){
    Route::post("/addNewSlot", [AvailableSlotController::class, 'store']);
    Route::delete("/destroyOneSlot/{id}", [AvailableSlotController::class, 'destroy']);
    Route::post("/completed/{appointment}",[AppointmentController::class, 'isExpired']);
});


Route::post('/login', [AuthController::class , 'login']);
Route::post('/register', [AuthController::class , 'register']);
Route::post('/logout', [AuthController::class , 'logout'])->middleware('auth:sanctum');