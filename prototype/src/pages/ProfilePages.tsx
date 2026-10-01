import { ProfileAuth } from '../features/profile/ProfileAuth'
import { ProfileOverview } from '../features/profile/ProfileOverview'
import { ProfileOrders } from '../features/profile/ProfileOrders'
import { ProfileOrderDetail } from '../features/profile/ProfileOrderDetail'
import { ProfileData, ProfileFavorites, ProfileOrganizations, ProfileRecentlyViewed, ProfileReviews, ProfileServices } from '../features/profile/ProfileSections'
import { ProfileDocuments } from '../features/profile/ProfileDocuments'
import { ProfileHelp } from '../features/profile/ProfileHelp'
import { ProfileRecovery } from '../features/profile/ProfileRecovery'
import { ProfileAddresses } from '../features/profile/ProfileAddresses'

export function ProfileOverviewPage() { return <ProfileOverview /> }
export function ProfileAuthPage() { return <main className="profile-page profile-public-page"><ProfileAuth /></main> }
export function ProfileRecoveryPage() { return <main className="profile-page profile-public-page"><ProfileRecovery /></main> }
export function ProfileOrdersPage() { return <ProfileOrders /> }
export function ProfileOrderDetailPage() { return <ProfileOrderDetail /> }
export function ProfileOrganizationsPage() { return <ProfileOrganizations /> }
export function ProfileFavoritesPage() { return <ProfileFavorites /> }
export function ProfileRecentlyViewedPage() { return <ProfileRecentlyViewed /> }
export function ProfileServicesPage() { return <ProfileServices /> }
export function ProfileReviewsPage() { return <ProfileReviews /> }
export function ProfileDataPage() { return <ProfileData /> }
export function ProfileDocumentsPage() { return <ProfileDocuments /> }
export function ProfileHelpPage() { return <ProfileHelp /> }
export function ProfileAddressesPage() { return <ProfileAddresses /> }
