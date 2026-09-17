import { ProfileAuth } from '../features/profile/ProfileAuth'
import { ProfileOverview } from '../features/profile/ProfileOverview'
import { ProfileOrders } from '../features/profile/ProfileOrders'
import { ProfileOrderDetail } from '../features/profile/ProfileOrderDetail'
import { ProfileData, ProfileFavorites, ProfileOrganizations, ProfileRecentlyViewed, ProfileReviews, ProfileServices } from '../features/profile/ProfileSections'

export function ProfileOverviewPage() { return <ProfileOverview /> }
export function ProfileAuthPage() { return <ProfileAuth /> }
export function ProfileOrdersPage() { return <ProfileOrders /> }
export function ProfileOrderDetailPage() { return <ProfileOrderDetail /> }
export function ProfileOrganizationsPage() { return <ProfileOrganizations /> }
export function ProfileFavoritesPage() { return <ProfileFavorites /> }
export function ProfileRecentlyViewedPage() { return <ProfileRecentlyViewed /> }
export function ProfileServicesPage() { return <ProfileServices /> }
export function ProfileReviewsPage() { return <ProfileReviews /> }
export function ProfileDataPage() { return <ProfileData /> }
