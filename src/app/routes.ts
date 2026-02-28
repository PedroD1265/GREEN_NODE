import { createBrowserRouter } from 'react-router';
import { MobileLayout } from './layouts/MobileLayout';
import LandingPage from './pages/LandingPage';
import LaunchChecklist from './pages/LaunchChecklist';
// User screens
import UserHome from './pages/user/UserHome';
import AIHub from './pages/user/AIHub';
import IdentifyWaste from './pages/user/IdentifyWaste';
import CreateCase from './pages/user/CreateCase';
import IncentiveChoice from './pages/user/IncentiveChoice';
import CollectorOffers from './pages/user/CollectorOffers';
import AutoAssign from './pages/user/AutoAssign';
import CasesList from './pages/user/CasesList';
import CaseStatus from './pages/user/CaseStatus';
import Rewards from './pages/user/Rewards';
import Centers from './pages/user/Centers';
import ManualCase from './pages/user/ManualCase';
// Collector screens
import CollectorOnboarding from './pages/collector/CollectorOnboarding';
import CollectorHome from './pages/collector/CollectorHome';
import CollectorRequests from './pages/collector/CollectorRequests';
import CollectorRequestDetail from './pages/collector/CollectorRequestDetail';
import CollectorRoute from './pages/collector/CollectorRoute';
import PickupConfirmation from './pages/collector/PickupConfirmation';
import CollectorProfile from './pages/collector/CollectorProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MobileLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'launch-checklist', Component: LaunchChecklist },
      // User Mode
      { path: 'user/home', Component: UserHome },
      { path: 'user/ai', Component: AIHub },
      { path: 'user/photos', Component: IdentifyWaste },
      { path: 'user/create-case', Component: CreateCase },
      { path: 'user/incentive', Component: IncentiveChoice },
      { path: 'user/collector-offers', Component: CollectorOffers },
      { path: 'user/auto-assign', Component: AutoAssign },
      { path: 'user/cases', Component: CasesList },
      { path: 'user/case/:id', Component: CaseStatus },
      { path: 'user/rewards', Component: Rewards },
      { path: 'user/centers', Component: Centers },
      { path: 'user/manual-case', Component: ManualCase },
      // Collector Mode
      { path: 'collector/onboarding', Component: CollectorOnboarding },
      { path: 'collector/home', Component: CollectorHome },
      { path: 'collector/requests', Component: CollectorRequests },
      { path: 'collector/request/:id', Component: CollectorRequestDetail },
      { path: 'collector/route', Component: CollectorRoute },
      { path: 'collector/pickup/:id', Component: PickupConfirmation },
      { path: 'collector/profile', Component: CollectorProfile },
      // Fallback
      { path: '*', Component: LandingPage },
    ],
  },
]);
