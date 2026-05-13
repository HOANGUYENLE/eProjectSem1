<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lawyer\SyncLawyerSpecializationsRequest;
use App\Http\Requests\Lawyer\UpdateLawyerProfileRequest;
use App\Http\Requests\Lawyer\UpsertAvailabilitySlotRequest;
use App\Models\AvailabilitySlot;
use App\Models\City;
use App\Models\LawyerFiles;
use App\Models\Specialization;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class LawyerModuleController extends Controller
{
    private function ensureLawyer(): void
    {
        $user = auth()->user();

        if (!$user) {
            abort(response()->json([
                'message' => 'Unauthenticated.'
            ], 401));
        }

        $roleName = optional($user->role)->RoleName ?? optional($user->role)->roleName ?? null;

        if ($roleName !== 'lawyer') {
            abort(response()->json([
                'message' => 'Only lawyer accounts can access this module.'
            ], 403));
        }
    }

    public function dashboard(): JsonResponse
    {
        $this->ensureLawyer();

        $profile = LawyerFiles::with(['specializations', 'availabilitySlots'])
            ->where('lawyer_id', auth()->id())
            ->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Lawyer profile not found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Lawyer dashboard loaded successfully.',
            'data' => [
                'verification_status' => $profile->status,
                'years_of_experience' => $profile->yearExp,
                'total_specializations' => $profile->specializations->count(),
                'total_available_slots' => $profile->availabilitySlots->count(),
                'booked_slots' => $profile->availabilitySlots->where('is_booked', true)->count(),
            ]
        ]);
    }

    public function profile(): JsonResponse
    {
        $this->ensureLawyer();

        $profile = LawyerFiles::with([
            'UserTb:id,name,email,phone,role_id',
            'cityRef:id,cityName',
            'specializations:id,name',
        ])->where('lawyer_id', auth()->id())->first();

        return response()->json([
            'message' => 'Lawyer profile loaded successfully.',
            'data' => $profile,
            'meta' => [
                'cities' => City::select('id', 'cityName')->orderBy('cityName')->get(),
            ]
        ]);
    }

 public function updateProfile(UpdateLawyerProfileRequest $request): JsonResponse
{
    $this->ensureLawyer();

    $lawyerId = auth()->id();
    $oldProfile = LawyerFiles::where('lawyer_id', $lawyerId)->first();
    $validated = $request->validated();

    $documentPath = $oldProfile?->documentImage;

    if ($request->hasFile('documentImage')) {
        if ($documentPath && Storage::disk('public')->exists($documentPath)) {
            Storage::disk('public')->delete($documentPath);
        }

        $documentPath = $request->file('documentImage')->store('lawyer-documents', 'public');
    }

    $profile = LawyerFiles::updateOrCreate(
        ['lawyer_id' => $lawyerId],
        [
            'address' => $validated['address'],
            'yearExp' => (int) $validated['yearExp'],
            'cardNumber' => $validated['cardNumber'],
            'city' => (int) $validated['city'],
            'licenseNumber' => $validated['licenseNumber'],
            'documentImage' => $documentPath,
            'status' => $oldProfile?->status ?? 'pending',
        ]
    );

    $profile->refresh();

    return response()->json([
        'message' => 'Lawyer profile saved successfully.',
        'data' => $profile->load([
            'userTb:id,name,email,phone,role_id',
            'cityRef:id,cityName',
            'specializations:id,name',
        ])
    ]);
}

    public function specializations(): JsonResponse
    {
        $this->ensureLawyer();

        $profile = LawyerFiles::with('specializations:id,name')
            ->where('lawyer_id', auth()->id())
            ->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Create your lawyer profile first.'
            ], 422);
        }

        return response()->json([
            'message' => 'Lawyer specializations loaded successfully.',
            'data' => [
                'available_specializations' => Specialization::select('id', 'name')
                    ->orderBy('name')
                    ->get(),
                'selected_specialization_ids' => $profile->specializations->pluck('id')->values(),
            ]
        ]);
    }

    public function syncSpecializations(SyncLawyerSpecializationsRequest $request): JsonResponse
    {
        $this->ensureLawyer();

        $profile = LawyerFiles::where('lawyer_id', auth()->id())->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Create your lawyer profile first.'
            ], 422);
        }

        $profile->specializations()->sync($request->specialization_ids);

        return response()->json([
            'message' => 'Lawyer specializations updated successfully.',
            'data' => $profile->load('specializations:id,name'),
        ]);
    }

    public function slots(): JsonResponse
    {
        $this->ensureLawyer();

        $profile = LawyerFiles::where('lawyer_id', auth()->id())->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Create your lawyer profile first.'
            ], 422);
        }

        $slots = AvailabilitySlot::where('lawyer_id', auth()->id())
            ->orderByRaw("FIELD(day_of_week, 'Mon','Tue','Wed','Thu','Fri','Sat','Sun')")
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'message' => 'Availability slots loaded successfully.',
            'data' => $slots
        ]);
    }

    public function storeSlot(UpsertAvailabilitySlotRequest $request): JsonResponse
    {
        $this->ensureLawyer();

        $profile = LawyerFiles::where('lawyer_id', auth()->id())->first();

        if (!$profile) {
            return response()->json([
                'message' => 'Create your lawyer profile first.'
            ], 422);
        }

        $this->validateNoOverlap(
            auth()->id(),
            $request->day_of_week,
            $request->start_time,
            $request->end_time
        );

        $slot = AvailabilitySlot::create([
            'lawyer_id' => auth()->id(),
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'is_booked' => 0,
        ]);

        return response()->json([
            'message' => 'Availability slot created successfully.',
            'data' => $slot
        ], 201);
    }

    public function updateSlot(UpsertAvailabilitySlotRequest $request, int $id): JsonResponse
    {
        $this->ensureLawyer();

        $slot = AvailabilitySlot::where('id', $id)
            ->where('lawyer_id', auth()->id())
            ->firstOrFail();

        $this->validateNoOverlap(
            auth()->id(),
            $request->day_of_week,
            $request->start_time,
            $request->end_time,
            $slot->id
        );

        $slot->update([
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return response()->json([
            'message' => 'Availability slot updated successfully.',
            'data' => $slot
        ]);
    }

    public function deleteSlot(int $id): JsonResponse
    {
        $this->ensureLawyer();

        $slot = AvailabilitySlot::where('id', $id)
            ->where('lawyer_id', auth()->id())
            ->firstOrFail();

        if ($slot->is_booked) {
            return response()->json([
                'message' => 'Booked slot cannot be deleted.'
            ], 422);
        }

        $slot->delete();

        return response()->json([
            'message' => 'Availability slot deleted successfully.'
        ]);
    }

    private function validateNoOverlap(
        int $lawyerId,
        string $dayOfWeek,
        string $startTime,
        string $endTime,
        ?int $ignoreId = null
    ): void {
        $query = AvailabilitySlot::where('lawyer_id', $lawyerId)
            ->where('day_of_week', $dayOfWeek)
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where('start_time', '<', $endTime)
                  ->where('end_time', '>', $startTime);
            });

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        if ($query->exists()) {
            abort(response()->json([
                'message' => 'Time range overlaps with an existing slot.'
            ], 422));
        }
    }
}
