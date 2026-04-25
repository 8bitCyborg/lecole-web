import React from 'react';
import { useGetProfileQuery } from '../../services/leApi/authApi';
import { useAppSelector } from '../../store/hooks';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Building,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import './styles.css';

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

  if (isError || !user) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600">Error loading profile</h2>
        <p className="text-gray-600 mt-2">Please try again later or log in again.</p>
      </div>
    );
  }

  const { memberships, profile } = profileData || { memberships: [], profile: null };

  return (
    <div className="profile-page-container">
      {/* Restored Banner Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl mb-8">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl font-black border border-white/30 shadow-2xl shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black tracking-tight">{user.firstName} {user.lastName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center opacity-90 text-sm font-medium">
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full border border-white/20">
                <Shield size={14} /> {user.role}
              </span>
              <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full border border-white/20">
                <Mail size={14} /> {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full border border-white/20">
                  <Phone size={14} /> {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Decorative background shapes */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl opacity-50" />
      </div>

      <div className="profile-tabs-card">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="profile-tabs-list">
            <TabsTrigger value="personal" className="profile-tabs-trigger">
              <UserIcon size={18} />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="academic" className="profile-tabs-trigger">
              {user.role === 'STUDENT' ? <GraduationCap size={18} /> : <Briefcase size={18} />}
              Academic Profile
            </TabsTrigger>
            <TabsTrigger value="schools" className="profile-tabs-trigger">
              <Building size={18} />
              My Schools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="profile-tabs-content">
            <div className="tab-content-container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailItem label="First Name" value={user.firstName} icon={<UserIcon size={16} />} />
                <DetailItem label="Last Name" value={user.lastName} icon={<UserIcon size={16} />} />
                <DetailItem label="Email" value={user.email} icon={<Mail size={16} />} />
                <DetailItem label="Phone" value={user.phone || 'N/A'} icon={<Phone size={16} />} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="academic" className="profile-tabs-content">
            <div className="tab-content-container">
              {profile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {user.role === 'STAFF' || user.role === 'ADMIN' && (
                    <>
                      <DetailItem label="Designation" value={profile.designation} />
                      <DetailItem label="Staff ID" value={profile.staffId || 'Not Assigned'} />
                      <DetailItem label="Teaching Staff" value={profile.isTeachingStaff ? 'Yes' : 'No'} />
                      <DetailItem label="Gender" value={profile.gender} />
                      <div className="md:col-span-2 mt-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Professional Biography</p>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium italic">
                          "{profile.bio || "No biography provided yet. Tell us about your journey and expertise."}"
                        </p>
                      </div>
                    </>
                  )}

                  {user.role === 'STUDENT' && (
                    <>
                      <DetailItem label="Admission No" value={profile.admissionNumber || 'N/A'} />
                      <DetailItem label="Current Status" value={profile.status} />
                      <DetailItem label="Gender" value={profile.gender} />
                      <DetailItem label="Fees Paid" value={profile.isFeesPaid ? 'Full Payment' : 'Pending'} />
                      <DetailItem label="Date of Birth" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'N/A'} />
                      <DetailItem label="Guardian Contact" value={profile.guardianPhone} />
                      <DetailItem label="Guardian Email" value={profile.guardianEmail} />
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                    <UserIcon size={40} />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-xl font-black">Profile Pending Setup</h3>
                    <p className="text-slate-500 text-sm mt-2">Your detailed profile information for this school is still being prepared by the administration.</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="schools" className="profile-tabs-content">
            <div className="tab-content-container">
              <div className="space-y-4">
                {memberships.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-200">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">
                        {m.school.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold">{m.school.name}</p>
                        <p className="text-xs uppercase font-black text-slate-400 mt-1">{m.role}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {m.status}
                    </span>
                  </div>
                ))}
                {memberships.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">No schools joined yet.</p>
                )}
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="group">
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-slate-400 group-hover:text-blue-600 transition-colors uppercase text-[10px] font-black tracking-widest">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {icon && <span className="text-slate-300 group-hover:text-blue-400 transition-colors">{icon}</span>}
      <p className="font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

export default Profile;