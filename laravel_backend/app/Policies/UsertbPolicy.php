<?php

namespace App\Policies;

use App\Models\UserTb;
use Illuminate\Auth\Access\Response;

class UsertbPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(UserTb $userTb)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function checkUserId(UserTb $userTb, UserTb $findUSer)
    {
        if($userTb->id === $findUSer->id){
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(UserTb $userTb)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(UserTb $userTb, UserTb $userTbTb)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(UserTb $userTb, UserTb $userTbTb)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(UserTb $userTb, UserTb $userTbTb)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(UserTb $userTb, UserTb $userTbTb)
    {
        //
    }
}
