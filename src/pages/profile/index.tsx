import { useGetProfileQuery } from '@/services/leApi/authApi';
import { useAppSelector } from '@/store/hooks';
import StaffDetails from '../staff/StaffDetails';
import StudentDetails from '../students/StudentDetails';

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: profileData, isLoading, isError } = useGetProfileQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !user || !profileData?.profile?.id) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600">Error loading profile</h2>
        <p className="text-gray-600 mt-2">Please try again later.</p>
      </div>
    );
  }

  const profileId = profileData.profile.id;

  if (user.role === 'STAFF' || user.role === 'ADMIN') {
    return <StaffDetails staffId={profileId} hideBackButton={true} />;
  }

  return <StudentDetails studentId={profileId} hideBackButton={true} />;
};

export default Profile;