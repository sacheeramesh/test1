import authReducer from './authSlice'
import promotionReducer from './promotionSlice/promotion'

import applicationHistory from '@slices/promotionSlice/applicationHistory'
import promotionHistory from '@slices/promotionSlice/promotionHistory'



import commonReducer from './commonSlice/common'
import common_user_list from './commonSlice/userList'

// lead 
import leadReducer from './leadSlice'
import recommendationHistory from './leadSlice/recommendationHistory';

import specialPromotion from './specialPromotionSlice/specialPromotion'
import specialPromotionApplicationHistory from './specialPromotionSlice/applicationHistory'

//administration slices
import admin_manage_promotion_cycle from './adminSlices/promotionCycle'
import admin_notification_hub from './adminSlices/notificationHub'
import admin_manage_users from './adminSlices/users'
import admin_manage_withdrawal_requests from './adminSlices/withdrawalRequests'


//functional lead slices
import activeRequests from './functionalLeadSlices/activeRequest'
import fl_rejectedList from './functionalLeadSlices/rejectedList'
import fl_approvedList from './functionalLeadSlices/approvedList'

//promotion board slices
import promotionBoard from './promotionBoardSlice/activeRequest'
import approvedList from './promotionBoardSlice/approvedRequests'
import rejectedList from './promotionBoardSlice/rejectedRequests'
import pb_fl_rejectedList from './promotionBoardSlice/fl_rejectedList'

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { enableMapSet } from 'immer'

enableMapSet()

export const store = configureStore({
  reducer: {
    auth: authReducer,
    promotion: promotionReducer,
    applicationHistory: applicationHistory,
    promotionHistory : promotionHistory,
    
    admin_manage_promotion_cycle: admin_manage_promotion_cycle,
    admin_notification_hub: admin_notification_hub,
    admin_users: admin_manage_users,
    admin_withdrawal_requests: admin_manage_withdrawal_requests,

    // function lead reducers
    fl_requests: activeRequests,
    fl_approved_list: fl_approvedList,
    fl_rejected_list: fl_rejectedList,

    //promotionBoard 
    fL_approvedRequest: promotionBoard,
    pb_approvedRequests: approvedList,
    pb_rejectedRequests: rejectedList,
    pb_fl_rejectedList: pb_fl_rejectedList,
    
    lead: leadReducer,
    recommendationHistory : recommendationHistory,

    specialPromotion: specialPromotion,
    specialPromotionApplicationHistory : specialPromotionApplicationHistory,
    
    common: commonReducer,
    common_user_list : common_user_list
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: undefined
    })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector