import React from "react";

import {
  activePromotionBanner,
  button,
  messageSection,
  noActivePromotionCycle,
  userNotEligible,
  userWithdrawalRequested,
} from "@component/common/banners";

import {
  applyForPromotion,
  ApplicationState,
} from "@slices/promotionSlice/promotion";

import { useAppDispatch, useAppSelector, RootState } from "@slices/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import StateWithImage from "@component/ui/stateWithImage";
export default function PromotionSubView() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const promotion = useAppSelector((state: RootState) => state.promotion);
  const auth = useAppSelector((state: RootState) => state.auth);

  const ApplyForPromotion = () => {
    if (promotion.activePromotionCycle && auth.userInfo?.email) {
      dispatch(
        applyForPromotion({
          promotionId: promotion.activePromotionCycle?.id,
          employeeEmail: auth.userInfo?.email,
          redirect: () => {
            searchParams.set("subView", "application");
            setSearchParams(searchParams);
          },
        })
      );
    } else {
      //TODO: need to dispatch error handler
    }
  };

  return (
    <>
      {promotion.state === "success" && (
        <>
          <StateWithImage imageUrl="/promotion.svg" message="" />
          {promotion.activePromotionCycle &&
          promotion.userEligibility?.eligible ? (
            <>
              {activePromotionBanner(
                promotion.activePromotionCycle.name,
                promotion.activePromotionCycle.startDate,
                promotion.activePromotionCycle.endDate
              )}

              {/* user already applied for the active promotion */}
              {/* {promotion.activePromotionCycle.request?.status !==
                ApplicationState.DRAFT &&
                promotion.activePromotionCycle.request?.status !==
                  ApplicationState.REMOVED &&
                promotion.activePromotionCycle.request?.status &&
                (promotion.activePromotionCycle.request?.promotionType ===
                "NORMAL"
                  ? messageSection(
                      "You have already applied for this promotion"
                    )
                  : messageSection("A lead was requested a promotion for you"))} */}

              {/* {promotion.activePromotionCycle.request?.status ===
                ApplicationState.SUBMITTED &&
                promotion.activePromotionCycle.request?.promotionType ===
                  "NORMAL" &&
                button(
                  "View Application",
                  () => {
                    searchParams.set("subView", "application");
                    setSearchParams(searchParams);
                  },
                  false
                )} */}

              {/* user already requested for withdrawal for promotion */}
              {/* {promotion.activePromotionCycle.request?.status ===
                ApplicationState.WITHDRAW &&
                promotion.activePromotionCycle.request?.promotionType ===
                  "NORMAL" &&
                userWithdrawalRequested()} */}

              {/* if there is a drafted application */}
              {/* {promotion.activePromotionCycle.request?.status ===
                ApplicationState.DRAFT &&
                promotion.activePromotionCycle.request?.promotionType ===
                  "NORMAL" &&
                button(
                  "Edit Draft",
                  () => {
                    searchParams.set("subView", "application");
                    setSearchParams(searchParams);
                  },
                  false
                )} */}
              {/* if there is no drafted application
              {!promotion.activePromotionCycle.request &&
                button("Apply", ApplyForPromotion, false)} */}
            </>
          ) : (
            <>
              {/* USER NOT ELIGIBLE */}
              {promotion.activePromotionCycle &&
              !promotion.userEligibility?.eligible
                ? userNotEligible()
                : noActivePromotionCycle()}
            </>
          )}
        </>
      )}
    </>
  );
}
