import { lazy } from 'react';

const Help = lazy(() => import('./help/help'));
const Dashboard = lazy(() => import('./promotion/promotion'));
const LeadView = lazy(() => import('./lead/lead'));
const SpecialPromotion = lazy(() => import('./specialPromotion/specialPromotion'));
const Administration = lazy(() => import('./administration/administration'));
const PromotionBoard = lazy(() => import('./promotionBoard/promotionBoard'));
const FunctionalLead = lazy(() => import('./functionalLead/functionalLead'));
const StandardPromotion = lazy(() => import('./standardPromotion/standardPromotion'));

export const View = {
  Dashboard,
  LeadView,
  SpecialPromotion,
  Administration,
  PromotionBoard,
  FunctionalLead,
  StandardPromotion,
  Help
};

